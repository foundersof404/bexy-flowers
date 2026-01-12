-- Migration: Add Flower Type Hierarchy System
-- This creates a parent-child relationship between flower types and individual flowers

-- Step 1: Create a new table for flower type categories (parents)
CREATE TABLE IF NOT EXISTS flower_type_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., "Roses", "Tulips", "Orchids"
  display_name TEXT NOT NULL, -- e.g., "Roses 🌹", "Tulips 🌷"
  description TEXT,
  icon TEXT, -- Emoji or icon identifier
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE flower_type_categories IS 
'Parent categories for flower types. Used in "Specific Variety" mode where customers first choose a flower type (e.g., Roses), then select specific flowers (e.g., Red Rose, Pink Rose).';

-- Step 2: Add foreign key to flower_types table
ALTER TABLE flower_types
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES flower_type_categories(id) ON DELETE SET NULL;

-- Add comment
COMMENT ON COLUMN flower_types.category_id IS 
'Links this flower to a parent category. Used when availability_mode is "specific" to group flowers by type.';

-- Step 3: Create default flower type categories based on existing data
INSERT INTO flower_type_categories (name, display_name, icon, display_order, description) VALUES
  ('roses', 'Roses', '🌹', 1, 'Classic and romantic roses in various colors'),
  ('tulips', 'Tulips', '🌷', 2, 'Elegant tulips perfect for any occasion'),
  ('peonies', 'Peonies', '🌸', 3, 'Lush and luxurious peonies'),
  ('chrysanthemum', 'Chrysanthemums', '🌼', 4, 'Beautiful and long-lasting chrysanthemums'),
  ('gypsum', 'Baby''s Breath', '🌫️', 5, 'Delicate filler flowers'),
  ('daisies', 'Daisies', '🌼', 6, 'Cheerful and bright daisies'),
  ('sunflower', 'Sunflowers', '🌻', 7, 'Bold and sunny sunflowers'),
  ('lily', 'Lilies', '🌺', 8, 'Elegant and fragrant lilies'),
  ('orchid', 'Orchids', '🌸', 9, 'Exotic and sophisticated orchids'),
  ('hydrangea', 'Hydrangeas', '💠', 10, 'Voluminous and stunning hydrangeas'),
  ('gerbera', 'Gerberas', '🌻', 11, 'Vibrant and colorful gerberas'),
  ('lavender', 'Lavender', '🌿', 12, 'Aromatic and calming lavender'),
  ('carnation', 'Carnations', '🌺', 13, 'Classic and versatile carnations')
ON CONFLICT (name) DO NOTHING;

-- Step 4: Link existing flowers to their categories
-- This maps flowers to categories based on their name patterns
UPDATE flower_types ft
SET category_id = (
  SELECT id FROM flower_type_categories ftc
  WHERE 
    -- Match by name pattern
    (ft.name ILIKE '%Rose%' AND ftc.name = 'roses') OR
    (ft.name ILIKE '%Tulip%' AND ftc.name = 'tulips') OR
    (ft.name ILIKE '%Peony%' AND ftc.name = 'peonies') OR
    (ft.name ILIKE '%Chrysanthemum%' AND ftc.name = 'chrysanthemum') OR
    (ft.name ILIKE '%Gypsum%' AND ftc.name = 'gypsum') OR
    (ft.name ILIKE '%Daisy%' AND ftc.name = 'daisies') OR
    (ft.name ILIKE '%Sunflower%' AND ftc.name = 'sunflower') OR
    (ft.name ILIKE '%Lily%' AND ftc.name = 'lily') OR
    (ft.name ILIKE '%Orchid%' AND ftc.name = 'orchid') OR
    (ft.name ILIKE '%Hydrangea%' AND ftc.name = 'hydrangea') OR
    (ft.name ILIKE '%Gerbera%' AND ftc.name = 'gerbera') OR
    (ft.name ILIKE '%Lavender%' AND ftc.name = 'lavender') OR
    (ft.name ILIKE '%Carnation%' AND ftc.name = 'carnation')
  LIMIT 1
)
WHERE category_id IS NULL;

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flower_types_category_id ON flower_types(category_id);
CREATE INDEX IF NOT EXISTS idx_flower_type_categories_name ON flower_type_categories(name);
CREATE INDEX IF NOT EXISTS idx_flower_type_categories_active ON flower_type_categories(is_active);

-- Step 6: Create a view for easy querying
CREATE OR REPLACE VIEW flower_types_with_category AS
SELECT 
  ft.*,
  ftc.name as category_name,
  ftc.display_name as category_display_name,
  ftc.icon as category_icon
FROM flower_types ft
LEFT JOIN flower_type_categories ftc ON ft.category_id = ftc.id;

-- Step 7: Verify the setup
SELECT 
  ftc.display_name as category,
  COUNT(ft.id) as flower_count,
  ftc.is_active
FROM flower_type_categories ftc
LEFT JOIN flower_types ft ON ft.category_id = ftc.id AND ft.is_active = true
GROUP BY ftc.id, ftc.display_name, ftc.is_active
ORDER BY ftc.display_order;

-- Example: View flowers by category
SELECT 
  ftc.display_name as category,
  ft.name as flower,
  ft.price_per_stem,
  ft.availability_mode,
  ft.is_active
FROM flower_types ft
JOIN flower_type_categories ftc ON ft.category_id = ftc.id
WHERE ftc.name = 'roses' AND ft.is_active = true
ORDER BY ft.name;
