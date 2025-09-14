import app from "./app";
import { PORT } from "./config";
import { syncGovRates } from "./services/govSync";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

// Simple schedule: sync gov rates at start and every 12 hours
(async function scheduleSync() {
  try {
    logger.info("Running initial government rates sync...");
    await syncGovRates();
  } catch (err) {
    logger.error("Initial sync failed: " + (err as any).message);
  }

  // naive interval
  setInterval(async () => {
    try {
      logger.info("Running scheduled government rates sync...");
      await syncGovRates();
    } catch (err) {
      logger.error("Scheduled sync failed: " + (err as any).message);
    }
  }, 1000 * 60 * 60 * 12); // every 12 hours
})();

process.on("SIGINT", () => {
  logger.info("Shutting down");
  server.close(() => process.exit(0));
});