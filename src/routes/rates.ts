import { Router } from "express";
import { firestore } from "../services/firestore";
import { syncGovRates } from "../services/govSync";
import { requireAdmin, verifyToken } from "../middleware/auth";

const router = Router();

// PUBLIC: get rates by city
router.get("/", async (req, res, next) => {
  try {
    const city = (req.query.city as string) || "";
    if (!city) {
      const all = await firestore.getAllGovRates();
      return res.json({ data: all });
    }
    const rows = await firestore.getGovRatesByCity(city);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// GET rate by id
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await firestore.getGovRateById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (err) {
    next(err);
  }
});

// Admin-only: trigger sync from gov source
router.post("/admin/sync", verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const result = await syncGovRates();
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

export default router;