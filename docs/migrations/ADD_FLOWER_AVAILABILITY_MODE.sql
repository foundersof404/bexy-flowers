-- Migration: Add availability_mode to flower_types table
-- This allows admins to specify where flowers appear in the Customize page

-- Add the new column
ALTER TABLE flower_types
ADD COLUMN IF NOT EXISTS availability_mode TEXT DEFAULT 'both'
CHECK (availability_mode IN ('specific', 'mix', 'both'));

-- Add comment explaining the column
COMMENT ON COLUMN flower_types.availability_mode IS 
'Controls where the flower appears in Customize page: 
- "specific": Only in "Specific Variety" mode (single flower type)
- "mix": Only in "Mix & Match" mode (mixed bouquet)
- "both": Available in both modes (default)';

-- Update existing flowers to be available in both modes (default behavior)
UPDATE flower_types
SET availability_mode = 'both'
WHERE availability_mode IS NULL;

-- Example: Set some premium flowers to be mix-only (optional)
-- UPDATE flower_types
-- SET availability_mode = 'mix'
-- WHERE name LIKE '%Orchid%' OR name LIKE '%Peony%';

-- Verify the changes
SELECT 
  name, 
  availability_mode,
  is_active,
  quantity
FROM flower_types
ORDER BY name
LIMIT 10;
