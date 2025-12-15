-- Migration: Create wedding_creations table
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- WEDDING CREATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wedding_creations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wedding_creations_is_active ON wedding_creations(is_active);
CREATE INDEX IF NOT EXISTS idx_wedding_creations_display_order ON wedding_creations(display_order);

-- Add comment
COMMENT ON TABLE wedding_creations IS 'Stores wedding creation photos for the Wedding & Events page gallery';

-- Add trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_wedding_creations_updated_at ON wedding_creations;
CREATE TRIGGER update_wedding_creations_updated_at
  BEFORE UPDATE ON wedding_creations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE wedding_creations ENABLE ROW LEVEL SECURITY;

-- Public read access for active images
DROP POLICY IF EXISTS "Public can view active wedding creations" ON wedding_creations;
CREATE POLICY "Public can view active wedding creations"
  ON wedding_creations
  FOR SELECT
  USING (is_active = true);

-- Admin full access (assuming you have an admin role/auth setup)
-- For now, we'll allow all authenticated users to manage
-- You can restrict this further based on your auth setup
DROP POLICY IF EXISTS "Admins can manage wedding creations" ON wedding_creations;
CREATE POLICY "Admins can manage wedding creations"
  ON wedding_creations
  FOR ALL
  USING (true)
  WITH CHECK (true);



