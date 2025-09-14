import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

/**
 * Middleware to validate Firebase ID token sent in Authorization: Bearer <token>
 * On success, attaches req.user = decodedToken
 */
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // attach user to request
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Admin-only middleware: check uid has admin claim `admin: true`
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  if ((user as any).admin === true || (user as any).admin === "true") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden: admin only" });
}