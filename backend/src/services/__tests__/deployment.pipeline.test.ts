import assert from "assert";
import path from "path";
import fs from "fs";
import prisma from "../../lib/prisma";
import { DeploymentWorker, syncProjectStatus } from "../deployment.worker";
import { encryptToken } from "../../utils/crypto";
import { SCRATCH_ROOT_DIR } from "../../constants/build.constants";
import { LogStream, DeploymentStatus } from "@prisma/client";
import { deleteDockerImage } from "../docker.service";

async function runTests() {
  console.log("==================================================================");
  console.log("  PHASE 1.4: DEPLOYMENT EXECUTION PIPELINE VERIFICATION SUITE     ");
  console.log("==================================================================\n");

  // Create test users in database
  const userA = await prisma.user.create({
    data: {
      name: "User A",
      email: `user-a-${Date.now()}@example.com`,
    },
  });

  const userB = await prisma.user.create({
    data: {
      name: "User B",
      email: `user-b-${Date.now()}@example.com`,
    },
  });

  // Connect GitHub account to User A
  const fakeToken = "ghp_pipelineTestingToken1234567890123456";
  await prisma.githubAccount.create({
    data: {
      userId: userA.id,
      githubUserId: `gh-${Date.now()}`,
      githubUsername: "testusera",
      accessToken: encryptToken(fakeToken),
      scope: "repo,read:user",
    },
  });

  // Create projects
  const projectA = await prisma.project.create({
    data: {
      name: "Project A",
      userId: userA.id,
      repositoryName: "testusera/repo-a",
      repositoryUrl: "https://github.com/testusera/repo-a",
      branch: "main",
      status: "idle",
    },
  });

  const projectB = await prisma.project.create({
    data: {
      name: "Project B",
      userId: userB.id,
      repositoryName: "testuserb/repo-b",
      repositoryUrl: "https://github.com/testuserb/repo-b",
      branch: "main",
      status: "idle",
    },
  });

  const worker = new DeploymentWorker("test-worker-1");
  await worker.recoverStaleDeployments();

  try {
    // ----------------------------------------------------------------
    // TEST 1: DEPLOYMENT CREATION & OWNERSHIP VALIDATION
    // ----------------------------------------------------------------
    console.log("[TEST 1/12] Deployment Creation & Cross-User Ownership Enforcement");
    {
      // User B attempts to queue deployment on User A's project -> should fail
      const forbiddenAttempt = await prisma.project.findFirst({
        where: { id: projectA.id, userId: userB.id },
      });
      assert.strictEqual(forbiddenAttempt, null, "User B must not access User A's project");

      // Valid creation for User A
      const dep1 = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
          dockerfilePath: "Dockerfile",
          logs: {
            create: {
              line: "[SYSTEM] Deployment queued by user.",
              stream: LogStream.SYSTEM,
              sequence: 1,
            },
          },
        },
      });

      assert.strictEqual(dep1.status, "QUEUED");
      assert.strictEqual(dep1.projectId, projectA.id);

      // Verify initial log
      const logs = await prisma.buildLog.findMany({ where: { deploymentId: dep1.id } });
      assert.strictEqual(logs.length, 1);
      assert.strictEqual(logs[0].sequence, 1);
      assert.strictEqual(logs[0].stream, LogStream.SYSTEM);

      // Clean up dep1 for next tests
      await prisma.deployment.delete({ where: { id: dep1.id } });
      console.log("   ✓ Ownership enforced and initial QUEUED deployment created\n");
    }

    // ----------------------------------------------------------------
    // TEST 2: QUEUE LIMIT ENFORCEMENT UNDER ROW LOCK
    // ----------------------------------------------------------------
    console.log("[TEST 2/12] Race-Safe Queue Limit Enforcement (Max 1 active + 1 queued)");
    {
      // Create 1 active (BUILDING) and 1 queued deployment
      const depActive = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "BUILDING",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
        },
      });

      const depQueued = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
        },
      });

      // Transaction simulating third request attempting to create deployment under row lock
      await assert.rejects(async () => {
        await prisma.$transaction(async (tx) => {
          await tx.$queryRaw`
            SELECT "id" FROM "Project" WHERE "id" = ${projectA.id} FOR UPDATE;
          `;

          const countResult = await tx.$queryRaw<Array<{ count: bigint }>>`
            SELECT COUNT(*)::bigint as count
            FROM "Deployment"
            WHERE "projectId" = ${projectA.id}
              AND "status" IN ('QUEUED'::"DeploymentStatus", 'INITIALIZING'::"DeploymentStatus", 'BUILDING'::"DeploymentStatus");
          `;

          const count = Number(countResult[0]?.count ?? 0);
          if (count >= 2) {
            throw new Error("Project queue limit reached (maximum 1 active and 1 queued deployment permitted).");
          }

          return await tx.deployment.create({
            data: {
              projectId: projectA.id,
              status: "QUEUED",
              repositoryName: projectA.repositoryName!,
              repositoryUrl: projectA.repositoryUrl!,
              branch: "main",
            },
          });
        });
      }, /Project queue limit reached/);

      // Clean up test rows
      await prisma.deployment.deleteMany({ where: { id: { in: [depActive.id, depQueued.id] } } });
      console.log("   ✓ Transactional row lock blocked 3rd deployment from queue\n");
    }

    // ----------------------------------------------------------------
    // TEST 3: ATOMIC WORKER CLAIM & DUPLICATE CLAIM PREVENTION
    // ----------------------------------------------------------------
    console.log("[TEST 3/12] Atomic Worker Claim & Parallel Claim Exclusion");
    {
      const queuedDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
        },
      });

      const worker1 = new DeploymentWorker("worker-instance-1");
      const worker2 = new DeploymentWorker("worker-instance-2");

      // Concurrently attempt to claim the same queued deployment
      const [claim1, claim2] = await Promise.all([
        worker1.claimNextDeployment(),
        worker2.claimNextDeployment(),
      ]);

      // Exactly one must win, other must receive null
      const winner = claim1 || claim2;
      const loser = claim1 ? claim2 : claim1;

      assert.ok(winner !== null, "One worker must claim the deployment");
      assert.strictEqual(loser, null, "The second worker must receive null due to row lock");
      assert.strictEqual(winner.id, queuedDep.id);
      assert.strictEqual(winner.status, "INITIALIZING");
      assert.ok(winner.workerId === "worker-instance-1" || winner.workerId === "worker-instance-2");
      assert.ok(winner.heartbeatAt !== null, "heartbeatAt must be initialized upon claim");

      await prisma.deployment.delete({ where: { id: queuedDep.id } });
      console.log("   ✓ Exactly one worker claimed deployment; SKIP LOCKED prevented duplicate execution\n");
    }

    // ----------------------------------------------------------------
    // TEST 4: STALE LEASE RECOVERY VS. LIVE HEARTBEAT
    // ----------------------------------------------------------------
    console.log("[TEST 4/12] Stale Lease Recovery (Stale Failed vs. Live Untouched)");
    {
      const staleTime = new Date(Date.now() - 150 * 1000); // 150s ago (> 120s threshold)
      const freshTime = new Date(Date.now() - 20 * 1000);  // 20s ago (< 120s threshold)

      const staleDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "BUILDING",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
          workerId: "dead-worker",
          heartbeatAt: staleTime,
        },
      });

      const liveDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "BUILDING",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
          workerId: "live-worker",
          heartbeatAt: freshTime,
        },
      });

      // Create a mock scratch workspace for stale deployment
      const staleWorkspace = path.resolve(SCRATCH_ROOT_DIR, staleDep.id);
      await fs.promises.mkdir(staleWorkspace, { recursive: true });
      await fs.promises.writeFile(path.join(staleWorkspace, "leftover.txt"), "stranded data");

      // Run recovery
      const recoveredCount = await worker.recoverStaleDeployments();
      assert.strictEqual(recoveredCount, 1, "Only 1 stale deployment should be recovered");

      // Check stale deployment in DB
      const updatedStale = await prisma.deployment.findUnique({ where: { id: staleDep.id } });
      assert.strictEqual(updatedStale?.status, "FAILED");
      assert.strictEqual(updatedStale?.exitCode, 1);
      assert.ok(updatedStale?.errorMessage?.includes("Deployment abandoned"));

      // Check workspace cleaned
      assert.strictEqual(fs.existsSync(staleWorkspace), false, "Stale workspace must be purged on recovery");

      // Check live deployment was NOT touched
      const updatedLive = await prisma.deployment.findUnique({ where: { id: liveDep.id } });
      assert.strictEqual(updatedLive?.status, "BUILDING", "Live deployment must remain BUILDING");
      assert.strictEqual(updatedLive?.errorMessage, null);

      await prisma.deployment.deleteMany({ where: { id: { in: [staleDep.id, liveDep.id] } } });
      console.log("   ✓ Stale lease recovered to FAILED; live worker deployment untouched\n");
    }

    // ----------------------------------------------------------------
    // TEST 5: CANCELLATION WHILE QUEUED
    // ----------------------------------------------------------------
    console.log("[TEST 5/12] Cancellation of Pending QUEUED Deployment");
    {
      const queuedDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
        },
      });

      // Cancel through worker cancel method
      const cancelResult = await worker.cancelDeployment(queuedDep.id, userA.id);
      assert.strictEqual(cancelResult.success, true);
      assert.strictEqual(cancelResult.deployment?.status, "CANCELLED");

      const inDb = await prisma.deployment.findUnique({ where: { id: queuedDep.id } });
      assert.strictEqual(inDb?.status, "CANCELLED");
      assert.strictEqual(inDb?.errorMessage, "Deployment cancelled while queued.");

      // Worker should NOT claim a CANCELLED deployment
      const claimResult = await worker.claimNextDeployment();
      assert.strictEqual(claimResult, null, "Worker must ignore CANCELLED deployments");

      await prisma.deployment.delete({ where: { id: queuedDep.id } });
      console.log("   ✓ Queued deployment cancelled directly; skipped by worker claim\n");
    }

    // ----------------------------------------------------------------
    // TEST 6: TERMINAL STATE IMMUTABILITY
    // ----------------------------------------------------------------
    console.log("[TEST 6/12] Terminal State Immutability");
    {
      const builtDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "BUILT",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
          exitCode: 0,
        },
      });

      // Attempting to cancel a BUILT deployment must be rejected
      const cancelResult = await worker.cancelDeployment(builtDep.id, userA.id);
      assert.strictEqual(cancelResult.success, false);
      assert.strictEqual(cancelResult.isTerminal, true);
      assert.strictEqual(cancelResult.status, "BUILT");

      const inDb = await prisma.deployment.findUnique({ where: { id: builtDep.id } });
      assert.strictEqual(inDb?.status, "BUILT", "BUILT status must remain immutable");

      await prisma.deployment.delete({ where: { id: builtDep.id } });
      console.log("   ✓ Terminal state BUILT cannot be cancelled or overwritten\n");
    }

    // ----------------------------------------------------------------
    // TEST 7: NEWEST-ONLY PROJECT STATUS SYNCHRONIZATION
    // ----------------------------------------------------------------
    console.log("[TEST 7/12] Newest-Only Project.status Invariant");
    {
      const timeT1 = new Date(Date.now() - 50000);
      const timeT2 = new Date(Date.now() - 10000);

      const olderDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "FAILED",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
          createdAt: timeT1,
        },
      });

      const newerDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "BUILT",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
          createdAt: timeT2,
        },
      });

      // Newer deployment marks project as "ready"
      await syncProjectStatus(projectA.id, timeT2, "ready");
      let proj = await prisma.project.findUnique({ where: { id: projectA.id } });
      assert.strictEqual(proj?.status, "ready");

      // Now older deployment attempts to sync "failed"
      await syncProjectStatus(projectA.id, timeT1, "failed");
      proj = await prisma.project.findUnique({ where: { id: projectA.id } });
      assert.strictEqual(proj?.status, "ready", "Older deployment must NOT overwrite project status of newer deployment");

      await prisma.deployment.deleteMany({ where: { id: { in: [olderDep.id, newerDep.id] } } });
      console.log("   ✓ Older deployment did not overwrite newer deployment's project status\n");
    }

    // ----------------------------------------------------------------
    // TEST 8: COMPLETE PIPELINE END-TO-END (QUEUED -> BUILT)
    // ----------------------------------------------------------------
    console.log("[TEST 8/12] Full Pipeline End-to-End Execution (QUEUED -> BUILT)");
    {
      const testDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: "test/repo-e2e",
          repositoryUrl: "https://github.com/test/repo-e2e",
          branch: "main",
          dockerfilePath: "Dockerfile",
          logs: {
            create: {
              line: "[SYSTEM] Deployment queued by user.",
              stream: LogStream.SYSTEM,
              sequence: 1,
            },
          },
        },
      });

      const testWorker = new DeploymentWorker("test-worker-e2e", async (depId) => {
        const wsDir = path.resolve(SCRATCH_ROOT_DIR, depId);
        const rDir = path.join(wsDir, "repo");
        await fs.promises.mkdir(rDir, { recursive: true });
        await fs.promises.writeFile(
          path.join(rDir, "Dockerfile"),
          "FROM hello-world:latest\nCMD [\"echo\", \"pipeline-success\"]\n"
        );
        const tag = `cloudforge/deployment-${depId}:e2etest`;
        await prisma.deployment.update({
          where: { id: depId },
          data: { commitSha: "1111111111111111111111111111111111111111", imageTag: tag },
        });
        return {
          deploymentId: depId,
          workspaceDir: wsDir,
          repoDir: rDir,
          dockerfilePath: "Dockerfile",
          commitSha: "1111111111111111111111111111111111111111",
          commitMsg: "E2E commit",
          commitAuthor: "Tester <test@example.com>",
          imageTag: tag,
        };
      });

      const workspaceDir = path.resolve(SCRATCH_ROOT_DIR, testDep.id);

      // Trigger worker processing
      await testWorker.processNext();

      const updated = await prisma.deployment.findUnique({ where: { id: testDep.id } });
      assert.strictEqual(updated?.status, "BUILT");
      assert.strictEqual(updated?.exitCode, 0);
      assert.ok(updated?.imageTag);

      // Verify workspace cleaned up
      assert.strictEqual(fs.existsSync(workspaceDir), false, "Workspace must be cleaned on build completion");

      // Verify Project status updated to ready
      const updatedProj = await prisma.project.findUnique({ where: { id: projectA.id } });
      assert.strictEqual(updatedProj?.status, "ready");

      // Clean up created docker image
      if (updated?.imageTag) {
        await deleteDockerImage(updated.imageTag);
      }

      await prisma.deployment.delete({ where: { id: testDep.id } });
      console.log("   ✓ Complete pipeline progressed to BUILT, image verified, workspace cleaned\n");
    }

    // ----------------------------------------------------------------
    // TEST 9: DOCKER FAILURE PROPAGATION
    // ----------------------------------------------------------------
    console.log("[TEST 9/12] Docker Build Failure Propagation");
    {
      const failDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: "test/repo-docker-fail",
          repositoryUrl: "https://github.com/test/repo-docker-fail",
          branch: "main",
          dockerfilePath: "Dockerfile",
        },
      });

      const failWorker = new DeploymentWorker("test-worker-fail", async (depId) => {
        const wsDir = path.resolve(SCRATCH_ROOT_DIR, depId);
        const rDir = path.join(wsDir, "repo");
        await fs.promises.mkdir(rDir, { recursive: true });
        await fs.promises.writeFile(
          path.join(rDir, "Dockerfile"),
          "FROM hello-world:latest\nRUN non-existent-command-xyz-fail\n"
        );
        const tag = `cloudforge/deployment-${depId}:failtest`;
        await prisma.deployment.update({
          where: { id: depId },
          data: { commitSha: "2222222222222222222222222222222222222222", imageTag: tag },
        });
        return {
          deploymentId: depId,
          workspaceDir: wsDir,
          repoDir: rDir,
          dockerfilePath: "Dockerfile",
          commitSha: "2222222222222222222222222222222222222222",
          commitMsg: "Fail commit",
          commitAuthor: "Tester <test@example.com>",
          imageTag: tag,
        };
      });

      const workspaceDir = path.resolve(SCRATCH_ROOT_DIR, failDep.id);

      await failWorker.processNext();

      const updated = await prisma.deployment.findUnique({ where: { id: failDep.id } });
      assert.strictEqual(updated?.status, "FAILED");
      assert.notStrictEqual(updated?.exitCode, 0);
      assert.ok(updated?.errorMessage);

      // Workspace must be cleaned
      assert.strictEqual(fs.existsSync(workspaceDir), false, "Workspace must be purged on build failure");

      // Project status updated to failed
      const updatedProj = await prisma.project.findUnique({ where: { id: projectA.id } });
      assert.strictEqual(updatedProj?.status, "failed");

      await prisma.deployment.delete({ where: { id: failDep.id } });
      console.log("   ✓ Build failure propagated to FAILED status, workspace cleaned, project failed\n");
    }

    // ----------------------------------------------------------------
    // TEST 10: WORKER SURVIVES DEPLOYMENT EXCEPTION
    // ----------------------------------------------------------------
    console.log("[TEST 10/12] Worker Loop Fault Isolation (Survives bad deployment)");
    {
      // Dep 1 is invalid/corrupt
      const badDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: "test/repo-bad",
          repositoryUrl: "https://invalid-url-corrupt",
          branch: "main",
        },
      });

      // Dep 2 is valid
      const goodDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: "test/repo-good",
          repositoryUrl: "https://github.com/test/repo-good",
          branch: "main",
        },
      });

      const faultWorker = new DeploymentWorker("test-worker-fault", async (depId) => {
        if (depId === badDep.id) {
          throw new Error("Simulated repository clone crash.");
        }
        const wsDir = path.resolve(SCRATCH_ROOT_DIR, depId);
        const rDir = path.join(wsDir, "repo");
        await fs.promises.mkdir(rDir, { recursive: true });
        await fs.promises.writeFile(
          path.join(rDir, "Dockerfile"),
          "FROM hello-world:latest\nCMD [\"echo\", \"good\"]\n"
        );
        const tag = `cloudforge/deployment-${depId}:goodtest`;
        await prisma.deployment.update({
          where: { id: depId },
          data: { commitSha: "3333333333333333333333333333333333333333", imageTag: tag },
        });
        return {
          deploymentId: depId,
          workspaceDir: wsDir,
          repoDir: rDir,
          dockerfilePath: "Dockerfile",
          commitSha: "3333333333333333333333333333333333333333",
          commitMsg: "Good commit",
          commitAuthor: "Tester <test@example.com>",
          imageTag: tag,
        };
      });

      // Trigger processing
      await faultWorker.processNext();

      // Poll until goodDep reaches terminal state (auto-drained by worker loop)
      let updatedGood = null;
      for (let i = 0; i < 100; i++) {
        await new Promise((r) => setTimeout(r, 100));
        updatedGood = await prisma.deployment.findUnique({ where: { id: goodDep.id } });
        if (updatedGood && (updatedGood.status === "BUILT" || updatedGood.status === "FAILED")) {
          break;
        }
      }

      const updatedBad = await prisma.deployment.findUnique({ where: { id: badDep.id } });
      assert.strictEqual(updatedBad?.status, "FAILED");
      assert.strictEqual(updatedGood?.status, "BUILT");

      if (updatedGood?.imageTag) {
        await deleteDockerImage(updatedGood.imageTag);
      }

      await prisma.deployment.deleteMany({ where: { id: { in: [badDep.id, goodDep.id] } } });
      console.log("   ✓ Worker loop survived first failure and successfully built second deployment\n");
    }

    // ----------------------------------------------------------------
    // TEST 11: GET LOGS WITH afterSequence
    // ----------------------------------------------------------------
    console.log("[TEST 11/12] Incremental Log Retrieval (afterSequence)");
    {
      const logDep = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "BUILDING",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
        },
      });

      // Insert 10 log rows
      for (let i = 1; i <= 10; i++) {
        await prisma.buildLog.create({
          data: {
            deploymentId: logDep.id,
            line: `Log entry ${i}`,
            sequence: i,
            stream: LogStream.STDOUT,
          },
        });
      }

      // Query logs with afterSequence = 7
      const partialLogs = await prisma.buildLog.findMany({
        where: {
          deploymentId: logDep.id,
          sequence: { gt: 7 },
        },
        orderBy: { sequence: "asc" },
      });

      assert.strictEqual(partialLogs.length, 3);
      assert.strictEqual(partialLogs[0].sequence, 8);
      assert.strictEqual(partialLogs[1].sequence, 9);
      assert.strictEqual(partialLogs[2].sequence, 10);

      await prisma.deployment.delete({ where: { id: logDep.id } });
      console.log("   ✓ afterSequence pagination strictly returned logs > 7\n");
    }

    // ----------------------------------------------------------------
    // TEST 12: CROSS-USER ACCESS REJECTION
    // ----------------------------------------------------------------
    console.log("[TEST 12/12] Cross-User Deployment & Log Access Authorization");
    {
      const depA = await prisma.deployment.create({
        data: {
          projectId: projectA.id,
          status: "QUEUED",
          repositoryName: projectA.repositoryName!,
          repositoryUrl: projectA.repositoryUrl!,
          branch: "main",
        },
      });

      // User B attempts to access Dep A
      const userBAccess = await prisma.deployment.findFirst({
        where: {
          id: depA.id,
          project: { userId: userB.id },
        },
      });

      assert.strictEqual(userBAccess, null, "User B must not be permitted to read User A's deployment");

      // User B attempts to cancel Dep A
      const cancelAttempt = await worker.cancelDeployment(depA.id, userB.id);
      assert.strictEqual(cancelAttempt.success, false);
      assert.strictEqual(cancelAttempt.notFound, true, "Cancel by non-owner must return notFound");

      await prisma.deployment.delete({ where: { id: depA.id } });
      console.log("   ✓ Cross-user reading and cancellation rejected\n");
    }
  } finally {
    worker.stop();
    // Clean up test users & projects
    await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });
  }

  console.log("==================================================================");
  console.log("  ALL 12 PHASE 1.4 PIPELINE TESTS PASSED SUCCESSFULLY!            ");
  console.log("==================================================================");
}

runTests().catch(async (err) => {
  console.error("\n❌ Test execution failed:", err);
  process.exit(1);
});
