-- ============================================
-- SEED ALL 49 FLOWERS AS INDIVIDUAL FLOWER TYPES
-- ============================================
-- This SQL script creates 49 individual flower_types (one per flower variant)
-- This ensures the admin page shows all 49 flowers for management
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DELETE EXISTING DATA (Optional - uncomment if you want to start fresh)
-- ============================================
-- DELETE FROM flower_colors;
-- DELETE FROM flower_types;

-- ============================================
-- INSERT ALL 49 FLOWERS AS INDIVIDUAL FLOWER TYPES
-- ============================================

INSERT INTO flower_types (id, name, title, price_per_stem, image_url, quantity, is_active, created_at, updated_at)
VALUES
  -- Roses (6 variants)
  ('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f001', 'Red Rose', 'Classic red rose', 3.5, '/assets/custom/roses/red.png', 20, true, NOW(), NOW()),
  ('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f002', 'White Rose', 'Pure white rose', 3.5, '/assets/custom/roses/white.png', 20, true, NOW(), NOW()),
  ('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f003', 'Pink Rose', 'Soft pink rose', 3.5, '/assets/custom/roses/pink.png', 20, true, NOW(), NOW()),
  ('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f004', 'Yellow Rose', 'Bright yellow rose', 3.5, '/assets/custom/roses/yellow.png', 15, true, NOW(), NOW()),
  ('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f005', 'Blue Rose', 'Elegant blue rose', 3.5, '/assets/custom/roses/blue.png', 15, true, NOW(), NOW()),
  ('a1b2c3d4-e5f6-4789-a012-b3c4d5e6f006', 'Peach Rose', 'Soft peach rose', 3.5, '/assets/custom/roses/peach.png', 10, true, NOW(), NOW()),
  
  -- Tulips (6 variants)
  ('b2c3d4e5-f6a7-4890-b123-c4d5e6f7a001', 'Red Tulip', 'Romantic red tulip', 3.0, '/assets/custom/tulips/red.png', 20, true, NOW(), NOW()),
  ('b2c3d4e5-f6a7-4890-b123-c4d5e6f7a002', 'White Tulip', 'Elegant white tulip', 3.0, '/assets/custom/tulips/white.png', 20, true, NOW(), NOW()),
  ('b2c3d4e5-f6a7-4890-b123-c4d5e6f7a003', 'Pink Tulip', 'Playful pink tulip', 3.0, '/assets/custom/tulips/pink.png', 20, true, NOW(), NOW()),
  ('b2c3d4e5-f6a7-4890-b123-c4d5e6f7a004', 'Yellow Tulip', 'Sunny yellow tulip', 3.0, '/assets/custom/tulips/yellow.png', 15, true, NOW(), NOW()),
  ('b2c3d4e5-f6a7-4890-b123-c4d5e6f7a005', 'Blue Tulip', 'Beautiful blue tulip', 3.0, '/assets/custom/tulips/blue.png', 15, true, NOW(), NOW()),
  ('b2c3d4e5-f6a7-4890-b123-c4d5e6f7a006', 'Peach Tulip', 'Soft peach tulip', 3.0, '/assets/custom/tulips/peach.png', 10, true, NOW(), NOW()),
  
  -- Peonies (3 variants)
  ('c3d4e5f6-a7b8-4901-c234-d5e6f7a8b001', 'Pink Peony', 'Lush pink peony', 6.0, '/assets/custom/peonies/pink.png', 15, true, NOW(), NOW()),
  ('c3d4e5f6-a7b8-4901-c234-d5e6f7a8b002', 'Fushia Peony', 'Bold fushia peony', 6.0, '/assets/custom/peonies/fushia.png', 15, true, NOW(), NOW()),
  ('c3d4e5f6-a7b8-4901-c234-d5e6f7a8b003', 'White Peony', 'Delicate white peony', 6.0, '/assets/custom/peonies/white.png', 20, true, NOW(), NOW()),
  
  -- Chrysanthemums (4 variants)
  ('d4e5f6a7-b8c9-4012-d345-e6f7a8b9c001', 'White Chrysanthemum', 'Classic white mum', 2.5, '/assets/custom/chrysanthemum/white.png', 25, true, NOW(), NOW()),
  ('d4e5f6a7-b8c9-4012-d345-e6f7a8b9c002', 'Yellow Chrysanthemum', 'Golden yellow mum', 2.5, '/assets/custom/chrysanthemum/yellow.png', 25, true, NOW(), NOW()),
  ('d4e5f6a7-b8c9-4012-d345-e6f7a8b9c003', 'Orange Chrysanthemum', 'Warm orange mum', 2.5, '/assets/custom/chrysanthemum/orange.png', 25, true, NOW(), NOW()),
  ('d4e5f6a7-b8c9-4012-d345-e6f7a8b9c004', 'Purple Chrysanthemum', 'Deep purple mum', 2.5, '/assets/custom/chrysanthemum/purple.png', 25, true, NOW(), NOW()),
  
  -- Gypsum / Baby's Breath (7 variants)
  ('e5f6a7b8-c9d0-4123-e456-f7a8b9c0d001', 'White Gypsum', 'Snowy white baby''s breath', 2.0, '/assets/custom/gypsum/white.png', 30, true, NOW(), NOW()),
  ('e5f6a7b8-c9d0-4123-e456-f7a8b9c0d002', 'Pink Gypsum', 'Soft pink baby''s breath', 2.5, '/assets/custom/gypsum/pink.png', 25, true, NOW(), NOW()),
  ('e5f6a7b8-c9d0-4123-e456-f7a8b9c0d003', 'Blue Gypsum', 'Dreamy blue baby''s breath', 2.5, '/assets/custom/gypsum/blue.png', 20, true, NOW(), NOW()),
  ('e5f6a7b8-c9d0-4123-e456-f7a8b9c0d004', 'Dark Blue Gypsum', 'Deep dark blue baby''s breath', 2.5, '/assets/custom/gypsum/dark blue.png', 15, true, NOW(), NOW()),
  ('e5f6a7b8-c9d0-4123-e456-f7a8b9c0d005', 'Purple Gypsum', 'Lavender purple baby''s breath', 2.5, '/assets/custom/gypsum/purple.png', 20, true, NOW(), NOW()),
  ('e5f6a7b8-c9d0-4123-e456-f7a8b9c0d006', 'Terracotta Gypsum', 'Warm terracotta baby''s breath', 2.5, '/assets/custom/gypsum/terracotta.png', 15, true, NOW(), NOW()),
  ('e5f6a7b8-c9d0-4123-e456-f7a8b9c0d007', 'Yellow Gypsum', 'Sunny yellow baby''s breath', 2.5, '/assets/custom/gypsum/Yellow.png', 25, true, NOW(), NOW()),
  
  -- Daisies (2 variants)
  ('f6a7b8c9-d0e1-4234-f567-a8b9c0d1e001', 'White Daisy', 'Classic white daisy', 2.0, '/assets/custom/daises/white.png', 50, true, NOW(), NOW()),
  ('f6a7b8c9-d0e1-4234-f567-a8b9c0d1e002', 'Yellow Daisy', 'Sunshine yellow daisy', 2.0, '/assets/custom/daises/yellow.png', 50, true, NOW(), NOW()),
  
  -- Sunflowers (2 variants)
  ('a7b8c9d0-e1f2-4345-a678-b9c0d1e2f001', 'Big Sunflower', 'Large radiant sunflower', 4.0, '/assets/custom/sunflowers/big.png', 40, true, NOW(), NOW()),
  ('a8b9c0d1-e2f3-4456-b789-c0d1e2f3a001', 'Small Sunflower', 'Petite sunflower', 3.0, '/assets/custom/sunflowers/small.png', 40, true, NOW(), NOW()),
  
  -- Lilies (4 variants)
  ('b8c9d0e1-f2a3-4456-b789-c0d1e2f3a001', 'White Lily', 'Elegant white lily', 5.0, '/assets/custom/lilly/white.png', 15, true, NOW(), NOW()),
  ('b8c9d0e1-f2a3-4456-b789-c0d1e2f3a002', 'Pink Lily', 'Lovely pink lily', 5.0, '/assets/custom/lilly/pink.png', 15, true, NOW(), NOW()),
  ('b8c9d0e1-f2a3-4456-b789-c0d1e2f3a003', 'Yellow Lily', 'Bright yellow lily', 5.0, '/assets/custom/lilly/yellow.png', 15, true, NOW(), NOW()),
  ('b8c9d0e1-f2a3-4456-b789-c0d1e2f3a004', 'Orange Lily', 'Fiery orange lily', 5.0, '/assets/custom/lilly/orange.png', 15, true, NOW(), NOW()),
  
  -- Orchids (3 variants)
  ('c9d0e1f2-a3b4-4567-c890-d1e2f3a4b001', 'White Orchid', 'Sophisticated white orchid', 8.0, '/assets/custom/orchid/white.png', 15, true, NOW(), NOW()),
  ('c9d0e1f2-a3b4-4567-c890-d1e2f3a4b002', 'Pink Orchid', 'Vibrant pink orchid', 8.0, '/assets/custom/orchid/pink.png', 15, true, NOW(), NOW()),
  ('c9d0e1f2-a3b4-4567-c890-d1e2f3a4b003', 'Blue Orchid', 'Rare blue orchid', 9.0, '/assets/custom/orchid/blue.png', 10, true, NOW(), NOW()),
  
  -- Hydrangeas (3 variants)
  ('d0e1f2a3-b4c5-4678-d901-e2f3a4b5c001', 'White Hydrangea', 'Cloud-like white hydrangea', 6.0, '/assets/custom/hydrangea/white.png', 20, true, NOW(), NOW()),
  ('d0e1f2a3-b4c5-4678-d901-e2f3a4b5c002', 'Pink Hydrangea', 'Blooming pink hydrangea', 6.0, '/assets/custom/hydrangea/pink.png', 15, true, NOW(), NOW()),
  ('d0e1f2a3-b4c5-4678-d901-e2f3a4b5c003', 'Blue Hydrangea', 'Deep blue hydrangea', 6.0, '/assets/custom/hydrangea/blue.png', 15, true, NOW(), NOW()),
  
  -- Gerberas (3 variants)
  ('e1f2a3b4-c5d6-4789-e012-f3a4b5c6d001', 'Red Gerbera', 'Bold red gerbera', 3.0, '/assets/custom/gerbera/red.png', 35, true, NOW(), NOW()),
  ('e1f2a3b4-c5d6-4789-e012-f3a4b5c6d002', 'Yellow Gerbera', 'Happy yellow gerbera', 3.0, '/assets/custom/gerbera/yellow.png', 35, true, NOW(), NOW()),
  ('e1f2a3b4-c5d6-4789-e012-f3a4b5c6d003', 'Orange Gerbera', 'Zesty orange gerbera', 3.0, '/assets/custom/gerbera/orange.png', 30, true, NOW(), NOW()),
  
  -- Lavender (1 variant)
  ('f2a3b4c5-d6e7-4890-f123-a4b5c6d7e001', 'Lavender', 'Aromatic lavender bundle', 4.0, '/assets/custom/lavender/purple.png', 80, true, NOW(), NOW()),
  
  -- Carnations (5 variants)
  ('a3b4c5d6-e7f8-4901-a234-b5c6d7e8f001', 'Red Carnation', 'Deep red carnation', 2.0, '/assets/custom/carnation/red.png', 25, true, NOW(), NOW()),
  ('a3b4c5d6-e7f8-4901-a234-b5c6d7e8f002', 'White Carnation', 'Pure white carnation', 2.0, '/assets/custom/carnation/white.png', 25, true, NOW(), NOW()),
  ('a3b4c5d6-e7f8-4901-a234-b5c6d7e8f003', 'Pink Carnation', 'Sweet pink carnation', 2.0, '/assets/custom/carnation/pink.png', 25, true, NOW(), NOW()),
  ('a3b4c5d6-e7f8-4901-a234-b5c6d7e8f004', 'Purple Carnation', 'Royal purple carnation', 2.0, '/assets/custom/carnation/purple.png', 25, true, NOW(), NOW()),
  ('a3b4c5d6-e7f8-4901-a234-b5c6d7e8f005', 'Yellow Carnation', 'Bright yellow carnation', 2.0, '/assets/custom/carnation/yellow.png', 20, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  price_per_stem = EXCLUDED.price_per_stem,
  image_url = EXCLUDED.image_url,
  quantity = EXCLUDED.quantity,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ============================================
-- VERIFICATION
-- ============================================
-- Check that all 49 flowers were inserted
SELECT 
  COUNT(*) as total_flowers,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_flowers,
  SUM(quantity) as total_quantity
FROM flower_types
WHERE id IN (
  'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f001', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f002', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f003',
  'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f004', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f005', 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f006',
  'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a001', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a002', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a003',
  'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a004', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a005', 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a006',
  'c3d4e5f6-a7b8-4901-c234-d5e6f7a8b001', 'c3d4e5f6-a7b8-4901-c234-d5e6f7a8b002', 'c3d4e5f6-a7b8-4901-c234-d5e6f7a8b003',
  'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c001', 'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c002', 'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c003', 'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c004',
  'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d001', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d002', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d003',
  'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d004', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d005', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d006', 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d007',
  'f6a7b8c9-d0e1-4234-f567-a8b9c0d1e001', 'f6a7b8c9-d0e1-4234-f567-a8b9c0d1e002',
  'a7b8c9d0-e1f2-4345-a678-b9c0d1e2f001', 'a8b9c0d1-e2f3-4456-b789-c0d1e2f3a001',
  'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a001', 'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a002', 'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a003', 'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a004',
  'c9d0e1f2-a3b4-4567-c890-d1e2f3a4b001', 'c9d0e1f2-a3b4-4567-c890-d1e2f3a4b002', 'c9d0e1f2-a3b4-4567-c890-d1e2f3a4b003',
  'd0e1f2a3-b4c5-4678-d901-e2f3a4b5c001', 'd0e1f2a3-b4c5-4678-d901-e2f3a4b5c002', 'd0e1f2a3-b4c5-4678-d901-e2f3a4b5c003',
  'e1f2a3b4-c5d6-4789-e012-f3a4b5c6d001', 'e1f2a3b4-c5d6-4789-e012-f3a4b5c6d002', 'e1f2a3b4-c5d6-4789-e012-f3a4b5c6d003',
  'f2a3b4c5-d6e7-4890-f123-a4b5c6d7e001',
  'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f001', 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f002', 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f003',
  'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f004', 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f005'
);

-- List all flowers by family
SELECT 
  CASE 
    WHEN name LIKE '%Rose%' THEN 'Roses'
    WHEN name LIKE '%Tulip%' THEN 'Tulips'
    WHEN name LIKE '%Peony%' THEN 'Peonies'
    WHEN name LIKE '%Chrysanthemum%' THEN 'Chrysanthemums'
    WHEN name LIKE '%Gypsum%' THEN 'Gypsum'
    WHEN name LIKE '%Daisy%' THEN 'Daisies'
    WHEN name LIKE '%Sunflower%' THEN 'Sunflowers'
    WHEN name LIKE '%Lily%' THEN 'Lilies'
    WHEN name LIKE '%Orchid%' THEN 'Orchids'
    WHEN name LIKE '%Hydrangea%' THEN 'Hydrangeas'
    WHEN name LIKE '%Gerbera%' THEN 'Gerberas'
    WHEN name LIKE '%Lavender%' THEN 'Lavender'
    WHEN name LIKE '%Carnation%' THEN 'Carnations'
  END as family,
  COUNT(*) as count
FROM flower_types
WHERE is_active = true
GROUP BY family
ORDER BY family;
