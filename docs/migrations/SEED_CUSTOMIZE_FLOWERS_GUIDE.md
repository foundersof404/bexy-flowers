# Seeding Customize Page Flowers - Implementation Guide

## Overview

This guide explains how to connect the Customize page to the database so admin updates reflect immediately.

## Current Structure

**Static Data (`src/data/flowers.ts`):**
- Array of individual flowers: `{ id: "rose-red", name: "Red Rose", family: "roses", colorName: "red", price: 3.5, ... }`
- Each flower is a complete entity

**Database Structure:**
- `flower_types`: Families (Roses, Tulips, etc.) - `{ id, name, price_per_stem, quantity, is_active }`
- `flower_colors`: Color variants within each family - `{ id, flower_id, name, color_value, quantity }`

## Mapping Strategy

Since the database groups by family and the Customize page expects individual flowers, we need:

1. **Seed Script**: Populate database with families and colors
2. **Mapping Function**: Convert database format to Customize format
3. **Customize Page Update**: Use database data instead of static data

## Implementation Steps

### Step 1: Seed Database

Run the SQL seed script (`SEED_CUSTOMIZE_FLOWERS.sql`) which:
- Creates flower_types for each family (Roses, Tulips, Peonies, etc.)
- Creates flower_colors for each color variant within each family
- Sets appropriate quantities and is_active flags

### Step 2: Create Mapping API Function

Add to `src/lib/api/flowers.ts`:

```typescript
export interface CustomizeFlower {
  id: string; // Format: "{family}-{colorName}" (e.g., "roses-red")
  name: string; // Format: "{Color} {Family}" (e.g., "Red Rose")
  price: number; // From flower_type.price_per_stem
  family: string; // From flower_type.name (lowercase)
  colorName: string; // From flower_color.name (lowercase)
  imageUrl: string; // From flower_type.image_url (can be customized per color)
  description: string; // Generated or from flower_type.title
  category: string; // Derived from family
  seasons: Season[]; // Can be added to database or hardcoded mapping
}

/**
 * Get all flowers in Customize page format
 * Maps database structure (flower_types + flower_colors) to individual flowers
 */
export async function getFlowersForCustomize(): Promise<CustomizeFlower[]> {
  // Fetch all active flower types
  const { data: flowerTypes, error: typesError } = await supabase
    .from('flower_types')
    .select('*')
    .eq('is_active', true)
    .gt('quantity', 0)
    .order('name', { ascending: true });

  if (typesError) {
    throw new Error(`Failed to fetch flower types: ${typesError.message}`);
  }

  if (!flowerTypes || flowerTypes.length === 0) {
    return [];
  }

  // Fetch all colors for these flower types
  const { data: colors, error: colorsError } = await supabase
    .from('flower_colors')
    .select('*')
    .in('flower_id', flowerTypes.map(ft => ft.id))
    .gt('quantity', 0)
    .order('name', { ascending: true });

  if (colorsError) {
    throw new Error(`Failed to fetch flower colors: ${colorsError.message}`);
  }

  // Map to Customize format
  const flowers: CustomizeFlower[] = [];
  
  for (const flowerType of flowerTypes) {
    const typeColors = colors?.filter(c => c.flower_id === flowerType.id) || [];
    
    // If no colors exist, create a default entry
    if (typeColors.length === 0) {
      const family = flowerType.name.toLowerCase();
      flowers.push({
        id: `${family}-default`,
        name: flowerType.name,
        price: flowerType.price_per_stem,
        family,
        colorName: 'default',
        imageUrl: flowerType.image_url || '',
        description: flowerType.title || flowerType.name,
        category: family,
        seasons: ['all-year'] // Default, can be enhanced
      });
    } else {
      // Create an entry for each color
      for (const color of typeColors) {
        const family = flowerType.name.toLowerCase();
        const colorName = color.name.toLowerCase();
        flowers.push({
          id: `${family}-${colorName}`,
          name: `${color.name} ${flowerType.name}`,
          price: flowerType.price_per_stem,
          family,
          colorName,
          imageUrl: flowerType.image_url || '', // Can be enhanced to use color-specific images
          description: `${color.name} ${flowerType.name}`,
          category: family,
          seasons: ['all-year'] // Can be enhanced with season mapping
        });
      }
    }
  }

  return flowers;
}
```

### Step 3: Update Customize Page

In `src/pages/Customize.tsx`:

1. Add import:
```typescript
import { getFlowersForCustomize } from '@/lib/api/flowers';
```

2. Add React Query hook:
```typescript
const { data: customizeFlowers = [], isLoading: flowersLoading } = useQuery({
  queryKey: ['flowers', 'customize'],
  queryFn: getFlowersForCustomize,
  staleTime: 2 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});
```

3. Replace static `flowers` import with database data:
```typescript
// Replace: import { flowers, ... } from '@/data/flowers';
// With: Use customizeFlowers from React Query
const flowers = customizeFlowers;
```

4. Filter by is_active and quantity (already done in API function)

### Step 4: Season Mapping (Optional Enhancement)

Add a mapping table or function to convert flower families to seasons:

```typescript
const SEASON_MAPPING: Record<string, Season[]> = {
  'roses': ['all-year'],
  'tulips': ['winter', 'spring'],
  'peonies': ['summer'],
  // ... etc
};
```

## Benefits

✅ Admin updates to `is_active` and `quantity` immediately reflect on Customize page
✅ Admin can manage flower availability in real-time
✅ No need to redeploy when availability changes
✅ Consistent data source (database) across admin and public pages

## Notes

- Season data can be added as a JSONB column to `flower_types` in the future
- Color-specific images can be added to `flower_colors` table
- The mapping preserves the Customize page structure while using database data
