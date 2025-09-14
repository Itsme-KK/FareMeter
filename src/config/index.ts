import dotenv from "dotenv";
import path from "path";
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
export const FIREBASE_SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "/app/firebase-service-account.json"; // absolute inside container
export const FIRESTORE_PROJECT_ID = process.env.FIRESTORE_PROJECT_ID || "";

if (!process.env.FIRESTORE_PROJECT_ID) {
  console.warn("FIRESTORE_PROJECT_ID is not set. Running with default project id may fail.");
}

// sanity check for service account
import fs from "fs";
if (!fs.existsSync(path.resolve(FIREBASE_SERVICE_ACCOUNT_PATH))) {
  console.warn(`Warning: firebase service account not found at ${FIREBASE_SERVICE_ACCOUNT_PATH}. Please mount it.`);
}

export const GOV_RATES_SOURCE_URL = process.env.GOV_RATES_SOURCE_URL || "";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

export const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS
  ? Number(process.env.RATE_LIMIT_WINDOW_MS)
  : 60_000;

export const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX
  ? Number(process.env.RATE_LIMIT_MAX)
  : 120;