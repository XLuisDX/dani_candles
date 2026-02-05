-- Migration: Add product_type column to products table
-- Run this in your Supabase SQL Editor

-- Add product_type column with default value 'aromatic'
ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_type VARCHAR(20) DEFAULT 'aromatic';

-- Add constraint to ensure only valid values
ALTER TABLE products
ADD CONSTRAINT products_product_type_check
CHECK (product_type IN ('aromatic', 'decorative'));

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);

-- Optional: Update existing products (uncomment and modify as needed)
-- UPDATE products SET product_type = 'aromatic' WHERE product_type IS NULL;
