import { Request, Response, NextFunction } from "express";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}