# Frontend Integration Guide

## Overview

This guide shows how to integrate your frontend pages with Supabase to display dynamic data from the admin dashboard.

---

## 1. Signature Collection (Home Page)

### File: `src/components/UltraFeaturedBouquets.tsx`

**Current:** Hardcoded `bouquets` array at line 13-56

**Replace with:**

```typescript
import { useState, useEffect } from 'react';
import { getActiveSignatureCollections } from '@/lib/api/signature-collection';

const UltraFeaturedBouquets = () => {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBouquets();
  }, []);

  const loadBouquets = async () => {
    try {
      const data = await getActiveSignatureCollections();
      // Transform to match existing interface
      const formattedBouquets = data.map(item => ({
        id: item.product?.id || '',
        name: item.product?.title || '',
        price: `$${item.product?.price || 0}`,
        image: item.product?.image_urls?.[0] || '',
        description: item.product?.description || '',
      }));
      setBouquets(formattedBouquets);
    } catch (error) {
      console.error('Error loading signature collection:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // Rest of component remains the same...
```

**Benefits:**
- Home page now displays items from admin dashboard
- Easy to add/remove/reorder from `/admin/signature-collection`
- Perfect for seasonal changes

---

## 2. Collection Page

### File: `src/pages/Collection.tsx`

**Current:** Uses `generatedBouquets` from import

**Replace with:**

```typescript
import { useState, useEffect } from 'react';
import { getCollectionProducts } from '@/lib/api/collection-products';

const Collection = () => {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters: any = { isActive: true };
      
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      
      const data = await getCollectionProducts(filters);
      
      // Transform to match existing Bouquet interface
      const formattedBouquets = data.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image_urls[0] || '',
        description: product.description || '',
        category: product.category || '',
        displayCategory: product.display_category || '',
        featured: product.featured,
      }));
      
      setBouquets(formattedBouquets);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div>
        <UltraNavigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading collection...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Rest of component remains the same...
```

**Benefits:**
- Products managed through `/admin/products`
- Add unlimited products
- Filter by category automatically
- Search and tag support

---

## 3. Custom Page (Optional)

### File: `src/pages/Customize.tsx`

This integration is optional. You can:

**Option A: Keep Hardcoded Data**
- Current setup works fine
- Update manually when needed

**Option B: Fetch from Supabase**
Replace hardcoded arrays with API calls:

```typescript
import { getLuxuryBoxes, getLuxuryBoxWithDetails } from '@/lib/api/luxury-boxes';
import { getFlowerTypes, getFlowerTypeWithColors } from '@/lib/api/flowers';
import { getAccessories } from '@/lib/api/accessories';

const Customize = () => {
  const [packages, setPackages] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomData();
  }, []);

  const loadCustomData = async () => {
    try {
      const [boxesData, flowersData, accessoriesData] = await Promise.all([
        getLuxuryBoxes(),
        getFlowerTypes(),
        getAccessories(),
      ]);

      // Transform to match existing interfaces
      setPackages(boxesData.map(box => ({
        id: box.id,
        name: box.name,
        type: box.type,
        price: box.price,
        description: box.description || '',
      })));

      // For flowers, fetch colors too
      const flowersWithColors = await Promise.all(
        flowersData.map(async (flower) => {
          const details = await getFlowerTypeWithColors(flower.id);
          return {
            id: flower.id,
            name: flower.name,
            price: flower.price_per_stem,
            image: flower.image_url || '',
            colors: details?.colors.map(c => ({
              id: c.id,
              name: c.name,
              value: c.color_value,
            })) || [],
          };
        })
      );
      setFlowers(flowersWithColors);

      setAccessories(accessoriesData.map(acc => ({
        id: acc.id,
        name: acc.name,
        price: acc.price,
        description: acc.description || '',
        icon: null, // You'll need to map this
      })));
    } catch (error) {
      console.error('Error loading custom data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
```

---

## Implementation Checklist

### Phase 1: Signature Collection (Home Page)
- [ ] Update `UltraFeaturedBouquets.tsx` to use `getActiveSignatureCollections()`
- [ ] Add loading state
- [ ] Test on home page

### Phase 2: Collection Page
- [ ] Update `Collection.tsx` to use `getCollectionProducts()`
- [ ] Add loading state  
- [ ] Test filtering by category
- [ ] Verify product cards display correctly

### Phase 3: Custom Page (Optional)
- [ ] Update `Customize.tsx` to use luxury-boxes API
- [ ] Update to use flowers API
- [ ] Update to use accessories API
- [ ] Test the entire custom bouquet flow

---

## Testing Strategy

### Test Each Integration:

1. **Signature Collection**
   - Add 3-5 products via admin
   - Check they appear on home page
   - Try reordering them
   - Toggle active/inactive

2. **Collection Page**
   - Create products in different categories
   - Verify filtering works
   - Test search functionality
   - Check product details modal

3. **Custom Page** (if integrated)
   - Add flower types with colors
   - Add accessories
   - Try building a custom bouquet
   - Verify prices calculate correctly

---

## Rollback Plan

If issues occur, you can easily rollback:

```typescript
// In any file, simply comment out the Supabase code
// and uncomment the original imports

// OLD (fallback):
import { generatedBouquets } from '@/data/generatedBouquets';

// NEW (Supabase):
// import { getCollectionProducts } from '@/lib/api/collection-products';
```

---

## Performance Considerations

### React Query (Recommended)

For better caching and automatic refetching:

```typescript
import { useQuery } from '@tanstack/react-query';
import { getCollectionProducts } from '@/lib/api/collection-products';

function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => getCollectionProducts({ 
      isActive: true, 
      category: category !== 'all' ? category : undefined 
    }),
  });
}

// In component:
const { data: products, isLoading } = useProducts(selectedCategory);
```

This provides:
- Automatic caching
- Background refetching
- Loading states
- Error handling

---

## Common Patterns

### Loading State

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
```

### Error State

```typescript
if (error) {
  return (
    <div className="text-center text-red-600 py-12">
      <p>Failed to load data</p>
      <Button onClick={refetch}>Retry</Button>
    </div>
  );
}
```

### Empty State

```typescript
if (!data || data.length === 0) {
  return (
    <div className="text-center text-gray-500 py-12">
      <p>No products available</p>
    </div>
  );
}
```

---

## Next Steps

1. ✅ Setup Supabase (follow QUICK_START.md)
2. ✅ Test admin dashboard
3. ⏳ Migrate data (use migration script)
4. ⏳ Integrate frontend pages (one at a time)
5. ⏳ Test thoroughly
6. ⏳ Deploy!

---

## Tips

- **Start with Signature Collection** - Easiest to test
- **Test Each Step** - Don't integrate everything at once
- **Keep Backups** - Original data files remain as backup
- **Use React Query** - Better performance and UX
- **Monitor Supabase** - Check dashboard for query performance

---

Need help? Check the API function code in `src/lib/api/*.ts` for examples!

