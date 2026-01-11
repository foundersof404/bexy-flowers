# Admin Page - 49 Flowers Fix

## Problem
The admin page was showing only 26 flower types instead of all 49 flowers that should be available for the Customize page.

## Root Cause
The original SQL seed file (`SEED_CUSTOMIZE_FLOWERS.sql`) created only 14 flower_types (families) with flower_colors for variants. The admin page displays `flower_types`, so it only showed 14-26 entries (depending on what was in the database).

## Solution
Created a new SQL seed file (`SEED_ALL_49_FLOWERS.sql`) that creates **49 individual flower_types** - one for each flower variant. This ensures:
1. The admin page shows all 49 flowers
2. Each flower can be managed individually (price, quantity, availability)
3. The Customize page can still access all 49 flowers

## Changes Made

### 1. New SQL Seed File
**File:** `docs/migrations/SEED_ALL_49_FLOWERS.sql`

- Creates 49 individual `flower_types` entries
- Each flower variant is now a separate `flower_type`:
  - "Red Rose", "White Rose", "Pink Rose", etc. (6 roses)
  - "Red Tulip", "White Tulip", etc. (6 tulips)
  - "Pink Peony", "Fushia Peony", "White Peony" (3 peonies)
  - And so on for all 49 flowers
- Uses `ON CONFLICT DO UPDATE` to safely update existing entries
- Includes verification queries at the end

### 2. Updated Mapping Function
**File:** `src/lib/api/flowers.ts`

- Updated `getFlowersForCustomize()` to work with the new structure
- Each `flower_type` now directly maps to a `CustomizeFlower`
- Added `FLOWER_NAME_TO_ID` mapping to ensure correct IDs match static data
- Simplified logic since we no longer need to combine `flower_types` + `flower_colors`

## How to Apply

1. **Run the new SQL seed file:**
   - Open Supabase SQL Editor
   - Run `docs/migrations/SEED_ALL_49_FLOWERS.sql`
   - This will create/update all 49 flower_types

2. **Verify in Admin:**
   - Go to Admin → Flowers
   - You should now see all 49 flowers listed
   - Each flower can be edited individually

3. **Verify on Customize Page:**
   - Go to Customize page
   - All 49 flowers should appear in "Choose Your Blooms" section
   - Admin updates should reflect immediately

## Flower Breakdown (49 total)

- **Roses:** 6 variants (Red, White, Pink, Yellow, Blue, Peach)
- **Tulips:** 6 variants (Red, White, Pink, Yellow, Blue, Peach)
- **Peonies:** 3 variants (Pink, Fushia, White)
- **Chrysanthemums:** 4 variants (White, Yellow, Orange, Purple)
- **Gypsum:** 7 variants (White, Pink, Blue, Dark Blue, Purple, Terracotta, Yellow)
- **Daisies:** 2 variants (White, Yellow)
- **Sunflowers:** 2 variants (Big, Small)
- **Lilies:** 4 variants (White, Pink, Yellow, Orange)
- **Orchids:** 3 variants (White, Pink, Blue)
- **Hydrangeas:** 3 variants (White, Pink, Blue)
- **Gerberas:** 3 variants (Red, Yellow, Orange)
- **Lavender:** 1 variant (Purple)
- **Carnations:** 5 variants (Red, White, Pink, Purple, Yellow)

**Total: 49 flowers** ✓

## Notes

- The old seed file (`SEED_CUSTOMIZE_FLOWERS.sql`) is kept for reference but is no longer needed
- The new structure is simpler and more intuitive for admin management
- Each flower can now have its own price, quantity, and availability status
- The `flower_colors` table is still available for future use if needed
