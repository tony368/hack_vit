import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const hasSupabase = !!supabase;

/*
  ── Supabase SQL schema ──────────────────────────────────────
  Run this in your Supabase SQL editor:

  create table assets (
    id                    uuid primary key default gen_random_uuid(),
    lat                   float8 not null,
    lng                   float8 not null,
    type                  text check (type in ('Lamp','Road','Water Line')) not null,
    condition             text check (condition in ('Good','Defective','Critical')) not null,
    status                text,
    zone                  text,
    installation_date     date,
    last_maintenance_date date,
    created_at            timestamptz default now()
  );

  create unique index assets_lat_lng_idx
    on assets (round(lat::numeric,5), round(lng::numeric,5));

  alter table assets enable row level security;
  create policy "Allow all" on assets for all using (true);
*/
