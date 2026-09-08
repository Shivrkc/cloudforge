import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getDeploymentById,
  getDeploymentLogs,
  cancelDeployment,
} from "../controllers/deployment.controller";

const router = Router();

router.use(authenticate);

router.get("/:deploymentId", getDeploymentById);
router.get("/:deploymentId/logs", getDeploymentLogs);
router.post("/:deploymentId/cancel", cancelDeployment);

export default router;
