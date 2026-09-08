/*auth.service.ts*/
import crypto from "crypto";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { AUTH_MESSAGES } from "../constants/messages";
import { generateToken } from "../utils/jwt";
import {
  generateVerificationToken,
  hashVerificationToken,
} from "../utils/emailVerification";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.service";
import { encryptToken } from "../utils/crypto";
import axios from "axios";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error(AUTH_MESSAGES.USER_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
    },
  });

  const verificationToken = generateVerificationToken();
  const tokenHash = hashVerificationToken(verificationToken);

  await prisma.emailVerificationToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    },
  });

  await sendVerificationEmail(user.email, verificationToken);

  return {
    success: true,
    message:
      "Account created. Please check your email to verify your account.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  };
};

export const login = async (data: LoginData) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password ?? ""
  );

  if (!isPasswordValid) {
    throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  if (!user.emailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    success: true,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  };
};

export const loginWithGoogle = async (code: string) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    "http://localhost:5000/api/auth/google/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured.");
  }

  // 1. Exchange authorization code for Google tokens
  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const { access_token } = tokenResponse.data;

  if (!access_token) {
    throw new Error("Failed to obtain Google access token.");
  }

  // 2. Fetch Google user profile
  const profileResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const {
    sub: googleId,
    email,
    name,
    picture,
    email_verified,
  } = profileResponse.data;

  if (!googleId || !email) {
    throw new Error("Failed to retrieve Google profile.");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 3. Find existing HAVN user
  let user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  // 4. Create user if this Google account is new
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: null,
        avatar: picture || null,
        provider: "google",
        emailVerified: email_verified === true,
      },
    });
  } else {
    // Update Google profile information for existing user
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: picture || user.avatar,
        emailVerified:
          email_verified === true ? true : user.emailVerified,
      },
    });
  }

  // 5. Generate the SAME HAVN JWT used by normal login
  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  };
};
// Login With Github
export const loginWithGithub = async (code: string) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const redirectUri =
    "http://localhost:5000/api/auth/github/callback";

  if (!clientId || !clientSecret) {
    throw new Error("GitHub OAuth is not configured.");
  }

  // 1. Exchange GitHub authorization code for access token
  const tokenResponse = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const { access_token, error, scope } = tokenResponse.data;

  if (error || !access_token) {
    throw new Error("Failed to obtain GitHub access token.");
  }

  // 2. Fetch GitHub profile
  const profileResponse = await axios.get(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "HAVN-App",
      },
    }
  );

  const {
    id: githubIdNum,
    login: githubUsername,
    name,
    avatar_url: avatar,
    email: publicEmail,
  } = profileResponse.data;

  if (!githubIdNum || !githubUsername) {
    throw new Error("Failed to retrieve GitHub profile.");
  }

  const githubUserId = String(githubIdNum);

  // 3. STEP A: Check if a GithubAccount already exists with this stable githubUserId
  const existingGithubAccount = await prisma.githubAccount.findUnique({
    where: { githubUserId },
    include: { user: true },
  });

  let user;

  if (existingGithubAccount) {
    // Authenticate the linked HAVN user directly. Do not create duplicate user.
    user = existingGithubAccount.user;

    // Optional sync of avatar if changed
    if (avatar && avatar !== user.avatar) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatar },
      });
    }

    // Do NOT overwrite existing repo-scoped token with login token
  } else {
    // 4. STEP B: No GithubAccount found for this githubUserId
    // Resolve email (public or via /user/emails)
    let email = publicEmail;

    if (!email) {
      const emailsResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "HAVN-App",
          },
        }
      );

      const emails = emailsResponse.data;

      const primaryEmail = emails.find(
        (item: {
          email: string;
          primary: boolean;
          verified: boolean;
        }) => item.primary && item.verified
      );

      email = primaryEmail?.email;
    }

    if (!email) {
      throw new Error(
        "No verified email address is available from GitHub."
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if an existing HAVN user has this normalized email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { githubAccount: true },
    });

    const encryptedAccessToken = encryptToken(access_token);

    if (existingUserByEmail) {
      if (existingUserByEmail.githubAccount) {
        throw new Error(
          "A different GitHub account is already connected to this email."
        );
      }

      // Safely link GithubAccount to this existing user
      await prisma.githubAccount.create({
        data: {
          userId: existingUserByEmail.id,
          githubUserId,
          githubUsername,
          accessToken: encryptedAccessToken,
          scope: scope || "user:email",
        },
      });

      user = await prisma.user.update({
        where: { id: existingUserByEmail.id },
        data: {
          avatar: avatar || existingUserByEmail.avatar,
          emailVerified: true,
        },
      });
    } else {
      // Brand-new user: create User and GithubAccount atomically
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: name || githubUsername || normalizedEmail.split("@")[0],
            email: normalizedEmail,
            password: null,
            avatar: avatar || null,
            provider: "github",
            emailVerified: true,
          },
        });

        await tx.githubAccount.create({
          data: {
            userId: newUser.id,
            githubUserId,
            githubUsername,
            accessToken: encryptedAccessToken,
            scope: scope || "user:email",
          },
        });

        return newUser;
      });
    }
  }

  // 5. Generate the normal HAVN JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  };
};

export const verifyEmail = async (token: string) => {
  if (!token) {
    throw new Error("Verification token is required.");
  }

  const tokenHash = hashVerificationToken(token);

  const verificationToken =
    await prisma.emailVerificationToken.findUnique({
      where: {
        tokenHash,
      },
    });

  if (!verificationToken) {
    throw new Error("Invalid or expired verification token.");
  }

  if (verificationToken.expiresAt < new Date()) {
    await prisma.emailVerificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    throw new Error("Verification token has expired.");
  }

  await prisma.user.update({
    where: {
      id: verificationToken.userId,
    },
    data: {
      emailVerified: true,
    },
  });

  await prisma.emailVerificationToken.delete({
    where: {
      id: verificationToken.id,
    },
  });

  return {
    success: true,
    message: "Email verified successfully.",
  };
};

export const forgotPassword = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  // Do not reveal whether an email exists in the system.
  if (!user) {
    return {
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  // Remove any existing reset tokens for this user.
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Generate a cryptographically secure reset token.
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Store only the SHA-256 hash.
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // Token expires after 15 minutes.
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  await sendPasswordResetEmail(
  normalizedEmail,
  rawToken
);

  return {
    success: true,
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
};

export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  if (!token || !newPassword) {
    throw new Error("Reset token and new password are required.");
  }

  if (newPassword.length < 8) {
    throw new Error(
      "Password must be at least 8 characters long."
    );
  }

  // Hash the token received from the reset URL.
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Find the matching reset token.
  const resetToken =
    await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

  if (!resetToken) {
    throw new Error("Invalid or expired password reset token.");
  }

  // Check expiration.
  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    throw new Error("Invalid or expired password reset token.");
  }

  // Hash the new password.
  const hashedPassword = await bcrypt.hash(
    newPassword,
    12
  );

  // Update password and consume the reset token.
  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
        provider: "credentials",
      },
    }),

    prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    }),
  ]);

  return {
    success: true,
    message: "Password reset successfully.",
  };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.provider !== "credentials" || !user.password) {
    throw new Error(
      "Password change is only available for email/password accounts."
    );
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Incorrect current password.");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long.");
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new Error("New password cannot be the same as your current password.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "Password changed successfully.",
  };
};