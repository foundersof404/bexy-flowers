-- ============================================
-- SEED DATA: FLOWERS, LUXURY BOXES, AND ACCESSORIES
-- ============================================
-- This SQL script populates the database with initial data for:
-- 1. Flower Types with Colors
-- 2. Luxury Boxes with Colors and Sizes
-- 3. Accessories
-- 
-- Run this script after creating the tables to populate initial data
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. FLOWER TYPES
-- ============================================

INSERT INTO flower_types (id, name, title, price_per_stem, image_url, quantity, is_active, created_at, updated_at)
VALUES
  -- Roses
  ('550e8400-e29b-41d4-a716-446655440001', 'Roses', 'Classic Roses', 2.50, NULL, 500, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Peonies', 'Elegant Peonies', 4.00, NULL, 300, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Lilies', 'Beautiful Lilies', 3.00, NULL, 400, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'Tulips', 'Spring Tulips', 1.50, NULL, 600, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'Sunflowers', 'Bright Sunflowers', 2.00, NULL, 350, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440006', 'Orchids', 'Exotic Orchids', 5.00, NULL, 200, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440007', 'Carnations', 'Classic Carnations', 1.25, NULL, 700, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440008', 'Baby''s Breath', 'Delicate Baby''s Breath', 0.75, NULL, 800, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440009', 'Daisies', 'Cheerful Daisies', 1.00, NULL, 650, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440010', 'Hydrangeas', 'Lush Hydrangeas', 3.50, NULL, 250, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440011', 'Gerbera Daisies', 'Vibrant Gerbera', 2.25, NULL, 450, true, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440012', 'Chrysanthemums', 'Autumn Mums', 1.75, NULL, 550, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. FLOWER COLORS
-- ============================================

-- Rose Colors
INSERT INTO flower_colors (id, flower_id, name, color_value, quantity, created_at, updated_at)
VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Red', '#DC143C', 150, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Pink', '#FFC0CB', 120, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'White', '#FFFFFF', 100, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Yellow', '#FFFF00', 80, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Orange', '#FFA500', 50, NOW(), NOW()),

-- Peony Colors
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Pink', '#FFB6C1', 100, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'White', '#FFFFFF', 90, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Coral', '#FF7F50', 60, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'Lavender', '#E6E6FA', 50, NOW(), NOW()),

-- Lily Colors
  ('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'White', '#FFFFFF', 150, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Pink', '#FFC0CB', 100, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Orange', '#FFA500', 80, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'Yellow', '#FFFF00', 70, NOW(), NOW()),

-- Tulip Colors
  ('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'Red', '#DC143C', 120, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004', 'Yellow', '#FFFF00', 100, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440004', 'Pink', '#FFC0CB', 100, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440004', 'Purple', '#800080', 90, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440004', 'White', '#FFFFFF', 80, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440004', 'Orange', '#FFA500', 110, NOW(), NOW()),

-- Sunflower Colors (typically yellow, but variations exist)
  ('660e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440005', 'Classic Yellow', '#FFD700', 200, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440005', 'Orange-Yellow', '#FFA500', 100, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440005', 'Red', '#DC143C', 50, NOW(), NOW()),

-- Orchid Colors
  ('660e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440006', 'Purple', '#800080', 80, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440006', 'White', '#FFFFFF', 60, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440006', 'Pink', '#FFC0CB', 40, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440006', 'Yellow', '#FFFF00', 20, NOW(), NOW()),

-- Carnation Colors
  ('660e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440007', 'Red', '#DC143C', 200, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440007', 'Pink', '#FFC0CB', 150, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440007', 'White', '#FFFFFF', 140, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440007', 'Yellow', '#FFFF00', 120, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440007', 'Purple', '#800080', 90, NOW(), NOW()),

-- Baby's Breath (typically white)
  ('660e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440008', 'White', '#FFFFFF', 400, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440008', 'Pink', '#FFB6C1', 250, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440008', 'Blue', '#87CEEB', 150, NOW(), NOW()),

-- Daisy Colors
  ('660e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440009', 'White', '#FFFFFF', 250, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440009', 'Yellow', '#FFFF00', 200, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440009', 'Pink', '#FFC0CB', 150, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440009', 'Purple', '#9370DB', 50, NOW(), NOW()),

-- Hydrangea Colors
  ('660e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440010', 'Blue', '#4169E1', 80, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440010', 'Pink', '#FFC0CB', 70, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440010', 'White', '#FFFFFF', 60, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440010', 'Purple', '#9370DB', 40, NOW(), NOW()),

-- Gerbera Daisy Colors
  ('660e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440011', 'Red', '#DC143C', 120, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440011', 'Orange', '#FFA500', 110, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440011', 'Yellow', '#FFFF00', 100, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440011', 'Pink', '#FFC0CB', 80, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440011', 'White', '#FFFFFF', 40, NOW(), NOW()),

-- Chrysanthemum Colors
  ('660e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440012', 'Yellow', '#FFFF00', 150, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440012', 'White', '#FFFFFF', 120, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440012', 'Purple', '#9370DB', 100, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440012', 'Orange', '#FFA500', 90, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440012', 'Red', '#DC143C', 90, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. LUXURY BOXES
-- ============================================

INSERT INTO luxury_boxes (id, name, type, price, description, quantity, is_active, created_at, updated_at)
VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Classic Heart Box', 'box', 25.00, 'Elegant heart-shaped box perfect for romantic bouquets', 100, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440002', 'Round Gift Box', 'box', 20.00, 'Beautiful round box with secure lid', 150, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440003', 'Rectangular Premium Box', 'box', 30.00, 'Luxury rectangular box with gold accents', 80, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440004', 'Oval Elegance Box', 'box', 22.50, 'Sophisticated oval-shaped box', 120, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440005', 'Square Modern Box', 'box', 18.00, 'Contemporary square box with minimalist design', 200, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440006', 'Tissue Wrap', 'wrap', 5.00, 'Elegant tissue paper wrap in multiple colors', 500, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440007', 'Cellophane Wrap', 'wrap', 4.50, 'Clear cellophane wrap for protection', 600, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440008', 'Fabric Wrap', 'wrap', 8.00, 'Premium fabric wrapping in luxurious textures', 300, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440009', 'Burlap Wrap', 'wrap', 6.50, 'Rustic burlap wrap with natural aesthetic', 400, true, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440010', 'Ribbon Wrap', 'wrap', 7.00, 'Delicate ribbon wrapping with bow', 350, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. BOX COLORS
-- ============================================

INSERT INTO box_colors (id, box_id, name, color_hex, gradient_css, quantity, created_at, updated_at)
VALUES
  -- Classic Heart Box Colors
  ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Gold', '#FFD700', 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', 30, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Rose Gold', '#E8B4B8', 'linear-gradient(135deg, #E8B4B8 0%, #F5CEC7 100%)', 25, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'Red', '#DC143C', 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)', 25, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'White', '#FFFFFF', NULL, 20, NOW(), NOW()),

  -- Round Gift Box Colors
  ('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'Black', '#000000', NULL, 40, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 'White', '#FFFFFF', NULL, 35, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002', 'Ivory', '#FFFFF0', NULL, 30, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440002', 'Silver', '#C0C0C0', 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)', 25, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440002', 'Pink', '#FFC0CB', NULL, 20, NOW(), NOW()),

  -- Rectangular Premium Box Colors
  ('880e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440003', 'Gold', '#FFD700', 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)', 25, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440003', 'Black', '#000000', NULL, 20, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440003', 'Burgundy', '#800020', NULL, 18, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440003', 'Navy Blue', '#000080', NULL, 17, NOW(), NOW()),

  -- Oval Elegance Box Colors
  ('880e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440004', 'Blush Pink', '#FFB6C1', NULL, 30, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440004', 'Lavender', '#E6E6FA', NULL, 28, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440004', 'Mint Green', '#98FB98', NULL, 25, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440017', '770e8400-e29b-41d4-a716-446655440004', 'Pearl White', '#F8F8FF', NULL, 22, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440018', '770e8400-e29b-41d4-a716-446655440004', 'Sage Green', '#87AE87', NULL, 15, NOW(), NOW()),

  -- Square Modern Box Colors
  ('880e8400-e29b-41d4-a716-446655440019', '770e8400-e29b-41d4-a716-446655440005', 'Charcoal', '#36454F', NULL, 50, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440005', 'White', '#FFFFFF', NULL, 45, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440005', 'Beige', '#F5F5DC', NULL, 38, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440022', '770e8400-e29b-41d4-a716-446655440005', 'Gray', '#808080', NULL, 35, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440023', '770e8400-e29b-41d4-a716-446655440005', 'Navy', '#000080', NULL, 32, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. BOX SIZES
-- ============================================

INSERT INTO box_sizes (id, box_id, name, capacity, price, description, created_at, updated_at)
VALUES
  -- Classic Heart Box Sizes
  ('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Small', 12, 0.00, 'Holds 12 stems - Perfect for a small bouquet', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Medium', 24, 5.00, 'Holds 24 stems - Ideal for medium arrangements', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'Large', 36, 10.00, 'Holds 36 stems - Perfect for grand gestures', NOW(), NOW()),

  -- Round Gift Box Sizes
  ('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', 'Small', 10, 0.00, 'Holds 10 stems', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'Medium', 20, 4.00, 'Holds 20 stems', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 'Large', 30, 8.00, 'Holds 30 stems', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002', 'X-Large', 50, 15.00, 'Holds 50 stems', NOW(), NOW()),

  -- Rectangular Premium Box Sizes
  ('990e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', 'Medium', 25, 0.00, 'Holds 25 stems - Standard premium size', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440003', 'Large', 40, 8.00, 'Holds 40 stems - Luxurious large size', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440003', 'X-Large', 60, 18.00, 'Holds 60 stems - Premium display size', NOW(), NOW()),

  -- Oval Elegance Box Sizes
  ('990e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440004', 'Small', 15, 0.00, 'Holds 15 stems', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440004', 'Medium', 28, 6.00, 'Holds 28 stems', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440004', 'Large', 42, 12.00, 'Holds 42 stems', NOW(), NOW()),

  -- Square Modern Box Sizes
  ('990e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440005', 'Small', 18, 0.00, 'Holds 18 stems', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440005', 'Medium', 32, 5.00, 'Holds 32 stems', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440005', 'Large', 48, 10.00, 'Holds 48 stems', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. ACCESSORIES
-- ============================================

INSERT INTO accessories (id, name, price, description, image_url, quantity, is_active, created_at, updated_at)
VALUES
  ('aa0e8400-e29b-41d4-a716-446655440001', 'Decorative Ribbon', 3.50, 'Elegant satin ribbon in various colors - 3 yards', NULL, 200, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440002', 'Greeting Card', 2.00, 'Beautiful greeting card with envelope', NULL, 500, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440003', 'Vase (Glass)', 15.00, 'Clear glass vase - Medium size (8 inches)', NULL, 150, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440004', 'Vase (Ceramic)', 18.00, 'Elegant ceramic vase in white - Medium size', NULL, 120, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440005', 'Water Crystal Packs', 4.00, 'Flower food packets to keep flowers fresh longer (3 packets)', NULL, 300, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440006', 'Floral Foam', 5.50, 'Green floral foam for arrangement stability', NULL, 180, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440007', 'Filler Greens', 2.50, 'Eucalyptus, ferns, or baby''s breath as filler', NULL, 250, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440008', 'Sparkle Spray', 6.00, 'Glitter spray for added sparkle to arrangements', NULL, 100, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440009', 'Dried Lavender', 8.00, 'Fragrant dried lavender bundle', NULL, 80, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440010', 'Preserved Roses', 25.00, 'Long-lasting preserved roses (set of 3)', NULL, 60, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440011', 'LED Lights', 12.00, 'String of LED fairy lights for bouquet display', NULL, 90, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440012', 'Chocolate Box', 10.00, 'Premium chocolate box (6 pieces)', NULL, 140, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440013', 'Gift Bag', 4.50, 'Luxury gift bag with handles', NULL, 220, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440014', 'Ornamental Stones', 7.00, 'Decorative stones for vase decoration', NULL, 110, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440015', 'Candle Set', 15.00, 'Set of 2 scented candles', NULL, 95, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440016', 'Photo Frame', 12.00, 'Small decorative photo frame (4x6 inches)', NULL, 130, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440017', 'Pebbles & Sand', 5.00, 'Decorative pebbles and sand for arrangements', NULL, 160, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440018', 'Stem Cutter', 8.50, 'Professional flower stem cutter tool', NULL, 70, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440019', 'Moss Pad', 6.50, 'Natural moss pad for base decoration', NULL, 85, true, NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440020', 'Decorative Pin', 3.00, 'Decorative pins for securing arrangements', NULL, 280, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Uncomment to verify the data was inserted correctly

-- SELECT COUNT(*) as flower_types_count FROM flower_types;
-- SELECT COUNT(*) as flower_colors_count FROM flower_colors;
-- SELECT COUNT(*) as luxury_boxes_count FROM luxury_boxes;
-- SELECT COUNT(*) as box_colors_count FROM box_colors;
-- SELECT COUNT(*) as box_sizes_count FROM box_sizes;
-- SELECT COUNT(*) as accessories_count FROM accessories;

-- Verify relationships (should return counts matching above)
-- SELECT ft.name as flower_type, COUNT(fc.id) as color_count 
-- FROM flower_types ft 
-- LEFT JOIN flower_colors fc ON ft.id = fc.flower_id 
-- GROUP BY ft.id, ft.name 
-- ORDER BY ft.name;

-- SELECT lb.name as box_name, COUNT(bc.id) as color_count, COUNT(bs.id) as size_count
-- FROM luxury_boxes lb
-- LEFT JOIN box_colors bc ON lb.id = bc.box_id
-- LEFT JOIN box_sizes bs ON lb.id = bs.box_id
-- GROUP BY lb.id, lb.name
-- ORDER BY lb.name;

-- ============================================
-- NOTES
-- ============================================
-- This seed data includes:
-- - 12 flower types with 52 color variations
-- - 10 luxury boxes (5 boxes, 5 wraps) with 23 color options and 16 size options
-- - 20 accessories for bouquet customization
--
-- All items are set to is_active = true by default
-- Image URLs are set to NULL - you can update them after uploading images through the admin interface
-- Prices are in USD
-- Quantities are set to realistic inventory levels
--
-- Foreign Key Relationships:
-- - flower_colors.flower_id -> flower_types.id
-- - box_colors.box_id -> luxury_boxes.id
-- - box_sizes.box_id -> luxury_boxes.id
--
-- ============================================
-- END OF SEED DATA
-- ============================================

