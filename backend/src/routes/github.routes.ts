import { Router } from "express";
import { connectGithub, githubCallback, githubStatus, githubRepositories, githubBranches, disconnectGithub } from "../controllers/github.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.get("/repos/:owner/:repo/branches", authenticate, githubBranches);
router.get("/repos", authenticate, githubRepositories);
router.get("/status", authenticate, githubStatus);

// Disconnect GitHub account from user profile
router.delete("/disconnect", authenticate, disconnectGithub);

// Initiates GitHub OAuth flow (requires HAVN authentication)
router.get("/connect", authenticate, connectGithub);

// OAuth callback endpoint target from GitHub redirect
router.get("/callback", githubCallback);

export default router;
