-- Migration: Add title and quantity fields to flower_types table
-- Run this SQL in your Supabase SQL Editor

-- Add title column
ALTER TABLE flower_types 
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Add quantity column
ALTER TABLE flower_types 
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 0;

-- Add comment for title column
COMMENT ON COLUMN flower_types.title IS 'Display title/type indicator for the flower';

-- Add comment for quantity column
COMMENT ON COLUMN flower_types.quantity IS 'Total available quantity for this flower type';

-- Update existing rows to have default values if needed
UPDATE flower_types 
SET quantity = 0 
WHERE quantity IS NULL;

