-- Migration: Insert existing wedding creation photos
-- Run this SQL in your Supabase SQL Editor AFTER creating the wedding_creations table

-- First, check if photos already exist - this prevents duplicates
-- Only insert if the table is empty or specific images don't exist
DO $$
BEGIN
  -- Check if table is empty or doesn't have these specific images
  IF NOT EXISTS (
    SELECT 1 FROM wedding_creations 
    WHERE image_url = '/assets/wedding % events/IMG_5461.jpg'
    LIMIT 1
  ) THEN
    -- Insert existing wedding creation photos from the hardcoded array
    -- These are local asset paths that will work with the current setup
    INSERT INTO wedding_creations (image_url, display_order, is_active) VALUES
      ('/assets/wedding % events/IMG_5461.jpg', 1, true),
      ('/assets/wedding % events/IMG_4875.jpg', 2, true),
      ('/assets/wedding % events/IMG_2670.jpg', 3, true),
      ('/assets/wedding % events/IMG_1791.jpg', 4, true),
      ('/assets/wedding % events/events/IMG-20251126-WA0018.jpg', 5, true),
      ('/assets/wedding % events/events/IMG-20251126-WA0020.jpg', 6, true),
      ('/assets/wedding % events/events/IMG-20251126-WA0022.jpg', 7, true),
      ('/assets/wedding % events/events/IMG-20251126-WA0023.jpg', 8, true),
      ('/assets/wedding % events/events/IMG-20251126-WA0024.jpg', 9, true),
      ('/assets/wedding % events/events/WhatsApp Image 2025-11-26 at 03.14.12_6dbd359d.jpg', 10, true),
      ('/assets/wedding % events/IMG_1672.JPG', 11, true),
      ('/assets/wedding % events/wedding/IMG_1784.jpg', 12, true),
      ('/assets/wedding % events/wedding/IMG_1791.jpg', 13, true),
      ('/assets/wedding % events/wedding/IMG-20251126-WA0019.jpg', 14, true),
      ('/assets/wedding % events/wedding/IMG-20251126-WA0021.jpg', 15, true),
      ('/assets/wedding % events/IMG_1673.JPG', 16, true),
      ('/assets/wedding % events/IMG_1649.jpg', 17, true),
      ('/assets/wedding % events/IMG_2802.JPG', 18, true);
    
    RAISE NOTICE 'Successfully inserted existing wedding creation photos';
  ELSE
    RAISE NOTICE 'Wedding creation photos already exist in database. Skipping migration.';
  END IF;
END $$;

