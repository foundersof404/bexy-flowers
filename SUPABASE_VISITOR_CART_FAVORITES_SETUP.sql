-- ============================================
-- VISITOR CART & FAVORITES SETUP
-- ============================================
-- This SQL script creates tables for storing visitor cart and favorites
-- Each visitor gets a unique ID stored in their browser
-- Cart and favorites are synced to the database for persistence

-- ============================================
-- VISITORS TABLE
-- ============================================
-- Stores visitor information (anonymous users)
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id VARCHAR(255) UNIQUE NOT NULL, -- Unique ID stored in browser localStorage
  first_visit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_visit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups by visitor_id
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON visitors(last_visit_at);

-- ============================================
-- VISITOR CARTS TABLE
-- ============================================
-- Stores cart items for each visitor
CREATE TABLE IF NOT EXISTS visitor_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id VARCHAR(255) NOT NULL REFERENCES visitors(visitor_id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL, -- Can reference collection_products.id or be a custom product
  title VARCHAR(500) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size VARCHAR(100),
  personal_note TEXT,
  description TEXT,
  accessories JSONB, -- Array of accessory IDs or names
  gift_info JSONB, -- Object with recipient, deliveryDate, message
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_visitor_carts_visitor_id ON visitor_carts(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_carts_created_at ON visitor_carts(created_at);

-- Unique index for cart items (one cart item per visitor with same product_id, size, and personal_note combination)
-- Using expression index to handle NULL values properly
CREATE UNIQUE INDEX IF NOT EXISTS idx_visitor_carts_unique_item 
ON visitor_carts(visitor_id, product_id, COALESCE(size, ''), COALESCE(personal_note, ''));

-- ============================================
-- VISITOR FAVORITES TABLE
-- ============================================
-- Stores favorite products for each visitor
CREATE TABLE IF NOT EXISTS visitor_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id VARCHAR(255) NOT NULL REFERENCES visitors(visitor_id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL, -- Can reference collection_products.id
  title VARCHAR(500) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  category VARCHAR(255),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Unique constraint: one favorite per visitor per product
  UNIQUE(visitor_id, product_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_visitor_favorites_visitor_id ON visitor_favorites(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_favorites_product_id ON visitor_favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_visitor_favorites_created_at ON visitor_favorites(created_at);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
-- Auto-update updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to visitors table
DROP TRIGGER IF EXISTS update_visitors_updated_at ON visitors;
CREATE TRIGGER update_visitors_updated_at
  BEFORE UPDATE ON visitors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to visitor_carts table
DROP TRIGGER IF EXISTS update_visitor_carts_updated_at ON visitor_carts;
CREATE TRIGGER update_visitor_carts_updated_at
  BEFORE UPDATE ON visitor_carts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to visitor_favorites table
DROP TRIGGER IF EXISTS update_visitor_favorites_updated_at ON visitor_favorites;
CREATE TRIGGER update_visitor_favorites_updated_at
  BEFORE UPDATE ON visitor_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_favorites ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all operations for anonymous users (visitor-based)
-- In production, you may want to restrict this based on visitor_id matching

-- Visitors: Allow all operations (insert, select, update)
CREATE POLICY "Allow all operations on visitors"
  ON visitors FOR ALL
  USING (true)
  WITH CHECK (true);

-- Visitor Carts: Allow all operations (visitor can manage their own cart)
CREATE POLICY "Allow all operations on visitor_carts"
  ON visitor_carts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Visitor Favorites: Allow all operations (visitor can manage their own favorites)
CREATE POLICY "Allow all operations on visitor_favorites"
  ON visitor_favorites FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get or create visitor
CREATE OR REPLACE FUNCTION get_or_create_visitor(p_visitor_id VARCHAR(255))
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Try to get existing visitor
  SELECT id INTO v_id FROM visitors WHERE visitor_id = p_visitor_id;
  
  -- If not found, create new visitor
  IF v_id IS NULL THEN
    INSERT INTO visitors (visitor_id, first_visit_at, last_visit_at)
    VALUES (p_visitor_id, NOW(), NOW())
    RETURNING id INTO v_id;
  ELSE
    -- Update last_visit_at
    UPDATE visitors SET last_visit_at = NOW() WHERE id = v_id;
  END IF;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE visitors IS 'Stores anonymous visitor information';
COMMENT ON TABLE visitor_carts IS 'Stores cart items for each visitor';
COMMENT ON TABLE visitor_favorites IS 'Stores favorite products for each visitor';

COMMENT ON COLUMN visitor_carts.product_id IS 'Product ID (can be UUID from collection_products or custom string)';
COMMENT ON COLUMN visitor_carts.accessories IS 'JSON array of accessory IDs or names';
COMMENT ON COLUMN visitor_carts.gift_info IS 'JSON object with recipient, deliveryDate, message';
COMMENT ON COLUMN visitor_favorites.product_id IS 'Product ID (can be UUID from collection_products)';

