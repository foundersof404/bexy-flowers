# Admin System Documentation

## Overview
The Bexy Flowers admin system provides a complete interface for managing all aspects of the e-commerce platform including products, signature collection, customization options, and wedding creations.

## Fixed Issues (Latest Session)

### 1. **Price Field Safety**
- **Issue**: Products with undefined/null prices caused crashes when calling `.toFixed()`
- **Fix**: Added `(product.price || 0).toFixed(2)` safety checks across all admin pages
- **Files Modified**:
  - `AdminProducts.tsx` - Lines 524, 625, 680, 846
  - `AdminSignatureCollection.tsx` - Line 443

### 2. **useSignatureCollection Hook**
- **Issue**: Referenced undefined `getSignatureItem` function
- **Fix**: Removed unused prefetch logic that referenced the undefined function
- **File Modified**: `useSignatureCollection.ts`

### 3. **AdminProducts Stock Toggle**
- **Issue**: `handleQuickToggleStock` called `updateCollectionProduct` directly (not a function) and referenced undefined `loadData()`
- **Fix**: Changed to use `updateProductMutation.mutateAsync()` which properly handles the mutation and cache invalidation
- **File Modified**: `AdminProducts.tsx` - Lines 298-315

### 4. **Tag Management**
- **Issue**: Referenced undefined `setAllTags` state setter
- **Fix**: Removed the unnecessary `setAllTags` call since tags are fetched from the database
- **File Modified**: `AdminProducts.tsx` - Line 254

## Admin Pages

### 1. Admin Login (`/admin/login`)
**File**: `src/pages/admin/AdminLogin.tsx`

**Credentials**:
- Username: `admin`
- Password: `admin123`

**Features**:
- Simple authentication with localStorage
- Stores `adminAuthenticated` and `adminUsername`
- Redirects to `/admin/dashboard` on success

### 2. Admin Dashboard (`/admin/dashboard`)
**File**: `src/pages/admin/AdminDashboard.tsx`

**Features**:
- Overview statistics
- Quick access cards to all management sections
- Recent activity preview

**Management Sections**:
- Products
- Signature Collection
- Luxury Boxes
- Flowers
- Accessories
- Wedding Creations

### 3. Products Management (`/admin/products`)
**File**: `src/pages/admin/AdminProducts.tsx`

**Routes**:
- `/admin/products` - List all products
- `/admin/products/new` - Create new product
- `/admin/products/:id` - Edit existing product

**CRUD Operations**:
- ✅ **Create**: Uses `useCreateCollectionProduct()` hook
  - Uploads images to Supabase Storage
  - Creates product record with form data
  - Invalidates cache to show new product

- ✅ **Read**: Uses `useCollectionProducts()` and `useCollectionProduct(id)` hooks
  - Fetches all products with filters
  - Caches data for 5 minutes
  - Prefetches first 5 products for performance

- ✅ **Update**: Uses `useUpdateCollectionProduct()` hook
  - Updates product fields
  - Handles new image uploads
  - Deletes specified images from storage
  - Updates cache optimistically

- ✅ **Delete**: Uses `useDeleteCollectionProduct()` hook
  - Deletes all associated images from storage
  - Removes product record
  - Removes from cache

**Features**:
- Search and filter products
- Category and status filters
- Quick stock toggle
- Out of stock alerts section
- Recent products section
- Signature collection preview
- Image upload with drag & drop
- Tag management
- Discount percentage support
- Active/inactive status toggle
- Featured product flag
- Migration tool to import existing products

**Data Fields**:
```typescript
{
  title: string
  description: string
  price: number
  category: string
  display_category: string
  featured: boolean
  tags: string[]
  image_urls: string[]
  is_active: boolean
  is_out_of_stock: boolean
  discount_percentage: number | null
}
```

### 4. Signature Collection (`/admin/signature-collection`)
**File**: `src/pages/admin/AdminSignatureCollection.tsx`

**Purpose**: Manage the 6 featured products displayed on the homepage

**CRUD Operations**:
- ✅ **Add Product**: `useAddToSignatureCollection()`
  - Adds existing product to signature collection
  - Auto-assigns display order
  
