export type GovRateDoc = {
  city: string;
  transport_type: string;
  base_fare: number;
  rate_per_km: number;
  night_rate_per_km?: number;
  effective_from?: string; // ISO date string
  updated_at?: number;
};

export type TripDoc = {
  pickup: { lat: number; lng: number; place_name?: string };
  drop: { lat: number; lng: number; place_name?: string };
  distance_km: number;
  duration_min?: number;
  transport_type: string;
  estimated_fare: number;
  actual_fare?: number;
  user_id?: string;
  created_at?: number;
};