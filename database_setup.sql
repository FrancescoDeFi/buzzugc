-- Database setup for UGC Video Creator
-- Run this SQL in your Supabase SQL Editor to create the creations table

-- Create creations table to store user-generated videos
CREATE TABLE IF NOT EXISTS public.creations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    script TEXT,
    avatar_name TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    duration INTEGER DEFAULT 8, -- VEO 3 Fast generates 8-second videos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.creations ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own creations
CREATE POLICY "Users can view own creations" ON public.creations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creations" ON public.creations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creations" ON public.creations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own creations" ON public.creations
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_creations_user_id ON public.creations(user_id);
CREATE INDEX IF NOT EXISTS idx_creations_created_at ON public.creations(created_at DESC);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_creations_updated_at 
    BEFORE UPDATE ON public.creations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
