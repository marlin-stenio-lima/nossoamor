-- Run this in your Supabase SQL Editor to create the table for the gifts

CREATE TABLE IF NOT EXISTS couple_gifts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  password text UNIQUE NOT NULL,
  names text,
  newspaper_title text,
  anniversary text,
  photos jsonb,
  ai_story text,
  youtube_link text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) but allow anonymous read/write for now
ALTER TABLE couple_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert and update" ON couple_gifts
  FOR ALL
  USING (true)
  WITH CHECK (true);
