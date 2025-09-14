import { z } from "zod";

export const TripSchema = z.object({
  pickup: z.object({
    lat: z.number(),
    lng: z.number(),
    place_name: z.string().optional(),
  }),
  drop: z.object({
    lat: z.number(),
    lng: z.number(),
    place_name: z.string().optional(),
  }),
  distance_km: z.number().nonnegative(),
  duration_min: z.number().optional(),
  transport_type: z.string(),
  estimated_fare: z.number().nonnegative(),
  actual_fare: z.number().optional(),
  user_id: z.string().optional() 
});