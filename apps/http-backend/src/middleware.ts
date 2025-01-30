import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface JWTPayload {
  userId: string;
}

export function middleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["authorization"] ?? "";

  if (!token) {
    res.status(401).json({
      message: "No token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    req.userId = <any>decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Unauthorized access",
    });
  }
}