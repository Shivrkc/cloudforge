import assert from "assert";
import path from "path";
import fs from "fs";
import {
  validateRepositoryUrl,
  validateBranchName,
  assertWorkspaceBoundary,
  assertDockerfilePath,
  cleanupWorkspace,
} from "../git.service";
import { sanitizeLogOutput, sanitizeErrorMessage } from "../../utils/sanitizer";
import { SCRATCH_ROOT_DIR } from "../../constants/build.constants";

async function runTests() {
  console.log("Starting Phase 1.2 Git Isolation & Security Tests...\n");

  // 1. Repository URL validation
  console.log("1. Testing repository URL validation...");
  assert.throws(() => validateRepositoryUrl("http://github.com/owner/repo"), /Invalid GitHub repository URL/);
  assert.throws(() => validateRepositoryUrl("git@github.com:owner/repo.git"), /Invalid GitHub repository URL/);
  assert.throws(() => validateRepositoryUrl("https://evil.com/owner/repo"), /Invalid GitHub repository URL/);
  assert.throws(() => validateRepositoryUrl("https://user:token@github.com/owner/repo"), /Invalid GitHub repository URL/);
  
  const validUrl = validateRepositoryUrl("https://github.com/Shivrkc/cloudforge");
  assert.strictEqual(validUrl.owner, "Shivrkc");
  assert.strictEqual(validUrl.repo, "cloudforge");
  assert.strictEqual(validUrl.canonicalUrl, "https://github.com/Shivrkc/cloudforge.git");
  console.log("   ✓ Repository URL validation passed");

  // 2. Branch validation
  console.log("2. Testing branch name validation...");
  await assert.rejects(async () => validateBranchName("-bad-flag"), /Branch name cannot start with a hyphen/);
  await assert.rejects(async () => validateBranchName("../traversal"), /illegal or dangerous/);
  await assert.rejects(async () => validateBranchName("bad branch with spaces"), /illegal or dangerous/);
  await assert.rejects(async () => validateBranchName("bad;command"), /illegal or dangerous/);

  // Authoritative check on valid branches
  await validateBranchName("main");
  await validateBranchName("feature/phase-1.2");
  await validateBranchName("v1.0.0");
  console.log("   ✓ Branch validation passed");

  // 3. Workspace boundary assert
  console.log("3. Testing workspace boundary enforcement...");
  const validWorkspace = path.resolve(SCRATCH_ROOT_DIR, "cm12345678");
  assert.doesNotThrow(() => assertWorkspaceBoundary(validWorkspace));

  const escapingWorkspace = path.resolve(SCRATCH_ROOT_DIR, "..", "escaped");
  assert.throws(() => assertWorkspaceBoundary(escapingWorkspace), /Workspace path escapes/);

  const directRoot = path.resolve(SCRATCH_ROOT_DIR);
  assert.throws(() => assertWorkspaceBoundary(directRoot), /Workspace path escapes/);
  console.log("   ✓ Workspace boundary checks passed");

  // 4. Dockerfile path & symlink escape checks
  console.log("4. Testing Dockerfile path validation...");
  const testWorkspace = path.resolve(SCRATCH_ROOT_DIR, "test-workspace-check");
  const testRepoDir = path.join(testWorkspace, "repo");
  await fs.promises.mkdir(testRepoDir, { recursive: true });

  const testDockerfilePath = path.join(testRepoDir, "Dockerfile");
  await fs.promises.writeFile(testDockerfilePath, "FROM node:18\n");

  // Valid Dockerfile
  const resolved = await assertDockerfilePath(testRepoDir, "Dockerfile");
  assert.strictEqual(resolved, testDockerfilePath);

  // Traversal attempts
  await assert.rejects(
    async () => assertDockerfilePath(testRepoDir, "../../Dockerfile"),
    /Security violation: Dockerfile path escapes repository/
  );

  // Missing Dockerfile
  await assert.rejects(
    async () => assertDockerfilePath(testRepoDir, "nonexistent.Dockerfile"),
    /Dockerfile not found/
  );

  // Cleanup test workspace
  await cleanupWorkspace(testWorkspace);
  assert.strictEqual(fs.existsSync(testWorkspace), false);
  console.log("   ✓ Dockerfile path validation & cleanup passed");

  // 5. Sanitizer token & path redaction
  console.log("5. Testing error & log sanitization...");
  const secretToken = "ghp_1234567890abcdefghijklmnopqrstuvwxyz";
  const rawLog = `fatal: could not read Username for 'https://${secretToken}@github.com': No such device or address at C:\\Users\\Administrator\\AppData\\Local\\Temp`;
  const sanitized = sanitizeLogOutput(rawLog, secretToken);

  assert.strictEqual(sanitized.includes(secretToken), false, "Token must be redacted");
  assert.strictEqual(sanitized.includes("C:\\Users\\"), false, "Absolute Windows paths must be redacted");
  assert.strictEqual(sanitized.includes("[REDACTED_TOKEN]"), true);
  assert.strictEqual(sanitized.includes("[WORKSPACE_PATH]"), true);

  const errorMsg = sanitizeErrorMessage("fatal: Remote branch feature-x not found in upstream origin");
  assert.strictEqual(errorMsg, "The requested branch was not found in the remote repository.");
  console.log("   ✓ Error & log sanitization passed");

  console.log("\nAll Phase 1.2 Git isolation tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
