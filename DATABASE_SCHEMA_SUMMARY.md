# Supabase Database Schema Summary

## Overview
This document provides a comprehensive overview of the Supabase database structure, with a focus on collection-related tables.

---

## Collection-Related Tables

### 1. `collection_products` (Main Collection Table)
**Purpose**: Stores all products/items in the collection

**Schema**:
```typescript
{
  id: string (UUID, Primary Key)
  title: string
  description: string | null
  price: number
  category: string | null              // Internal category ID (e.g., "red-roses", "valentine")
  display_category: string | null      // Display name (e.g., "Red Roses", "Valentine's Atelier")
  featured: boolean                    // Whether product is featured
  tags: string[]                       // Array of tags for filtering/search
  image_urls: string[]                 // Array of image URLs
  is_active: boolean                  // Whether product is active/visible
  created_at: string (timestamp)
  updated_at: string (timestamp)
}
```

**Key Functions** (in `src/lib/api/collection-products.ts`):
- `getCollectionProducts(filters?)` - Get all products with optional filters
- `getCollectionProduct(id)` - Get single product by ID
- `createCollectionProduct(product, images?)` - Create new product
- `updateCollectionProduct(id, updates, newImages?, imagesToDelete?)` - Update product
- `deleteCollectionProduct(id)` - Delete product
- `addTagsToProduct(id, tags)` - Add tags to product
- `removeTagsFromProduct(id, tags)` - Remove tags from product
- `getAllTags()` - Get all unique tags across products

---

### 2. `signature_collections` (Featured Collections)
**Purpose**: Manages which products are in the signature/featured collection

**Schema**:
```typescript
{
  id: string (UUID, Primary Key)
  product_id: string                  // References collection_products.id
  display_order: number               // Order for display
  is_active: boolean                 // Whether item is active in signature collection
  created_at: string (timestamp)
  updated_at: string (timestamp)
}
```

**Key Functions** (in `src/lib/api/signature-collection.ts`):
- `getSignatureCollection()` - Get all signature collection items
- `addToSignatureCollection(productId, displayOrder)` - Add product to signature collection
- `removeFromSignatureCollection(productId)` - Remove product from signature collection
- `updateDisplayOrder(productId, newOrder)` - Update display order

---

## Current Collection Categories

Based on `src/data/generatedBouquets.ts`, the following categories exist:

| Category ID | Display Name | Count |
|------------|--------------|-------|
| `birthday` | Birthday Signatures | 1 |
| `butterfly` | Butterfly Garden | 1 |
| `gender` | Gender Reveal | 4 |
| `graduation` | Graduation Honors | 12 |
| `hand band` | Luxury Handbands | 8 |
| `heart shape` | Heart Silhouettes | 6 |
| `mother day` | Mother's Day | 5 |
| `pink` | Pink Reverie | 8 |
| `red-roses` | Red Roses | 10 |
| `valentine` | Valentine's Atelier | 22 |
| `wedding-percent-events` | Wedding & Events | 9 |

**Total**: ~86 products across 11 categories

---

## Other Database Tables

### 3. `luxury_boxes`
Stores luxury box/wrap products for customization
- `id`, `name`, `type` ('box' | 'wrap'), `price`, `description`, `quantity`, `is_active`

### 4. `box_colors`
Stores available colors for boxes
- `id`, `box_id` (FK to luxury_boxes), `name`, `color_hex`, `gradient_css`, `quantity`, `is_active`

### 5. `box_sizes`
Stores available sizes for boxes
- `id`, `box_id` (FK to luxury_boxes), `name`, `capacity`, `price`, `description`, `is_active`

### 6. `flower_types`
Stores flower types
- `id`, `name`, `title`, `price_per_stem`, `image_url`, `quantity`, `is_active`

### 7. `flower_colors`
Stores colors for each flower type
- `id`, `flower_id` (FK to flower_types), `name`, `color_value`, `quantity`

### 8. `accessories`
Stores accessory products
- `id`, `name`, `price`, `description`, `image_url`, `quantity`, `is_active`

### 9. `wedding_creations`
Stores wedding creation images
- `id`, `image_url`, `display_order`, `is_active`

### 10. `visitors`
Stores visitor information (anonymous users)
- `id`, `visitor_id` (unique browser ID), `first_visit_at`, `last_visit_at`, `user_agent`

### 11. `visitor_carts`
Stores cart items for visitors
- `id`, `visitor_id` (FK to visitors), `product_id`, `title`, `price`, `image`, `quantity`, `size`, `personal_note`, `description`, `accessories` (JSONB), `gift_info` (JSONB)

### 12. `visitor_favorites`
Stores favorite items for visitors
- `id`, `visitor_id` (FK to visitors), `product_id`, `product_type`, `created_at`

---

## Collection Usage in Code

### Main Collection Page
- **File**: `src/pages/Collection.tsx`
- **Fetches**: Products from `collection_products` table
- **Filters**: By `category` field
- **Displays**: Products in grid format with category navigation

### Category Navigation
- **File**: `src/components/collection/CategoryNavigation.tsx`
- **Uses**: Categories from `generatedCategories` array
- **Filters**: Products by `category` field

### Product API
- **File**: `src/lib/api/collection-products.ts`
- **Provides**: CRUD operations for collection products
- **Storage**: Images stored in Supabase Storage bucket `product-images`

---

## Key Relationships

1. **collection_products** ↔ **signature_collections**
   - One-to-many: One product can be in signature collection
   - Linked via `product_id` field

2. **collection_products** ↔ **visitor_carts**
   - Many-to-many: Products can be in multiple carts
   - Linked via `product_id` field

3. **collection_products** ↔ **visitor_favorites**
   - Many-to-many: Products can be favorited by multiple visitors
   - Linked via `product_id` field

---

## Notes for Adding New Functions

When adding new functions related to collections:

1. **Category Management**: Categories are currently hardcoded in `generatedCategories`. Consider creating a `categories` table if you need dynamic category management.

2. **Product Filtering**: Current filtering uses:
   - `category` field for category-based filtering
   - `tags` array for tag-based filtering
   - `featured` boolean for featured products
   - `is_active` boolean for active products

3. **Image Storage**: All product images are stored in Supabase Storage bucket `product-images` and URLs are stored in `image_urls` array.

4. **Display Order**: Signature collection uses `display_order` field. Consider adding this to `collection_products` if you need custom ordering for all products.

---

## Environment Variables Required

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## SQL Setup Files

- `SUPABASE_VISITOR_CART_FAVORITES_SETUP.sql` - Sets up visitor cart and favorites tables
- `MIGRATE_EXISTING_WEDDING_PHOTOS.sql` - Migration script for wedding photos

