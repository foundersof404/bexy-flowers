-- ============================================
-- ADD ENHANCED FIELDS TO SIGNATURE COLLECTION
-- ============================================
-- This SQL script adds custom fields, discounts, stock status, and tags to signature_collections table
-- Run this in your Supabase SQL Editor

-- Add custom title (override product title)
ALTER TABLE signature_collections 
ADD COLUMN IF NOT EXISTS custom_title TEXT DEFAULT NULL;

-- Add custom description (override product description)
ALTER TABLE signature_collections 
ADD COLUMN IF NOT EXISTS custom_description TEXT DEFAULT NULL;

-- Add custom price (override product price)
ALTER TABLE signature_collections 
ADD COLUMN IF NOT EXISTS custom_price DECIMAL(10, 2) DEFAULT NULL;

-- Add discount percentage
ALTER TABLE signature_collections 
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5, 2) DEFAULT NULL;

-- Add out of stock flag
ALTER TABLE signature_collections 
ADD COLUMN IF NOT EXISTS is_out_of_stock BOOLEAN DEFAULT FALSE;

-- Add best selling flag
ALTER TABLE signature_collections 
ADD COLUMN IF NOT EXISTS is_best_selling BOOLEAN DEFAULT FALSE;

-- Add tags array
ALTER TABLE signature_collections 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add custom image URLs (override product images)
ALTER TABLE signature_collections 
ADD COLUMN IF NOT EXISTS custom_image_urls TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add check constraint to ensure discount is between 0 and 100
ALTER TABLE signature_collections
ADD CONSTRAINT check_signature_discount_percentage 
CHECK (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100));

-- Create index for faster filtering by best selling
CREATE INDEX IF NOT EXISTS idx_signature_collections_best_selling 
ON signature_collections(is_best_selling) 
WHERE is_best_selling = TRUE;

-- Create index for faster filtering by stock status
CREATE INDEX IF NOT EXISTS idx_signature_collections_out_of_stock 
ON signature_collections(is_out_of_stock) 
WHERE is_out_of_stock = TRUE;

-- Add comments to columns
COMMENT ON COLUMN signature_collections.custom_title IS 'Custom title to override product title';
COMMENT ON COLUMN signature_collections.custom_description IS 'Custom description to override product description';
COMMENT ON COLUMN signature_collections.custom_price IS 'Custom price to override product price';
COMMENT ON COLUMN signature_collections.discount_percentage IS 'Discount percentage (0-100). NULL means no discount.';
COMMENT ON COLUMN signature_collections.is_out_of_stock IS 'Whether the signature collection item is out of stock';
COMMENT ON COLUMN signature_collections.is_best_selling IS 'Whether this is a best selling item';
COMMENT ON COLUMN signature_collections.tags IS 'Array of tags for filtering and categorization';
COMMENT ON COLUMN signature_collections.custom_image_urls IS 'Custom image URLs to override product images';

