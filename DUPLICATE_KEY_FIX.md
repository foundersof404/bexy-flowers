# Duplicate Key Error Fix - React Warning

## Issue
Console error: `Warning: Encountered two children with the same key, 'roses'`

This was occurring in the Customize page when rendering the flower selection grid.

## Root Cause
The `getFlowersForCustomize()` function was returning flowers with duplicate IDs when:
1. Multiple flowers in the database had the same name
2. The ID mapping logic generated the same ID for different database entries
3. Database contained duplicate entries

## Solution Applied

### 1. Frontend Deduplication (`src/pages/Customize.tsx`)
Added duplicate detection and unique ID generation:

```typescript
const flowers: EnhancedFlower[] = useMemo(() => {
  const seenIds = new Set<string>();
  const uniqueFlowers: EnhancedFlower[] = [];
  
  customizeFlowers.forEach((f: CustomizeFlower, index: number) => {
    // Ensure unique ID by appending index if duplicate found
    let uniqueId = f.id;
    if (seenIds.has(uniqueId)) {
      uniqueId = `${f.id}-${index}`;
      console.warn(`Duplicate flower ID detected: ${f.id}. Using ${uniqueId} instead.`);
    }
    
    seenIds.add(uniqueId);
    uniqueFlowers.push({
      id: uniqueId,
      // ... rest of flower data
    });
  });
  
  return uniqueFlowers;
}, [customizeFlowers]);
```

**Impact**: Prevents React key warnings by ensuring all rendered flowers have unique IDs

### 2. Backend Deduplication (`src/lib/api/flowers.ts`)
Added duplicate detection at the API level:

```typescript
const seenIds = new Set<string>();

for (const flowerType of flowerTypes) {
  const mapping = FLOWER_NAME_TO_ID[flowerType.name] || {
    // Fallback ID generation
  };
  
  // Skip duplicates
  if (seenIds.has(mapping.id)) {
    console.warn(`Duplicate flower ID in database: ${mapping.id}. Skipping.`);
    continue;
  }
  
  seenIds.add(mapping.id);
  flowers.push({
    id: mapping.id,
    // ... rest of flower data
  });
}
```

**Impact**: Prevents duplicates from reaching the frontend

## Files Modified
1. ✅ `src/pages/Customize.tsx` - Added frontend deduplication
2. ✅ `src/lib/api/flowers.ts` - Added backend deduplication

## Testing
1. Open the Customize page: http://localhost:8081/customize
2. Check browser console - no more duplicate key warnings
3. Verify all flowers display correctly
4. Check console for any warning messages about duplicates

## Prevention
To prevent this issue in the future:

### Database Level
Ensure unique flower entries in the `flower_types` table:
```sql
-- Check for duplicates
SELECT name, COUNT(*) as count
FROM flower_types
WHERE is_active = true AND quantity > 0
GROUP BY name
HAVING COUNT(*) > 1;

-- If duplicates found, keep only one per name
-- (Run this carefully - backup first!)
DELETE FROM flower_types a
USING flower_types b
WHERE a.id < b.id
AND a.name = b.name
AND a.is_active = true;
```

### Application Level
The deduplication logic now handles:
- ✅ Duplicate database entries
- ✅ Duplicate ID mappings
- ✅ Missing ID mappings (fallback generation)

## Console Warnings
If you see warnings like:
```
Duplicate flower ID detected: rose-red. Using rose-red-5 instead.
```

This means:
1. There are duplicate entries in your database
2. The deduplication is working correctly
3. You should clean up the database duplicates

## Status
✅ **FIXED** - No more React duplicate key warnings
✅ **LOGGED** - Warnings help identify database issues
✅ **PREVENTED** - Both frontend and backend deduplication in place

---

**Date Fixed**: January 11, 2026
**Tested On**: Windows 10, localhost:8080/customize
