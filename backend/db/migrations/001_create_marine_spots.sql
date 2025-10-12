-- create table for caching marine spots
CREATE TABLE IF NOT EXISTS marine_spots (
  id serial PRIMARY KEY,
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  data jsonb,
  created_at timestamptz DEFAULT now()
);