- ✅ **Update Item**: `useUpdateSignatureCollection()`
  - Customizes display information (title, description, price)
  - Adds custom images (or uses product images)
  - Sets discount percentage
  - Marks as best selling
  - Updates stock status
  - Manages tags

- ✅ **Reorder**: `reorderSignatureCollections()`
  - Move products up/down
  - Changes display order on homepage

- ✅ **Remove**: `useRemoveFromSignatureCollection()`
  - Removes from signature collection (doesn't delete product)

- ✅ **Swap Product**: Updates `product_id` to change which product is featured

**Features**:
- Drag to reorder (using arrow buttons)
- Custom overrides for each field
- Visual position badges (#1, #2, etc.)
- Best selling badge
- Out of stock management
- Discount display
- Tag management
- Custom image uploads
- Migration tool

**Data Structure**:
```typescript
{
  id: string
  product_id: string
  display_order: number
  is_active: boolean
  custom_title: string | null
  custom_description: string | null
  custom_price: number | null
  discount_percentage: number | null
  is_out_of_stock: boolean
  is_best_selling: boolean
  tags: string[]
  custom_image_urls: string[]
}
```

### 5. Accessories Management (`/admin/accessories`)
**File**: `src/pages/admin/AdminAccessories.tsx`

### 6. Flowers Management (`/admin/flowers`)
**File**: `src/pages/admin/AdminFlowers.tsx`

### 7. Luxury Boxes Management (`/admin/boxes`)
**File**: `src/pages/admin/AdminLuxuryBoxes.tsx`

### 8. Wedding Creations (`/admin/wedding-creations`)
**File**: `src/pages/admin/AdminWeddingCreations.tsx`

## API Layer

### Collection Products API
**File**: `src/lib/api/collection-products.ts`

**Functions**:
- `getCollectionProducts(filters?)` - Fetch all products with optional filters
- `getCollectionProduct(id)` - Fetch single product
- `createCollectionProduct(product, images?)` - Create new product
- `updateCollectionProduct(id, updates, newImages?, imagesToDelete?)` - Update product
- `deleteCollectionProduct(id)` - Delete product and images
- `addTagsToProduct(id, tags)` - Add tags to product
- `removeTagsFromProduct(id, tagsToRemove)` - Remove tags
- `getAllTags()` - Get all unique tags

### Signature Collection API
**File**: `src/lib/api/signature-collection.ts`

**Functions**:
- `getSignatureCollections()` - Fetch all signature items with product details
- `getActiveSignatureCollections()` - Fetch only active items for frontend
- `addToSignatureCollection(productId, displayOrder?)` - Add product
- `removeFromSignatureCollection(id)` - Remove item
- `updateSignatureCollection(id, updates)` - Update item
- `reorderSignatureCollections(items)` - Reorder multiple items
- `toggleSignatureCollectionActive(id, isActive)` - Toggle active status

## React Query Hooks

### Collection Products Hooks
**File**: `src/hooks/useCollectionProducts.ts`

**Available Hooks**:
- `useCollectionProducts(filters?)` - Query all products
- `useCollectionProduct(id)` - Query single product
- `useCollectionTags()` - Query all tags
- `useCreateCollectionProduct()` - Mutation to create
- `useUpdateCollectionProduct()` - Mutation to update
- `useDeleteCollectionProduct()` - Mutation to delete
- `useAddTagsToProduct()` - Mutation to add tags
- `useRemoveTagsFromProduct()` - Mutation to remove tags

**Cache Management**:
- Stale time: 5 minutes
- GC time: 10 minutes
- Auto-invalidates on mutations
- Prefetches first 5 products

### Signature Collection Hooks
**File**: `src/hooks/useSignatureCollection.ts`

**Available Hooks**:
- `useSignatureCollection(filters?)` - Query signature items
- `useAddToSignatureCollection()` - Mutation to add
- `useRemoveFromSignatureCollection()` - Mutation to remove
- `useUpdateSignatureCollection()` - Mutation to update

## Image Management

### Image Upload Component
**File**: `src/components/admin/ImageUpload.tsx`

**Features**:
- Drag & drop support
- Multiple image upload
- Image preview
- Remove individual images
- Primary image indicator
- Max image limit (default: 10)
- Blob URL management for previews

### Supabase Storage
**File**: `src/lib/supabase-storage.ts`

**Functions**:
- `uploadImage(bucket, file, folder?)` - Upload single image, auto-converts to WebP
- `uploadMultipleImages(bucket, files, folder?)` - Upload multiple images
- `deleteImage(bucket, path)` - Delete image
- `extractPathFromUrl(url, bucket)` - Extract path from URL

**Buckets**:
- `product-images` - Product and signature collection images
- `flower-images` - Flower type images
- `accessory-images` - Accessory images
- `wedding-creations` - Wedding gallery images

## Database Schema (Supabase)

### collection_products table
```sql
{
  id: uuid (PK)
  title: text
  description: text
  price: numeric
  category: text
  display_category: text
  featured: boolean
  tags: text[]
  image_urls: text[]
  is_active: boolean
  is_out_of_stock: boolean
  discount_percentage: numeric
  created_at: timestamp
  updated_at: timestamp
}
```

### signature_collections table
```sql
{
  id: uuid (PK)
  product_id: uuid (FK -> collection_products)
  display_order: integer
  is_active: boolean
  custom_title: text
  custom_description: text
  custom_price: numeric
  discount_percentage: numeric
  is_out_of_stock: boolean
  is_best_selling: boolean
  tags: text[]
  custom_image_urls: text[]
  created_at: timestamp
  updated_at: timestamp
}
```

## Testing Checklist

### Products CRUD
- [ ] Create new product with images
- [ ] Edit existing product
- [ ] Update product images (add/remove)
- [ ] Delete product (verify images deleted)
- [ ] Toggle stock status
- [ ] Add/remove tags
- [ ] Set discount percentage
- [ ] Toggle active/inactive status
- [ ] Toggle featured status
- [ ] Search and filter products

### Signature Collection
- [ ] Add product to signature collection
- [ ] Edit signature item (custom fields)
- [ ] Upload custom images
- [ ] Reorder items (up/down)
- [ ] Swap products
- [ ] Remove from signature collection
- [ ] Toggle best selling badge
- [ ] Set discount on signature item
- [ ] Verify changes appear on homepage

### General
- [ ] Login with credentials
- [ ] Navigation between admin pages
- [ ] Image upload (drag & drop)
- [ ] Image preview and removal
- [ ] Migration tools work
- [ ] Error handling and toast notifications
- [ ] Cache invalidation after mutations
- [ ] Responsive design on mobile

## Common Issues & Solutions

### 1. Images not loading
**Cause**: Supabase storage bucket may not be public
**Solution**: Ensure bucket has public access enabled in Supabase dashboard

### 2. Products not updating
**Cause**: Cache not invalidating properly
**Solution**: Check mutation hooks are calling `invalidateQueries` correctly

### 3. Price errors
**Cause**: Undefined price values
**Solution**: Always use `(product.price || 0).toFixed(2)` for safety

### 4. Migration errors
**Cause**: Missing or invalid product data
**Solution**: Check source data format matches expected schema

### 5. Authentication redirect loop
**Cause**: localStorage not set correctly
**Solution**: Clear localStorage and login again

## Environment Variables Required

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Future Enhancements

1. **Bulk Operations**
   - Bulk delete products
   - Bulk update (price, stock status)
   - Bulk image upload

2. **Analytics**
   - Product view tracking
   - Popular products dashboard
   - Stock alerts

3. **Advanced Filtering**
   - Date range filters
   - Price range filters
   - Multi-tag filters

4. **Image Optimization**
   - Automatic image resizing
   - Multiple size variants
   - Lazy loading

5. **Better Authentication**
   - Supabase Auth integration
   - Role-based access control
   - Session management

6. **Audit Log**
   - Track all changes
   - User activity log
   - Rollback capability

---

Last Updated: December 31, 2025


