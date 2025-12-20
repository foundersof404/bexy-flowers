# Supabase Database Setup Guide

This guide will help you set up your Supabase database with all the required tables, indexes, and security policies for the Bexy Flowers admin dashboard.

---

## Step 1: Create Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name:** `bexy-flowers` (or your choice)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
5. Click **"Create Project"** and wait ~2 minutes

---

## Step 2: Get Your Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon public** key (starts with `eyJhbG...`)

---

## Step 3: Create Environment Variables

Create a file named `.env.local` in your project root (`bexy-flowers/.env.local`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

---

## Step 4: Run SQL Script

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire SQL script below
4. Paste into the SQL Editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned" ✅

---

## Complete SQL Setup Script

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- COLLECTION PRODUCTS TABLE (must be created first)
-- ============================================
CREATE TABLE IF NOT EXISTS collection_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  display_category VARCHAR(100),
  featured BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collection_products_category ON collection_products(category);
CREATE INDEX IF NOT EXISTS idx_collection_products_featured ON collection_products(featured);
CREATE INDEX IF NOT EXISTS idx_collection_products_is_active ON collection_products(is_active);
CREATE INDEX IF NOT EXISTS idx_collection_products_tags ON collection_products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_collection_products_title ON collection_products(title);

-- ============================================
-- SIGNATURE COLLECTIONS TABLE (references collection_products)
-- ============================================
CREATE TABLE IF NOT EXISTS signature_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES collection_products(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id)
);

CREATE INDEX IF NOT EXISTS idx_signature_collections_product_id ON signature_collections(product_id);
CREATE INDEX IF NOT EXISTS idx_signature_collections_display_order ON signature_collections(display_order);
CREATE INDEX IF NOT EXISTS idx_signature_collections_is_active ON signature_collections(is_active);

-- ============================================
-- LUXURY BOXES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS luxury_boxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('box', 'wrap')),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_luxury_boxes_type ON luxury_boxes(type);
CREATE INDEX IF NOT EXISTS idx_luxury_boxes_is_active ON luxury_boxes(is_active);

-- ============================================
-- BOX COLORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS box_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  box_id UUID NOT NULL REFERENCES luxury_boxes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color_hex VARCHAR(7),
  gradient_css TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_box_colors_box_id ON box_colors(box_id);

-- ============================================
-- BOX SIZES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS box_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  box_id UUID NOT NULL REFERENCES luxury_boxes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comment for capacity column (PostgreSQL syntax)
COMMENT ON COLUMN box_sizes.capacity IS 'Maximum number of flowers';

CREATE INDEX IF NOT EXISTS idx_box_sizes_box_id ON box_sizes(box_id);

-- ============================================
-- FLOWER TYPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS flower_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price_per_stem DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flower_types_is_active ON flower_types(is_active);

