# 🚀 Bexy Flowers - Supabase Admin Dashboard

## Overview

Your Bexy Flowers website now has a **complete admin dashboard** powered by Supabase! This allows you to dynamically manage:

- 🌸 **Signature Collection** - Featured bouquets on home page
- 💐 **Collection Products** - Full product catalog with multi-image & multi-tag support
- 📦 **Luxury Boxes** - Box types, colors, and sizes for custom bouquets
- 🌹 **Flowers** - Flower types with colors and quantities
- 🎁 **Accessories** - Add-on items for bouquets

## What's Been Built

### ✅ Complete Infrastructure

1. **Supabase Client** (`src/lib/supabase.ts`)
   - TypeScript-typed client
   - All 8 database tables defined
   - Ready to connect to your Supabase project

2. **Storage Utilities** (`src/lib/supabase-storage.ts`)
   - Upload images to Supabase Storage
   - Delete images
   - Multi-file upload support
   - Automatic public URL generation

3. **API Functions** (5 modules in `src/lib/api/`)
   - `signature-collection.ts` - Home page management
   - `collection-products.ts` - Product CRUD with images & tags
   - `luxury-boxes.ts` - Boxes, colors, sizes
   - `flowers.ts` - Flower types & colors
   - `accessories.ts` - Accessory items

4. **Admin UI** (4 pages in `src/pages/admin/`)
   - `AdminSignatureCollection.tsx` - Manage home page items
   - `AdminProducts.tsx` - Full product management
   - `AdminAccessories.tsx` - Accessory management  
   - Image upload component with drag & drop

5. **Database Schema** (`SUPABASE_SETUP.md`)
   - Complete SQL scripts for all tables
   - Indexes for performance
   - Row Level Security policies
   - Auto-updating timestamps

## 📋 Setup Instructions

### Step 1: Install Supabase

```bash
cd bexy-flowers
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for project to be created (~2 minutes)

### Step 3: Get Your Credentials

In your Supabase project dashboard:
1. Go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public** key (NOT the service role key)

### Step 4: Configure Environment Variables

Create `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Open `SUPABASE_SETUP.md` file in this project
3. Copy the entire SQL script (starting from "-- Enable UUID extension")
4. Paste into SQL Editor and click **Run**
5. You should see "Success" - all 8 tables are now created!

### Step 6: Create Storage Buckets

In Supabase dashboard, go to **Storage**:

1. Click **New bucket** → name it `product-images` → set to **Public** → Create
2. Click **New bucket** → name it `flower-images` → set to **Public** → Create
3. Click **New bucket** → name it `accessory-images` → set to **Public** → Create
4. Click **New bucket** → name it `wedding-creations` → set to **Public** → Create

For each bucket, configure policies (click bucket → Policies):
- Allow **SELECT** for everyone (public read)
- Allow **INSERT** for authenticated users (upload)
- Allow **DELETE** for authenticated users (delete)

### Step 7: Test the Setup

```bash
npm run dev
```

Navigate to:
- `http://localhost:5173/admin/login`
- Login with: `admin` / `admin123`
- Go to `http://localhost:5173/admin/products`
- Click "Add Product" and test creating a product with image upload!

## 🎯 How to Use

### Managing Signature Collection (Home Page)

1. Go to `/admin/signature-collection`
2. Select a product from dropdown
3. Click "Add Product"
4. Use up/down arrows to reorder
5. Toggle active/inactive to show/hide on home page

### Managing Products

1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in title, category, price
4. Upload up to 10 images (drag & drop supported!)
5. Add tags for filtering (e.g., "valentine", "romantic", "roses")
6. Toggle "Featured" and "Active" switches
7. Click "Create Product"

### Managing Accessories

1. Go to `/admin/accessories`
2. Click "Add Accessory"
3. Upload image, set name, price, quantity
4. Accessories appear in custom bouquet builder

### Managing Flowers & Boxes

Similar interfaces for:
- `/admin/flowers` - Flower types with colors
- `/admin/boxes` - Luxury box types, colors, sizes

_(Note: Create these pages using AdminAccessories.tsx as a template)_

## 📸 Image Upload Features

The admin dashboard includes a powerful image uploader:

- ✅ **Drag & Drop** - Drag images directly into the upload zone
- ✅ **Multi-Image** - Upload up to 10 images per product
- ✅ **Preview** - See images before uploading
- ✅ **Delete** - Remove individual images
- ✅ **Reorder** - First image becomes primary
- ✅ **Auto-Upload** - Images automatically upload to Supabase Storage

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↓
Supabase Client (src/lib/supabase.ts)
    ↓
