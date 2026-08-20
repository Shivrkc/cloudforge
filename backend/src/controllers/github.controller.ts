import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as githubService from "../services/github.service";

export const connectGithub = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const authUrl = await githubService.generateConnectUrl(userId);

    return res.redirect(authUrl);
  } catch (error) {
    console.error("GitHub OAuth initiation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to initiate GitHub OAuth connection.",
    });
  }
};

export const githubCallback = async (req: Request, res: Response) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:3000";

  // GitHub denied or cancelled the OAuth request
  if (typeof req.query.error === "string") {
    return res.redirect(
      `${frontendUrl}/dashboard?github_error=access_denied`
    );
  }

  const { code, state } = req.query;

  // Validate callback parameters
  if (
    typeof code !== "string" ||
    typeof state !== "string" ||
    !code ||
    !state
  ) {
    return res.redirect(
      `${frontendUrl}/dashboard?github_error=connection_failed`
    );
  }

  try {
    await githubService.handleCallback(code, state);

    return res.redirect(
      `${frontendUrl}/dashboard?github_success=connected`
    );
  } catch (error) {
    console.error("GitHub OAuth callback failed:", error);

    return res.redirect(
      `${frontendUrl}/dashboard?github_error=connection_failed`
    );
  }
};

export const githubStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const status = await githubService.getGithubStatus(userId);

    return res.status(200).json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error("GitHub status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub connection status.",
    });
  }
};

export const githubRepositories = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const repositories = await githubService.getGithubRepositories(userId);

    return res.status(200).json({
      success: true,
      repositories,
    });
  } catch (error) {
    console.error("GitHub repositories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub repositories.",
    });
  }
};

export const githubBranches = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const { owner, repo } = req.params;

    if (
      typeof owner !== "string" ||
      typeof repo !== "string" ||
      !owner ||
      !repo
    ) {
      return res.status(400).json({
        success: false,
        message: "Repository owner and name are required.",
      });
    }

    const branches = await githubService.getGithubBranches(
      userId,
      owner,
      repo
    );

    return res.status(200).json({
      success: true,
      branches,
    });
  } catch (error) {
    console.error("GitHub branches error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub branches.",
    });
  }
};