import { prisma } from "../server";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { sendResponse, sendError } from "../utils/response";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

function generateToken(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    {
      userId,
      email,
      role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "60m" }
  );
  const refreshToken = uuidv4();
  return { accessToken, refreshToken };
}

export function setTokens(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.RUNTIME_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      sendError(res, 400, "User with this email already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    sendResponse(res, 201, true, "User registered successfully", { userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 400, error.issues[0].message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Registration failed");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      sendError(res, 401, "Invalid credentials");
      return;
    }

    const { accessToken, refreshToken } = generateToken(
      user.id,
      user.email,
      user.role
    );

    await setTokens(res, accessToken, refreshToken);
    
    sendResponse(res, 200, true, "Login successful", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 400, error.issues[0].message);
      return;
    }
    console.error(error);
    sendError(res, 500, "Login failed");
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    sendError(res, 401, "Invalid refresh token");
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      sendError(res, 401, "User not found");
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user.id,
      user.email,
      user.role
    );

    await setTokens(res, accessToken, newRefreshToken);
    sendResponse(res, 200, true, "Token refreshed successfully");
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Refresh token error");
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendResponse(res, 200, true, "User logged out successfully");
};