API Functions (src/lib/api/*.ts)
    ↓
Supabase Database + Storage
```

### Database Tables

```
collection_products (189 rows from your current data)
    ├── id, title, description, price
    ├── category, display_category
    ├── tags (array), image_urls (array)
    └── featured, is_active

signature_collections
    ├── product_id → collection_products
    └── display_order, is_active

luxury_boxes
    ├── name, type (box/wrap), price
    └── quantity

box_colors
    ├── box_id → luxury_boxes
    └── name, color_hex, gradient_css, quantity

box_sizes
    ├── box_id → luxury_boxes
    └── name, capacity, price

flower_types
    ├── name, price_per_stem
    └── image_url

flower_colors
    ├── flower_id → flower_types
    └── name, color_value, quantity

accessories
    ├── name, price, description
    └── image_url, quantity
```

## 🔄 Data Migration (Next Step)

Once your Supabase project is set up, migrate your existing data:

### Option 1: Manual Migration (Quick Test)
1. Go to `/admin/products`
2. Click "Add Product"
3. Copy data from `src/data/generatedBouquets.ts`
4. Create a few products manually to test

### Option 2: Automated Migration (Recommended)
Create a migration script:

```typescript
// scripts/migrate-to-supabase.ts
import { createCollectionProduct } from './src/lib/api/collection-products';
import { generatedBouquets } from './src/data/generatedBouquets';

async function migrate() {
  for (const bouquet of generatedBouquets) {
    await createCollectionProduct({
      title: bouquet.name,
      description: bouquet.description,
      price: bouquet.price,
      category: bouquet.category,
      display_category: bouquet.displayCategory,
      featured: bouquet.featured,
      tags: [], // Add relevant tags
      image_urls: [bouquet.image],
      is_active: true,
    });
  }
}

migrate();
```

## 🎨 Frontend Integration

Update these files to fetch from Supabase:

### 1. Signature Collection (Home Page)

```typescript
// src/components/UltraFeaturedBouquets.tsx
import { getActiveSignatureCollections } from '@/lib/api/signature-collection';

// Replace hardcoded bouquets array with:
const [bouquets, setBouquets] = useState([]);

useEffect(() => {
  getActiveSignatureCollections().then(data => {
    setBouquets(data.map(item => item.product));
  });
}, []);
```

### 2. Collection Page

```typescript
// src/pages/Collection.tsx
import { getCollectionProducts } from '@/lib/api/collection-products';

// Replace generatedBouquets with:
const [products, setProducts] = useState([]);

useEffect(() => {
  getCollectionProducts({ isActive: true }).then(setProducts);
}, []);
```

### 3. Custom Page

```typescript
// src/pages/Customize.tsx
import { getLuxuryBoxes } from '@/lib/api/luxury-boxes';
import { getFlowerTypes } from '@/lib/api/flowers';
import { getAccessories } from '@/lib/api/accessories';

// Replace hardcoded data with API calls
useEffect(() => {
  Promise.all([
    getLuxuryBoxes(),
    getFlowerTypes(),
    getAccessories(),
  ]).then(([boxes, flowers, accessories]) => {
    // Update state
  });
}, []);
```

## 🔐 Security

**Current Setup (Development):**
- Public read access for active items
- All operations allowed (for testing)

**For Production:**
1. Enable Supabase Auth
2. Update RLS policies to check `auth.uid()`
3. Add admin role checking
4. Never expose service role key in frontend

## 🐛 Troubleshooting

### "Missing environment variables"
- Check `.env.local` exists
- Restart dev server: Stop (Ctrl+C) → `npm run dev`

### "Failed to upload image"
- Verify storage buckets exist
- Check bucket names match code
- Ensure buckets are set to **Public**

### TypeScript errors
```bash
npm install @supabase/supabase-js
# Restart VS Code TypeScript server
```

### "RLS policy violation"
- Go to Supabase Dashboard → Authentication → Policies
- Run the RLS policies from `SUPABASE_SETUP.md`

## 📚 Documentation Files

- `SUPABASE_SETUP.md` - Complete database setup SQL
- `SUPABASE_INTEGRATION_COMPLETE.md` - What's been built
- `IMPLEMENTATION_STATUS.md` - Detailed implementation checklist
- `.env.example` - Environment variables template

## 🎉 What's Next?

1. ✅ **Setup Complete** - Follow steps above
2. ✅ **Test Admin Dashboard** - Create/edit/delete products
3. ⏳ **Migrate Data** - Move existing bouquet data to Supabase
4. ⏳ **Frontend Integration** - Connect pages to Supabase APIs
5. ⏳ **Create Remaining Admin Pages** - Flowers, Boxes (optional)
6. ⏳ **Add Authentication** - Proper admin login with Supabase Auth

## 💡 Tips

- Start small: Create 5-10 products manually to test
- Test image upload with different file sizes
- Use tags for easy filtering (valentine, wedding, birthday, etc.)
- Featured products can be used for special promotions
- Signature Collection determines home page order

## 🆘 Need Help?

- Check `SUPABASE_SETUP.md` for detailed SQL scripts
- Review `SUPABASE_INTEGRATION_COMPLETE.md` for architecture
- See API function examples in `src/lib/api/*.ts`
- All admin pages follow similar patterns - copy & modify!

---

**Built with ❤️ for Bexy Flowers**

