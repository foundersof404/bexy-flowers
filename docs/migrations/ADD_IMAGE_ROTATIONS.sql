-- Migration: Add image_rotations column to signature_collections table
-- This allows admins to specify rotation angles for each image (useful for fixing incorrectly oriented photos)

-- Add image_rotations column as JSONB
ALTER TABLE signature_collections
ADD COLUMN IF NOT EXISTS image_rotations JSONB DEFAULT '{}'::JSONB;

-- Add comment explaining the column
COMMENT ON COLUMN signature_collections.image_rotations IS 
'JSON object storing rotation angles for each image URL. Format: {"image_url": 90, "another_url": 180}. Rotation angles: 0, 90, 180, 270 degrees.';

-- Verify the changes
SELECT 
  id,
  custom_title,
  image_rotations
FROM signature_collections
LIMIT 5;
