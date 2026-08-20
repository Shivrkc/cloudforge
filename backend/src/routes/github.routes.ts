import { Router } from "express";
import { connectGithub, githubCallback, githubStatus, githubRepositories, githubBranches, } from "../controllers/github.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.get("/repos/:owner/:repo/branches", authenticate, githubBranches);
router.get("/repos", authenticate, githubRepositories);
router.get("/status", authenticate, githubStatus);

// Initiates GitHub OAuth flow (requires HAVN authentication)
router.get("/connect", authenticate, connectGithub);

// OAuth callback endpoint target from GitHub redirect
router.get("/callback", githubCallback);

export default router;
