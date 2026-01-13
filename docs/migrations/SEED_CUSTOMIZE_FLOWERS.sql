-- ============================================
-- SEED CUSTOMIZE PAGE FLOWERS
-- ============================================
-- This SQL script seeds the database with flower data from the static flowers.ts file
-- This connects the Customize page to the admin system
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- FLOWER TYPES (Families)
-- ============================================
-- Group flowers by family and create flower_types
-- Using average price as price_per_stem for each family

INSERT INTO flower_types (id, name, title, price_per_stem, image_url, quantity, is_active, created_at, updated_at)
VALUES
  -- Roses - average price 3.5
  ('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789', 'Roses', 'Roses - Classic and Elegant', 3.5, '/assets/custom/roses/red.png', 100, true, NOW(), NOW()),
  -- Tulips - price 3.0
  ('b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890', 'Tulips', 'Tulips - Winter Bloomers', 3.0, '/assets/custom/tulips/red.png', 100, true, NOW(), NOW()),
  -- Peonies - price 6.0
  ('c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901', 'Peonies', 'Peonies - Lush Summer Blooms', 6.0, '/assets/custom/peonies/pink.png', 50, true, NOW(), NOW()),
  -- Chrysanthemum - price 2.5
  ('d4e5f6a7-b8c9-4012-d345-e6f7a8b9c012', 'Chrysanthemums', 'Chrysanthemums - Year-Round Favorites', 2.5, '/assets/custom/chrysanthemum/white.png', 100, true, NOW(), NOW()),
  -- Gypsum - average price 2.4
  ('e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123', 'Gypsum', 'Baby''s Breath - Airy Fillers', 2.4, '/assets/custom/gypsum/white.png', 150, true, NOW(), NOW()),
  -- Daisies - price 2.0
  ('f6a7b8c9-d0e1-4234-f567-a8b9c0d1e234', 'Daisies', 'Daisies - Summer Cheer', 2.0, '/assets/custom/daises/white.png', 100, true, NOW(), NOW()),
  -- Sunflower - Big (price 4.0) and Small (price 3.0) are separate entries
  ('a7b8c9d0-e1f2-4345-a678-b9c0d1e2f345', 'Sunflowers (Big)', 'Large Sunflowers - Summer Radiance', 4.0, '/assets/custom/sunflowers/big.png', 40, true, NOW(), NOW()),
  ('a8b9c0d1-e2f3-4456-b789-c0d1e2f3a456', 'Sunflowers (Small)', 'Small Sunflowers - Summer Radiance', 3.0, '/assets/custom/sunflowers/small.png', 40, true, NOW(), NOW()),
  -- Lily - price 5.0
  ('b8c9d0e1-f2a3-4456-b789-c0d1e2f3a456', 'Lilies', 'Lilies - Elegant Winter Blooms', 5.0, '/assets/custom/lilly/white.png', 60, true, NOW(), NOW()),
  -- Orchid - average price 8.3
  ('c9d0e1f2-a3b4-4567-c890-d1e2f3a4b567', 'Orchids', 'Orchids - Exotic Luxury', 8.3, '/assets/custom/orchid/white.png', 40, true, NOW(), NOW()),
  -- Hydrangea - price 6.0
  ('d0e1f2a3-b4c5-4678-d901-e2f3a4b5c678', 'Hydrangeas', 'Hydrangeas - Voluminous Summer', 6.0, '/assets/custom/hydrangea/white.png', 50, true, NOW(), NOW()),
  -- Gerbera - price 3.0
  ('e1f2a3b4-c5d6-4789-e012-f3a4b5c6d789', 'Gerberas', 'Gerberas - Bold Summer Colors', 3.0, '/assets/custom/gerbera/red.png', 100, true, NOW(), NOW()),
  -- Lavender - price 4.0
  ('f2a3b4c5-d6e7-4890-f123-a4b5c6d7e890', 'Lavender', 'Lavender - Aromatic Summer', 4.0, '/assets/custom/lavender/purple.png', 80, true, NOW(), NOW()),
  -- Carnation - price 2.0
  ('a3b4c5d6-e7f8-4901-a234-b5c6d7e8f901', 'Carnations', 'Carnations - Hardy Year-Round', 2.0, '/assets/custom/carnation/red.png', 120, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FLOWER COLORS (Color Variants)
-- ============================================
-- Create color entries for each flower variant

INSERT INTO flower_colors (id, flower_id, name, color_value, quantity, created_at, updated_at)
VALUES
  -- Rose Colors
  ('10000000-0000-4000-8000-000000000001', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789', 'Red', '#DC143C', 20, NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000002', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789', 'White', '#FFFFFF', 20, NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000003', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789', 'Pink', '#FFC0CB', 20, NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000004', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789', 'Yellow', '#FFD700', 15, NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000005', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789', 'Blue', '#0000FF', 15, NOW(), NOW()),
  ('10000000-0000-4000-8000-000000000006', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789', 'Peach', '#FFCCCB', 10, NOW(), NOW()),
  
  -- Tulip Colors
  ('20000000-0000-4000-8000-000000000001', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890', 'Red', '#DC143C', 20, NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000002', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890', 'White', '#FFFFFF', 20, NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000003', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890', 'Pink', '#FFC0CB', 20, NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000004', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890', 'Yellow', '#FFD700', 15, NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000005', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890', 'Blue', '#0000FF', 15, NOW(), NOW()),
  ('20000000-0000-4000-8000-000000000006', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890', 'Peach', '#FFCCCB', 10, NOW(), NOW()),
  
  -- Peony Colors
  ('30000000-0000-4000-8000-000000000001', 'c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901', 'Pink', '#FF69B4', 15, NOW(), NOW()),
  ('30000000-0000-4000-8000-000000000002', 'c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901', 'Fushia', '#FF00FF', 15, NOW(), NOW()),
  ('30000000-0000-4000-8000-000000000003', 'c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901', 'White', '#FFFFFF', 20, NOW(), NOW()),
  
  -- Chrysanthemum Colors
  ('40000000-0000-4000-8000-000000000001', 'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c012', 'White', '#FFFFFF', 25, NOW(), NOW()),
  ('40000000-0000-4000-8000-000000000002', 'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c012', 'Yellow', '#FFD700', 25, NOW(), NOW()),
  ('40000000-0000-4000-8000-000000000003', 'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c012', 'Orange', '#FFA500', 25, NOW(), NOW()),
  ('40000000-0000-4000-8000-000000000004', 'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c012', 'Purple', '#800080', 25, NOW(), NOW()),
  
  -- Gypsum Colors
  ('50000000-0000-4000-8000-000000000001', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123', 'White', '#FFFFFF', 30, NOW(), NOW()),
  ('50000000-0000-4000-8000-000000000002', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123', 'Pink', '#FFC0CB', 25, NOW(), NOW()),
  ('50000000-0000-4000-8000-000000000003', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123', 'Blue', '#87CEEB', 20, NOW(), NOW()),
  ('50000000-0000-4000-8000-000000000004', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123', 'Dark Blue', '#00008B', 15, NOW(), NOW()),
  ('50000000-0000-4000-8000-000000000005', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123', 'Purple', '#800080', 20, NOW(), NOW()),
  ('50000000-0000-4000-8000-000000000006', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123', 'Terracotta', '#E2725B', 15, NOW(), NOW()),
  ('50000000-0000-4000-8000-000000000007', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123', 'Yellow', '#FFD700', 25, NOW(), NOW()),
  
  -- Daisy Colors
  ('60000000-0000-4000-8000-000000000001', 'f6a7b8c9-d0e1-4234-f567-a8b9c0d1e234', 'White', '#FFFFFF', 50, NOW(), NOW()),
  ('60000000-0000-4000-8000-000000000002', 'f6a7b8c9-d0e1-4234-f567-a8b9c0d1e234', 'Yellow', '#FFD700', 50, NOW(), NOW()),
  
  -- Sunflower (Big) Colors
  ('70000000-0000-4000-8000-000000000001', 'a7b8c9d0-e1f2-4345-a678-b9c0d1e2f345', 'Yellow', '#FFD700', 40, NOW(), NOW()),
  
  -- Sunflower (Small) Colors
  ('70000000-0000-4000-8000-000000000002', 'a8b9c0d1-e2f3-4456-b789-c0d1e2f3a456', 'Yellow', '#FFD700', 40, NOW(), NOW()),
  
  -- Lily Colors
  ('80000000-0000-4000-8000-000000000001', 'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a456', 'White', '#FFFFFF', 15, NOW(), NOW()),
  ('80000000-0000-4000-8000-000000000002', 'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a456', 'Pink', '#FFC0CB', 15, NOW(), NOW()),
  ('80000000-0000-4000-8000-000000000003', 'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a456', 'Yellow', '#FFD700', 15, NOW(), NOW()),
  ('80000000-0000-4000-8000-000000000004', 'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a456', 'Orange', '#FFA500', 15, NOW(), NOW()),
  
  -- Orchid Colors
  ('90000000-0000-4000-8000-000000000001', 'c9d0e1f2-a3b4-4567-c890-d1e2f3a4b567', 'White', '#FFFFFF', 15, NOW(), NOW()),
  ('90000000-0000-4000-8000-000000000002', 'c9d0e1f2-a3b4-4567-c890-d1e2f3a4b567', 'Pink', '#FFC0CB', 15, NOW(), NOW()),
  ('90000000-0000-4000-8000-000000000003', 'c9d0e1f2-a3b4-4567-c890-d1e2f3a4b567', 'Blue', '#0000FF', 10, NOW(), NOW()),
  
  -- Hydrangea Colors
  ('a0000000-0000-4000-8000-000000000001', 'd0e1f2a3-b4c5-4678-d901-e2f3a4b5c678', 'White', '#FFFFFF', 20, NOW(), NOW()),
  ('a0000000-0000-4000-8000-000000000002', 'd0e1f2a3-b4c5-4678-d901-e2f3a4b5c678', 'Pink', '#FFC0CB', 15, NOW(), NOW()),
  ('a0000000-0000-4000-8000-000000000003', 'd0e1f2a3-b4c5-4678-d901-e2f3a4b5c678', 'Blue', '#0000FF', 15, NOW(), NOW()),
  
  -- Gerbera Colors
  ('b0000000-0000-4000-8000-000000000001', 'e1f2a3b4-c5d6-4789-e012-f3a4b5c6d789', 'Red', '#DC143C', 35, NOW(), NOW()),
  ('b0000000-0000-4000-8000-000000000002', 'e1f2a3b4-c5d6-4789-e012-f3a4b5c6d789', 'Yellow', '#FFD700', 35, NOW(), NOW()),
  ('b0000000-0000-4000-8000-000000000003', 'e1f2a3b4-c5d6-4789-e012-f3a4b5c6d789', 'Orange', '#FFA500', 30, NOW(), NOW()),
  
  -- Lavender Colors
  ('c0000000-0000-4000-8000-000000000001', 'f2a3b4c5-d6e7-4890-f123-a4b5c6d7e890', 'Purple', '#800080', 80, NOW(), NOW()),
  
  -- Carnation Colors
  ('d0000000-0000-4000-8000-000000000001', 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f901', 'Red', '#DC143C', 25, NOW(), NOW()),
  ('d0000000-0000-4000-8000-000000000002', 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f901', 'White', '#FFFFFF', 25, NOW(), NOW()),
  ('d0000000-0000-4000-8000-000000000003', 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f901', 'Pink', '#FFC0CB', 25, NOW(), NOW()),
  ('d0000000-0000-4000-8000-000000000004', 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f901', 'Purple', '#800080', 25, NOW(), NOW()),
  ('d0000000-0000-4000-8000-000000000005', 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f901', 'Yellow', '#FFD700', 20, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
-- Check that data was inserted correctly
SELECT 
  ft.name as flower_type,
  COUNT(fc.id) as color_count,
  ft.quantity as total_quantity,
  ft.is_active
FROM flower_types ft
LEFT JOIN flower_colors fc ON fc.flower_id = ft.id
WHERE ft.id IN (
  'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789',
  'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890',
  'c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901'
)
GROUP BY ft.id, ft.name, ft.quantity, ft.is_active
ORDER BY ft.name;
