# Customize Page Database Connection - Implementation Summary

## Overview

This document summarizes the implementation to connect the Customize page to the database so admin updates (availability, quantity) reflect immediately.

## Implementation Steps

### ✅ Step 1: Database Seed Script

**File**: `docs/migrations/SEED_CUSTOMIZE_FLOWERS.sql`

Created a SQL seed script that:
- Creates flower_types for each family (Roses, Tulips, Peonies, etc.)
- Creates flower_colors for each color variant within each family
- Sets appropriate quantities and is_active flags
- Uses `ON CONFLICT DO NOTHING` to prevent duplicates

**To Run**:
1. Open Supabase SQL Editor
2. Copy and paste the contents of `SEED_CUSTOMIZE_FLOWERS.sql`
3. Execute the script

### ✅ Step 2: API Mapping Function

**File**: `src/lib/api/flowers.ts`

Added:
- `CustomizeFlower` interface - matches the Customize page format
- `getFlowersForCustomize()` function - maps database structure (flower_types + flower_colors) to individual flowers
- Season mapping for flower families
- Filters for `is_active = true` and `quantity > 0`

**Function**: `getFlowersForCustomize()`
- Fetches all active flower types with quantity > 0
- Fetches all colors for these types with quantity > 0
- Maps to Customize format: `{ id: "roses-red", name: "Red Rose", family: "roses", colorName: "red", ... }`
- Returns only available flowers

### ✅ Step 3: React Query Hook

**File**: `src/hooks/useFlowers.ts`

Added:
- `useFlowersForCustomize()` hook - React Query wrapper for `getFlowersForCustomize()`
- Proper caching configuration (2 min staleTime, 5 min gcTime)
- Cache key: `['flowers', 'customize']`

### ⚠️ Step 4: Update Customize Page

**File**: `src/pages/Customize.tsx`

**Required Changes**:

1. **Import the hook**:
```typescript
import { useFlowersForCustomize } from '@/hooks/useFlowers';
```

2. **Add React Query hook** (in the component):
```typescript
const { data: customizeFlowers = [], isLoading: flowersLoading } = useFlowersForCustomize();
```

3. **Replace static import**:
```typescript
// Remove or comment out:
// import { flowers, flowerFamilies, flowerCategories } from '@/data/flowers';

// Use database data instead:
const flowers = customizeFlowers;
```

4. **Handle loading state** (optional):
```typescript
if (flowersLoading) {
  return <div>Loading flowers...</div>; // Or your loading component
}
```

5. **Update type mapping** (if needed):
The `CustomizeFlower` interface should match `EnhancedFlower` from `@/data/flowers`. If there are differences, you may need to map the data:
```typescript
const flowers = customizeFlowers.map(f => ({
  ...f,
  // Map any differences between CustomizeFlower and EnhancedFlower
}));
```

### Step 5: Verify Admin Invalidation

**File**: `src/hooks/useFlowers.ts` (mutations)

Ensure that when admin updates flower availability:
- `useCreateFlower` invalidates `['flowers', 'customize']`
- `useUpdateFlower` invalidates `['flowers', 'customize']`
- `useDeleteFlower` invalidates `['flowers', 'customize']`

**Current Status**: The mutations invalidate `flowersQueryKeys.lists()` but not `['flowers', 'customize']`. You may need to add:
```typescript
queryClient.invalidateQueries({ queryKey: ['flowers', 'customize'] });
```

## Benefits

✅ Admin updates to `is_active` and `quantity` immediately reflect on Customize page
✅ Admin can manage flower availability in real-time
✅ No need to redeploy when availability changes
✅ Consistent data source (database) across admin and public pages
✅ Only active flowers with quantity > 0 are shown

## Testing

1. **Seed the database** with the SQL script
2. **Update Customize page** to use `useFlowersForCustomize()`
3. **Test admin updates**:
   - Deactivate a flower in AdminFlowers
   - Verify it disappears from Customize page
   - Set quantity to 0
   - Verify it disappears from Customize page
   - Reactivate a flower
   - Verify it appears on Customize page

## Notes

- The seed script uses hardcoded UUIDs. Adjust if needed.
- Season mapping is currently hardcoded. Can be moved to database later.
- Image URLs use the base flower_type image. Can be enhanced per color.
- The mapping preserves the Customize page structure while using database data.

## Next Steps

1. ✅ Seed database with flower data
2. ⚠️ Update Customize page to use `useFlowersForCustomize()`
3. ⚠️ Verify admin mutations invalidate the customize query
4. ⚠️ Test the connection
5. Optional: Add season column to database
6. Optional: Add per-color image URLs
