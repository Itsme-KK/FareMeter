import admin from "firebase-admin";
import { FIREBASE_SERVICE_ACCOUNT_PATH, FIRESTORE_PROJECT_ID } from "../config";
import { GovRateDoc, TripDoc } from "../models/types";

// Import Firestore types explicitly
import {
  Query,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase-admin/firestore";

const serviceAccount = require(FIREBASE_SERVICE_ACCOUNT_PATH);

// Initialize admin app only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: FIRESTORE_PROJECT_ID || undefined,
  });
}

const db = admin.firestore();

export const firestore = {
  // Rates collection
  async setGovRate(id: string, data: GovRateDoc) {
    data.updated_at = Date.now();
    return db.collection("government_rates").doc(id).set(data, { merge: true });
  },

  async getGovRatesByCity(city: string) {
    const snap = await db
      .collection("government_rates")
      .where("city", "==", city)
      .get();

    return snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
      id: d.id,
      ...d.data(),
    }));
  },

  async getAllGovRates() {
    const snap = await db.collection("government_rates").get();

    return snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
      id: d.id,
      ...d.data(),
    }));
  },

  async getGovRateById(id: string) {
    const d = await db.collection("government_rates").doc(id).get();
    if (!d.exists) return null;
    return { id: d.id, ...d.data() } as any;
  },

  // Trips
  async createTrip(trip: TripDoc) {
    trip.created_at = Date.now();
    const ref = await db.collection("trips").add(trip);
    const doc = await ref.get();
    return { id: ref.id, ...doc.data() };
  },

  async listTrips(limit = 50, offset = 0, city?: string) {
    let q: Query<DocumentData> = db
      .collection("trips")
      .orderBy("created_at", "desc")
      .limit(limit);

    // offset handling naive: use startAfter with last doc; for now keep limit simple
    if (city) {
      // optional: filter by city if pickup/place_name stores city (advanced)
    }

    const snap = await q.get();

    return snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
      id: d.id,
      ...d.data(),
    }));
  },
};