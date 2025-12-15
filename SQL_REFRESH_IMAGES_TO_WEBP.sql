-- Purpose:
-- Normalize all image URLs in the DB to .webp (for tables that store image URLs).
-- This does NOT delete files from Supabase Storage (storage deletions cannot be done via SQL).
-- Run this after you have uploaded/replaced the actual .webp files in Storage.
-- If you need to delete old JPG/PNG objects from Storage, use the prune script we added:
--   npm run prune:non-webp
--
-- Safety:
-- - Idempotent: running multiple times keeps .webp.
-- - Only swaps file extensions for known image fields.
-- - Skips URLs that don’t end with .jpg/.jpeg/.png.
--
-- How to run:
-- 1) Open Supabase SQL Editor.
-- 2) Paste everything and run.
-- 3) Verify via the SELECT checks at the bottom.

BEGIN;

-- Collection products: normalize each entry in image_urls array to .webp
UPDATE collection_products
SET image_urls = (
  SELECT array_agg(
    CASE
      WHEN lower(u) ~ '\.(jpg|jpeg|png)$' THEN regexp_replace(u, '\.(jpg|jpeg|png)$', '.webp', 'i')
      ELSE u
    END
    ORDER BY ord
  )
  FROM unnest(image_urls) WITH ORDINALITY AS t(u, ord)
)
WHERE EXISTS (
  SELECT 1
  FROM unnest(image_urls) AS u
  WHERE lower(u) ~ '\.(jpg|jpeg|png)$'
);

-- Accessories: normalize image_url to .webp
UPDATE accessories
SET image_url = regexp_replace(image_url, '\.(jpg|jpeg|png)$', '.webp', 'i')
WHERE image_url IS NOT NULL
  AND lower(image_url) ~ '\.(jpg|jpeg|png)$';

-- Flower types: normalize image_url to .webp
UPDATE flower_types
SET image_url = regexp_replace(image_url, '\.(jpg|jpeg|png)$', '.webp', 'i')
WHERE image_url IS NOT NULL
  AND lower(image_url) ~ '\.(jpg|jpeg|png)$';

-- Wedding creations: normalize image_url to .webp
UPDATE wedding_creations
SET image_url = regexp_replace(image_url, '\.(jpg|jpeg|png)$', '.webp', 'i')
WHERE image_url IS NOT NULL
  AND lower(image_url) ~ '\.(jpg|jpeg|png)$';

COMMIT;

-- Verification: these should return 0 rows if everything is now .webp
-- Collection products (any non-webp)
SELECT id, image_urls
FROM collection_products
WHERE EXISTS (
  SELECT 1 FROM unnest(image_urls) u WHERE lower(u) ~ '\.(jpg|jpeg|png)$'
);

-- Accessories (any non-webp)
SELECT id, image_url
FROM accessories
WHERE image_url IS NOT NULL AND lower(image_url) ~ '\.(jpg|jpeg|png)$';

-- Flower types (any non-webp)
SELECT id, image_url
FROM flower_types
WHERE image_url IS NOT NULL AND lower(image_url) ~ '\.(jpg|jpeg|png)$';

-- Wedding creations (any non-webp)
SELECT id, image_url
FROM wedding_creations
WHERE image_url IS NOT NULL AND lower(image_url) ~ '\.(jpg|jpeg|png)$';

