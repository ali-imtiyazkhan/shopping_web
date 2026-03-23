import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  console.log("Authenticating request. Cookie present:", !!accessToken);
  
  if (!accessToken) {
    console.warn("No access token found in cookies");
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    console.log("JWT Verified for user:", decoded.email, "Role:", decoded.role);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error instanceof Error ? error.message : error);
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export const isSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "SUPER_ADMIN") {
    next();
  } else {
    res
      .status(403)
      .json({
        success: false,
        error: "Access denied! Super admin access required",
      });
  }
};
