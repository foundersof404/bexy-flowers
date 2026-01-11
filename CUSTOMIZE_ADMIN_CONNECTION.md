# Customize Page - Admin Connection Status

## Current State

The **Customize page** (`/src/pages/Customize.tsx`) currently uses **static data** from:
- `@/data/flowers` - Static flower definitions with families, colors, seasons
- Hardcoded `packages`, `sizes`, `colors`, `boxShapes`, `accessories` arrays

The **Admin pages** manage **database data** via:
- `AdminFlowers` - Manages `flower_types` and `flower_colors` tables
- `AdminLuxuryBoxes` - Manages `luxury_boxes`, `box_colors`, `box_sizes` tables  
- `AdminAccessories` - Manages `accessories` table

## Problem

**Data Structure Mismatch:**
- Customize page expects: `{ id, name, family, colorName, seasons, price, ... }` (flat structure)
- Database provides: `flower_types` + `flower_colors` (relational structure)
- No direct mapping between static flower IDs and database records

**Current Behavior:**
- Admin updates to `is_active` and `quantity` are saved to database ✅
- Admin pages reload their own data after updates ✅
- **Customize page does NOT reflect admin changes** ❌ (uses static data)

## Solution Options

### Option 1: Full Refactor (Recommended for Production)
Refactor Customize page to use database data:
- Replace static `flowers` with React Query hooks (`useFlowerTypes`, etc.)
- Map database structure (`flower_types` + `flower_colors`) to Customize format
- Filter by `is_active: true` and `quantity > 0`
- Requires significant code changes but provides real-time updates

### Option 2: Hybrid Approach (Interim Solution)
Keep static data but add availability checks:
- Fetch active items from database using React Query hooks
- Create mapping/availability Set
- Filter static arrays based on database availability
- Still requires mapping logic but less invasive

### Option 3: Documentation Only (Current)
- Document the limitation
- Note that full connection requires refactoring
- Admin updates are saved but Customize page uses static data

## Admin Pages Status

✅ **AdminFlowers**: Uses direct API calls, reloads data after updates  
✅ **AdminLuxuryBoxes**: Uses direct API calls, reloads data after updates  
✅ **AdminAccessories**: Uses direct API calls, reloads data after updates

**Note:** Admin pages don't use React Query mutations, so there's no automatic cache invalidation. They manually reload data after mutations.

## Recommendations

For immediate connection:
1. **Option 2 (Hybrid)** - Add React Query hooks to fetch availability
2. Create simple mapping function (by name matching)
3. Filter static data based on database availability

For long-term solution:
1. **Option 1 (Full Refactor)** - Migrate Customize to use database structure
2. Update data models to match database schema
3. Remove static data dependencies

## Implementation Notes

If implementing Option 2:
- Add `useFlowerTypes({ isActive: true })` hook to Customize
- Add `useLuxuryBoxes()` and `useAccessories({ isActive: true })` hooks
- Create availability check functions
- Filter `availableFlowers` array before rendering
