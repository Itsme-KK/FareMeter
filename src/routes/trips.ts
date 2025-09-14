import { Router } from "express";
import { firestore } from "../services/firestore";
import { TripSchema } from "../utils/validators";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Create trip (requires auth)
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const parse = TripSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors });
    }
    const trip = parse.data;
    // attach user id from token
    const user = (req as any).user;
    if (user && user.uid) trip.user_id = user.uid;
    const doc = await firestore.createTrip(trip as any);
    res.status(201).json({ data: doc });
  } catch (err) {
    next(err);
  }
});

// List trips (public)
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt((req.query.limit as string) || "50", 10);
    const page = parseInt((req.query.page as string) || "0", 10);
    const city = (req.query.city as string) || undefined;
    const data = await firestore.listTrips(limit, page * limit, city);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

export default router;