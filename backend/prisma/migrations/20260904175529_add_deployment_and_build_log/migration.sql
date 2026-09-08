-- CreateEnum
CREATE TYPE "public"."DeploymentStatus" AS ENUM ('QUEUED', 'INITIALIZING', 'BUILDING', 'BUILT', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."LogStream" AS ENUM ('STDOUT', 'STDERR', 'SYSTEM');

-- CreateTable
CREATE TABLE "public"."Deployment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "public"."DeploymentStatus" NOT NULL DEFAULT 'QUEUED',
    "repositoryName" TEXT NOT NULL,
    "repositoryUrl" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "commitSha" TEXT,
    "commitMsg" TEXT,
    "commitAuthor" TEXT,
    "imageTag" TEXT,
    "dockerfilePath" TEXT NOT NULL DEFAULT 'Dockerfile',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "exitCode" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BuildLog" (
    "id" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "stream" "public"."LogStream" NOT NULL DEFAULT 'STDOUT',
    "sequence" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuildLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deployment_projectId_idx" ON "public"."Deployment"("projectId");

-- CreateIndex
CREATE INDEX "Deployment_status_idx" ON "public"."Deployment"("status");

-- CreateIndex
CREATE INDEX "Deployment_createdAt_idx" ON "public"."Deployment"("createdAt");

-- CreateIndex
CREATE INDEX "Deployment_projectId_createdAt_idx" ON "public"."Deployment"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "BuildLog_deploymentId_sequence_idx" ON "public"."BuildLog"("deploymentId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "BuildLog_deploymentId_sequence_key" ON "public"."BuildLog"("deploymentId", "sequence");

-- AddForeignKey
ALTER TABLE "public"."Deployment" ADD CONSTRAINT "Deployment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuildLog" ADD CONSTRAINT "BuildLog_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "public"."Deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
