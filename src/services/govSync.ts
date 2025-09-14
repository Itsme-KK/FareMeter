import axios from "axios";
import fetch from "node-fetch";
import Papa from "papaparse"; // small CSV parser; npm install papaparse
import { firestore } from "./firestore";
import { GovRateDoc } from "../models/types";
import { GOV_RATES_SOURCE_URL } from "../config";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

export async function syncGovRates() {
  if (!GOV_RATES_SOURCE_URL) {
    logger.warn("No GOV_RATES_SOURCE_URL configured");
    return { updated: 0 };
  }

  logger.info(`Fetching rates from ${GOV_RATES_SOURCE_URL}`);
  const res = await fetch(GOV_RATES_SOURCE_URL);
  if (!res.ok) {
    const text = await res.text();
    logger.error("Failed to fetch gov rates: " + res.status + " " + text);
    throw new Error("Failed to fetch gov rates");
  }

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  let rows: any[] = [];

  if (contentType.includes("application/json") || text.trim().startsWith("{") || text.trim().startsWith("[")) {
    const data = JSON.parse(text);
    if (Array.isArray(data)) rows = data;
    else if (data.rates) rows = data.rates;
    else rows = [data];
  } else {
    // treat as CSV
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    rows = parsed.data as any[];
  }

  let count = 0;
  for (const r of rows) {
    try {
      // map fields - adjust based on actual source keys
      const docId = `${(r.city || r.City || "unknown").toString().toLowerCase()}_${(r.transport_type || r.transport || "auto").toString().toLowerCase()}`;
      const doc: GovRateDoc = {
        city: (r.city || r.City || "Unknown").toString(),
        transport_type: (r.transport_type || r.transport || r.type || "auto").toString(),
        base_fare: Number(r.base_fare || r.base || r.baseFare || 0),
        rate_per_km: Number(r.rate_per_km || r.rate || r.per_km || r.ratePerKm || 0),
        night_rate_per_km: r.night_rate ? Number(r.night_rate) : undefined,
        effective_from: r.effective_from || r.effective || undefined,
      };
      await firestore.setGovRate(docId, doc);
      count++;
    } catch (err) {
      logger.error("Failed to process row: " + JSON.stringify(r).slice(0, 200));
    }
  }

  logger.info(`Updated ${count} government rates`);
  return { updated: count };
}