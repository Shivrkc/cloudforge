-- AlterTable
ALTER TABLE "public"."Deployment" ADD COLUMN     "heartbeatAt" TIMESTAMP(3),
ADD COLUMN     "workerId" TEXT;

-- CreateIndex
CREATE INDEX "Deployment_status_heartbeatAt_idx" ON "public"."Deployment"("status", "heartbeatAt");
