# Seed Data for Flowers, Luxury Boxes, and Accessories

This document explains how to use the seed data SQL file to populate your database with initial data.

## File Location

`docs/migrations/SEED_FLOWERS_BOXES_ACCESSORIES.sql`

## What This Seed Data Includes

### 1. Flower Types (12 types)
- Roses
- Peonies
- Lilies
- Tulips
- Sunflowers
- Orchids
- Carnations
- Baby's Breath
- Daisies
- Hydrangeas
- Gerbera Daisies
- Chrysanthemums

### 2. Flower Colors (52 color variations)
Each flower type has multiple color options. For example:
- Roses: Red, Pink, White, Yellow, Orange
- Peonies: Pink, White, Coral, Lavender
- And more...

### 3. Luxury Boxes (10 boxes/wraps)
- **Boxes (5 types):**
  - Classic Heart Box
  - Round Gift Box
  - Rectangular Premium Box
  - Oval Elegance Box
  - Square Modern Box

- **Wraps (5 types):**
  - Tissue Wrap
  - Cellophane Wrap
  - Fabric Wrap
  - Burlap Wrap
  - Ribbon Wrap

### 4. Box Colors (23 color options)
Each box has multiple color variations with hex codes and gradient CSS where applicable.

### 5. Box Sizes (16 size options)
Different boxes have different size options (Small, Medium, Large, X-Large) with capacity and pricing.

### 6. Accessories (20 items)
- Decorative Ribbon
- Greeting Card
- Vases (Glass & Ceramic)
- Water Crystal Packs
- Floral Foam
- Filler Greens
- Sparkle Spray
- Dried Lavender
- Preserved Roses
- LED Lights
- Chocolate Box
- Gift Bag
- And more...

## How to Use

### Option 1: Using Supabase SQL Editor

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the entire contents of `SEED_FLOWERS_BOXES_ACCESSORIES.sql`
5. Click "Run" to execute the script

### Option 2: Using psql Command Line

```bash
psql -h your-db-host -U your-username -d your-database -f docs/migrations/SEED_FLOWERS_BOXES_ACCESSORIES.sql
```

### Option 3: Using Database Client

1. Open your database client (pgAdmin, DBeaver, etc.)
2. Connect to your database
3. Open and execute the SQL file

## Prerequisites

Before running this script, ensure:

1. **Tables exist**: Make sure all required tables are created:
   - `flower_types`
   - `flower_colors`
   - `luxury_boxes`
   - `box_colors`
   - `box_sizes`
   - `accessories`

2. **UUID extension**: The script includes `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` but ensure your database supports it.

3. **Foreign key constraints**: The script assumes foreign key relationships exist between:
   - `flower_colors.flower_id` → `flower_types.id`
   - `box_colors.box_id` → `luxury_boxes.id`
   - `box_sizes.box_id` → `luxury_boxes.id`

## Data Verification

After running the script, you can verify the data using these queries:

```sql
-- Count all records
SELECT 'Flower Types' as table_name, COUNT(*) as count FROM flower_types
UNION ALL
SELECT 'Flower Colors', COUNT(*) FROM flower_colors
UNION ALL
SELECT 'Luxury Boxes', COUNT(*) FROM luxury_boxes
UNION ALL
SELECT 'Box Colors', COUNT(*) FROM box_colors
UNION ALL
SELECT 'Box Sizes', COUNT(*) FROM box_sizes
UNION ALL
SELECT 'Accessories', COUNT(*) FROM accessories;

-- Verify flower type colors
SELECT ft.name as flower_type, COUNT(fc.id) as color_count 
FROM flower_types ft 
LEFT JOIN flower_colors fc ON ft.id = fc.flower_id 
GROUP BY ft.id, ft.name 
ORDER BY ft.name;

-- Verify box colors and sizes
SELECT lb.name as box_name, lb.type, COUNT(DISTINCT bc.id) as color_count, COUNT(DISTINCT bs.id) as size_count
FROM luxury_boxes lb
LEFT JOIN box_colors bc ON lb.id = bc.box_id
LEFT JOIN box_sizes bs ON lb.id = bs.box_id
GROUP BY lb.id, lb.name, lb.type
ORDER BY lb.type, lb.name;
```

## Expected Results

After running the script successfully, you should have:
- ✅ 12 flower types
- ✅ 52 flower colors
- ✅ 10 luxury boxes
- ✅ 23 box colors
- ✅ 16 box sizes
- ✅ 20 accessories

## Important Notes

1. **Duplicate Prevention**: The script uses `ON CONFLICT (id) DO NOTHING` to prevent duplicate entries if you run it multiple times.

2. **Image URLs**: All `image_url` fields are set to `NULL`. You'll need to upload images through the admin interface and update these URLs, or modify the SQL file with your image URLs before running.

3. **Active Status**: All items are set to `is_active = true` by default. You can update this through the admin interface.

4. **Prices**: Prices are set in USD. Adjust them according to your currency and pricing strategy.

5. **Quantities**: Inventory quantities are set to realistic levels. Adjust them based on your actual inventory.

## Troubleshooting

### Error: "relation does not exist"
- **Solution**: Make sure all tables are created before running the seed script.

### Error: "foreign key constraint violation"
- **Solution**: Ensure parent records (flower_types, luxury_boxes) are inserted before child records (colors, sizes).

### Error: "duplicate key value"
- **Solution**: The script uses `ON CONFLICT DO NOTHING`, but if you see this error, the IDs might already exist. Delete existing records or modify the IDs in the script.

### No data appears in admin interface
- **Solution**: 
  1. Verify the data was inserted using the verification queries
  2. Check that `is_active = true` for all records
  3. Clear browser cache and refresh
  4. Check React Query cache - try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Updating Seed Data

To modify the seed data:

1. Edit the SQL file directly
2. Update the VALUES clauses with your desired data
3. Maintain UUID format for IDs
4. Ensure foreign key relationships are correct
5. Re-run the script (it will skip existing IDs due to `ON CONFLICT DO NOTHING`)

## Admin Interface Connection

This seed data is designed to work with the admin pages:
- **Flower Types**: `/admin/flowers` - AdminFlowers component
- **Luxury Boxes**: `/admin/boxes` - AdminLuxuryBoxes component  
- **Accessories**: `/admin/accessories` - AdminAccessories component

All data will appear in these admin interfaces once the SQL script is executed successfully.

