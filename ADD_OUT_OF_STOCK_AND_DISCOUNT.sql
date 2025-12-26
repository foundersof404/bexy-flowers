-- ============================================
-- ADD OUT OF STOCK AND DISCOUNT FUNCTIONALITY
-- ============================================
-- This SQL script adds out of stock and discount fields to collection_products table
-- Run this in your Supabase SQL Editor

-- Add is_out_of_stock column
ALTER TABLE collection_products 
ADD COLUMN IF NOT EXISTS is_out_of_stock BOOLEAN DEFAULT FALSE;

-- Add discount_percentage column
ALTER TABLE collection_products 
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5, 2) DEFAULT NULL;

-- Add check constraint to ensure discount is between 0 and 100
ALTER TABLE collection_products
ADD CONSTRAINT check_discount_percentage 
CHECK (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100));

-- Create index for faster filtering by stock status
CREATE INDEX IF NOT EXISTS idx_collection_products_out_of_stock 
ON collection_products(is_out_of_stock) 
WHERE is_out_of_stock = TRUE;

-- Create index for faster filtering by discount
CREATE INDEX IF NOT EXISTS idx_collection_products_discount 
ON collection_products(discount_percentage) 
WHERE discount_percentage IS NOT NULL AND discount_percentage > 0;

-- Add comment to columns
COMMENT ON COLUMN collection_products.is_out_of_stock IS 'Whether the product is out of stock';
COMMENT ON COLUMN collection_products.discount_percentage IS 'Discount percentage (0-100). NULL means no discount.';

