import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import winston from "winston";
import routesRates from "./routes/rates";
import routesTrips from "./routes/trips";
import { errorHandler } from "./middleware/errorHandler";
import { PORT, CORS_ORIGIN, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } from "./config";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

const app = express();

app.use(helmet());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: CORS_ORIGIN }));
app.use(
  rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", ts: Date.now() }));

// API prefix
app.use("/api/v1/rates", routesRates);
app.use("/api/v1/trips", routesTrips);

// error handler (last)
app.use(errorHandler);

export default app;