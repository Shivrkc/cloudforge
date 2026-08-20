/*auth.service.ts*/
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { AUTH_MESSAGES } from "../constants/messages";
import { generateToken } from "../utils/jwt";
import {
  generateVerificationToken,
  hashVerificationToken,
} from "../utils/emailVerification";
import { sendVerificationEmail } from "./email.service";

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