-- ============================================
-- FLOWER COLORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS flower_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flower_id UUID NOT NULL REFERENCES flower_types(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color_value VARCHAR(50),
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flower_colors_flower_id ON flower_colors(flower_id);

-- ============================================
-- ACCESSORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS accessories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accessories_is_active ON accessories(is_active);

-- ============================================
-- UPDATE TIMESTAMP FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ============================================
-- Drop triggers if they exist (to allow re-running script)
DROP TRIGGER IF EXISTS update_signature_collections_updated_at ON signature_collections;
DROP TRIGGER IF EXISTS update_collection_products_updated_at ON collection_products;
DROP TRIGGER IF EXISTS update_luxury_boxes_updated_at ON luxury_boxes;
DROP TRIGGER IF EXISTS update_box_colors_updated_at ON box_colors;
DROP TRIGGER IF EXISTS update_box_sizes_updated_at ON box_sizes;
DROP TRIGGER IF EXISTS update_flower_types_updated_at ON flower_types;
DROP TRIGGER IF EXISTS update_flower_colors_updated_at ON flower_colors;
DROP TRIGGER IF EXISTS update_accessories_updated_at ON accessories;

-- Create triggers
CREATE TRIGGER update_signature_collections_updated_at BEFORE UPDATE ON signature_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collection_products_updated_at BEFORE UPDATE ON collection_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_luxury_boxes_updated_at BEFORE UPDATE ON luxury_boxes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_box_colors_updated_at BEFORE UPDATE ON box_colors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_box_sizes_updated_at BEFORE UPDATE ON box_sizes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flower_types_updated_at BEFORE UPDATE ON flower_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flower_colors_updated_at BEFORE UPDATE ON flower_colors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accessories_updated_at BEFORE UPDATE ON accessories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Drop existing policies if they exist (to allow re-running script)
DROP POLICY IF EXISTS "Public can read active signature collections" ON signature_collections;
DROP POLICY IF EXISTS "Public can read active collection products" ON collection_products;
DROP POLICY IF EXISTS "Public can read active luxury boxes" ON luxury_boxes;
DROP POLICY IF EXISTS "Public can read box colors" ON box_colors;
DROP POLICY IF EXISTS "Public can read box sizes" ON box_sizes;
DROP POLICY IF EXISTS "Public can read active flower types" ON flower_types;
DROP POLICY IF EXISTS "Public can read flower colors" ON flower_colors;
DROP POLICY IF EXISTS "Public can read active accessories" ON accessories;
DROP POLICY IF EXISTS "Allow all operations on signature_collections" ON signature_collections;
DROP POLICY IF EXISTS "Allow all operations on collection_products" ON collection_products;
DROP POLICY IF EXISTS "Allow all operations on luxury_boxes" ON luxury_boxes;
DROP POLICY IF EXISTS "Allow all operations on box_colors" ON box_colors;
DROP POLICY IF EXISTS "Allow all operations on box_sizes" ON box_sizes;
DROP POLICY IF EXISTS "Allow all operations on flower_types" ON flower_types;
DROP POLICY IF EXISTS "Allow all operations on flower_colors" ON flower_colors;
DROP POLICY IF EXISTS "Allow all operations on accessories" ON accessories;

-- Enable RLS on all tables
ALTER TABLE signature_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE luxury_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE box_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE box_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flower_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE flower_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES (for active items)
-- ============================================

-- Signature Collections: Public can read active items
CREATE POLICY "Public can read active signature collections"
  ON signature_collections FOR SELECT
  USING (is_active = true);

-- Collection Products: Public can read active products
CREATE POLICY "Public can read active collection products"
  ON collection_products FOR SELECT
  USING (is_active = true);

-- Luxury Boxes: Public can read active boxes
CREATE POLICY "Public can read active luxury boxes"
  ON luxury_boxes FOR SELECT
  USING (is_active = true);

-- Box Colors: Public can read all (linked to boxes)
CREATE POLICY "Public can read box colors"
  ON box_colors FOR SELECT
  USING (true);

-- Box Sizes: Public can read all (linked to boxes)
CREATE POLICY "Public can read box sizes"
  ON box_sizes FOR SELECT
  USING (true);

-- Flower Types: Public can read active types
CREATE POLICY "Public can read active flower types"
  ON flower_types FOR SELECT
  USING (is_active = true);

-- Flower Colors: Public can read all (linked to flowers)
CREATE POLICY "Public can read flower colors"
  ON flower_colors FOR SELECT
  USING (true);

-- Accessories: Public can read active accessories
CREATE POLICY "Public can read active accessories"
  ON accessories FOR SELECT
  USING (is_active = true);

-- ============================================
-- ADMIN POLICIES (for development - allows all operations)
-- ============================================
-- NOTE: For production, replace these with proper auth checks
-- Example: USING (auth.uid() IS NOT NULL AND auth.uid() IN (SELECT user_id FROM admin_users))

-- Signature Collections: Allow all operations (for admin)
CREATE POLICY "Allow all operations on signature_collections"
  ON signature_collections FOR ALL
  USING (true)
  WITH CHECK (true);

-- Collection Products: Allow all operations (for admin)
CREATE POLICY "Allow all operations on collection_products"
  ON collection_products FOR ALL
  USING (true)
  WITH CHECK (true);

-- Luxury Boxes: Allow all operations (for admin)
CREATE POLICY "Allow all operations on luxury_boxes"
  ON luxury_boxes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Box Colors: Allow all operations (for admin)
CREATE POLICY "Allow all operations on box_colors"
  ON box_colors FOR ALL
  USING (true)
  WITH CHECK (true);

-- Box Sizes: Allow all operations (for admin)
CREATE POLICY "Allow all operations on box_sizes"
  ON box_sizes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Flower Types: Allow all operations (for admin)
CREATE POLICY "Allow all operations on flower_types"
  ON flower_types FOR ALL
  USING (true)
  WITH CHECK (true);

-- Flower Colors: Allow all operations (for admin)
CREATE POLICY "Allow all operations on flower_colors"
  ON flower_colors FOR ALL
  USING (true)
  WITH CHECK (true);

-- Accessories: Allow all operations (for admin)
CREATE POLICY "Allow all operations on accessories"
  ON accessories FOR ALL
  USING (true)
  WITH CHECK (true);
```

---

## Step 5: Create Storage Buckets

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **"New bucket"**

Create these four buckets (one at a time):

### Bucket 1: `product-images`
- **Name:** `product-images`
- **Public bucket:** ✅ Check this (important!)
- Click **"Create bucket"**

### Bucket 2: `flower-images`
- **Name:** `flower-images`
- **Public bucket:** ✅ Check this
- Click **"Create bucket"**

### Bucket 3: `accessory-images`
- **Name:** `accessory-images`
- **Public bucket:** ✅ Check this
- Click **"Create bucket"**

### Bucket 4: `wedding-creations`
- **Name:** `wedding-creations`
- **Public bucket:** ✅ Check this
- Click **"Create bucket"**

---

## Step 6: Configure Storage Policies

For each bucket you created, configure policies:

1. Click on the bucket name (e.g., `product-images`)
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Create these policies:

### Policy 1: Public Read Access
- **Policy name:** `Public can read`
- **Allowed operation:** `SELECT`
- **Policy definition:**
  ```sql
  true
  ```
- Click **"Save"**

### Policy 2: Authenticated Upload
- **Policy name:** `Authenticated can upload`
- **Allowed operation:** `INSERT`
- **Policy definition:**
  ```sql
  true
  ```
- Click **"Save"**

### Policy 3: Authenticated Delete
- **Policy name:** `Authenticated can delete`
- **Allowed operation:** `DELETE`
- **Policy definition:**
  ```sql
  true
  ```
- Click **"Save"**

**Repeat for all four buckets:** `product-images`, `flower-images`, `accessory-images`, `wedding-creations`

---

## Step 7: Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see all 8 tables listed:
   - ✅ `accessories`
   - ✅ `box_colors`
   - ✅ `box_sizes`
   - ✅ `collection_products`
   - ✅ `flower_colors`
   - ✅ `flower_types`
   - ✅ `luxury_boxes`
   - ✅ `signature_collections`

3. Go to **Storage**
4. You should see 4 buckets:
   - ✅ `product-images`
   - ✅ `flower-images`
   - ✅ `accessory-images`
   - ✅ `wedding-creations`

---

## Step 8: Test Your Setup

1. Install the Supabase package (if not already done):
   ```bash
   cd bexy-flowers
   npm install @supabase/supabase-js
   ```

2. Start your dev server:
   ```bash
   npm run dev
   ```

3. Visit: `http://localhost:5173/admin/login`
   - Username: `admin`
   - Password: `admin123`

4. Go to `/admin/products`
5. Click **"Add Product"**
6. Try creating a product with an image upload!

---

## Troubleshooting

### Error: "permission denied for table"
- **Fix:** Make sure you ran ALL the SQL policies (scroll down in the SQL script)
- The admin policies should allow all operations

### Error: "bucket does not exist"
- **Fix:** Check bucket names are exactly: `product-images`, `flower-images`, `accessory-images`, `wedding-creations`
- Make sure buckets are set to **Public**

### Error: "Failed to upload image"
- **Fix:** Check storage policies are created for each bucket
- Verify buckets exist in Storage section

### Tables not appearing
- **Fix:** Refresh the Table Editor page
- Make sure SQL script ran successfully (no errors in SQL Editor)

---

## Production Security Notes

⚠️ **Important for Production:**

The current RLS policies allow all operations for development/testing. For production:

1. **Implement Supabase Auth** for admin login
2. **Update RLS policies** to check `auth.uid()`:
   ```sql
   -- Example production policy:
   CREATE POLICY "Admin can manage products"
     ON collection_products FOR ALL
     USING (auth.uid() IS NOT NULL 
            AND auth.uid() IN (SELECT user_id FROM admin_users))
     WITH CHECK (auth.uid() IS NOT NULL 
                 AND auth.uid() IN (SELECT user_id FROM admin_users));
   ```

3. **Create admin_users table** to track authorized admin users
4. **Change default admin password** in your admin login page
5. **Never expose service role key** in frontend code

---

## Next Steps

After completing this setup:

1. ✅ Test the admin dashboard
2. ✅ Create a few test products
3. ✅ Upload test images
4. ⏭️ Migrate your existing data (see `scripts/migrate-to-supabase.mjs`)
5. ⏭️ Integrate frontend pages (see `FRONTEND_INTEGRATION_GUIDE.md`)

---

## Need Help?

- Check `QUICK_START.md` for a simpler walkthrough
- Review `README_SUPABASE.md` for architecture details
- See Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

**Setup complete! Your database is ready to use.** 🎉

