/*auth.routs.ts*/
import { Router, Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  verifyEmail,
  testEmail,
  googleCallback,
  githubLoginCallback,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
import { validateRegister } from "../middleware/validation.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| OAuth Initiation Routes
|--------------------------------------------------------------------------
*/

// GitHub OAuth
router.get("/github", (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      success: false,
      message: "GitHub OAuth is not configured.",
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri:
      "http://localhost:5000/api/auth/github/callback",
    scope: "user:email",
  });

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize?${params.toString()}`;

  return res.redirect(githubAuthUrl);
});
router.get("/github/callback", githubLoginCallback);

// Google OAuth
router.get("/google", (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      success: false,
      message: "Google OAuth is not configured.",
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri:
      "http://localhost:5000/api/auth/google/callback",
    response_type: "code",
    scope: "openid profile email",
  });

  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return res.redirect(googleAuthUrl);
});
router.get("/google/callback", googleCallback);
/*
Existing Authentication Routes
*/

router.get("/verify-email", verifyEmail);

router.post("/test-email", testEmail);

router.post(
  "/register",
  validateRegister,
  registerUser
);

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", authenticate, changePassword);

router.get(
  "/me",
  authenticate,
  getCurrentUser
);

export default router;