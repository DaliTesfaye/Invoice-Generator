import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to hold the authenticated user's ID
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ success: false, message: "Not authorized, no token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { userId: string };

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};
