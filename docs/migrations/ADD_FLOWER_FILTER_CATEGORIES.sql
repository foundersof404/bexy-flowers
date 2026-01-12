-- Migration: Add filter_categories column to flower_types table
-- This allows admins to specify which filter categories (Popular, Romantic, Minimal, Luxury, Seasonal) a flower belongs to

-- Add filter_categories column as TEXT array
ALTER TABLE flower_types
ADD COLUMN IF NOT EXISTS filter_categories TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add check constraint to ensure only valid categories
ALTER TABLE flower_types
DROP CONSTRAINT IF EXISTS flower_types_filter_categories_check;

ALTER TABLE flower_types
ADD CONSTRAINT flower_types_filter_categories_check 
CHECK (
  filter_categories <@ ARRAY['popular', 'romantic', 'minimal', 'luxury', 'seasonal']::TEXT[]
);

-- Add comment explaining the column
COMMENT ON COLUMN flower_types.filter_categories IS 
'Array of filter categories this flower belongs to. Valid values: popular, romantic, minimal, luxury, seasonal. Used for filtering flowers in the Customize page.';

-- Optional: Set default categories based on existing flower names/types
-- Popular: roses, tulips, carnation
UPDATE flower_types
SET filter_categories = ARRAY['popular']::TEXT[]
WHERE name LIKE '%Rose%' OR name LIKE '%Tulip%' OR name LIKE '%Carnation%';

-- Romantic: roses (red, pink, white), peonies, lilies, tulips (red, pink, white), orchids (pink, white)
UPDATE flower_types
SET filter_categories = array_append(COALESCE(filter_categories, ARRAY[]::TEXT[]), 'romantic')
WHERE (
  (name LIKE '%Rose%' AND (name LIKE '%Red%' OR name LIKE '%Pink%' OR name LIKE '%White%'))
  OR name LIKE '%Peony%'
  OR name LIKE '%Lily%'
  OR (name LIKE '%Tulip%' AND (name LIKE '%Red%' OR name LIKE '%Pink%' OR name LIKE '%White%'))
  OR (name LIKE '%Orchid%' AND (name LIKE '%Pink%' OR name LIKE '%White%'))
);

-- Minimal: gypsum, daisies, lavender
UPDATE flower_types
SET filter_categories = array_append(COALESCE(filter_categories, ARRAY[]::TEXT[]), 'minimal')
WHERE name LIKE '%Gypsum%' OR name LIKE '%Daisy%' OR name LIKE '%Lavender%';

-- Luxury: orchids, peonies, hydrangeas, lilies
UPDATE flower_types
SET filter_categories = array_append(COALESCE(filter_categories, ARRAY[]::TEXT[]), 'luxury')
WHERE name LIKE '%Orchid%' OR name LIKE '%Peony%' OR name LIKE '%Hydrangea%' OR name LIKE '%Lily%';

-- Seasonal: All flowers (this is handled in the frontend, but we can mark all as seasonal)
-- Actually, seasonal should be handled differently - it shows all flowers and filters by season
-- So we don't need to set 'seasonal' for all flowers

-- Remove duplicates from arrays (in case of multiple updates)
UPDATE flower_types
SET filter_categories = ARRAY(SELECT DISTINCT unnest(filter_categories));

-- Verify the changes
SELECT 
  name, 
  filter_categories,
  availability_mode,
  is_active
FROM flower_types
WHERE filter_categories IS NOT NULL AND array_length(filter_categories, 1) > 0
ORDER BY name
LIMIT 20;
