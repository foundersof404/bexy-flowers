/**
 * Data Migration Script - Migrate existing data to Supabase
 * 
 * This script will:
 * 1. Read your existing bouquet data from generatedBouquets.ts
 * 2. Upload all images to Supabase Storage
 * 3. Create products in Supabase database
 * 
 * Prerequisites:
 * - Supabase project created
 * - .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * - All tables created (run SQL from SUPABASE_SETUP.md)
 * - Storage buckets created (product-images, flower-images, accessory-images)
 * 
 * Usage:
 * node scripts/migrate-to-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
async function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = await fs.readFile(envPath, 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        env[key.trim()] = value.trim();
      }
    });
    
    return env;
  } catch (error) {
    console.error('Error loading .env.local:', error);
    console.error('Make sure .env.local exists with your Supabase credentials');
    process.exit(1);
  }
}

async function migrate() {
  console.log('🚀 Starting migration to Supabase...\n');

  // Load environment variables
  const env = await loadEnv();
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('✓ Connected to Supabase');

  // Import your existing bouquet data
  const { generatedBouquets } = await import('../src/data/generatedBouquets.ts');

  console.log(`\n📦 Found ${generatedBouquets.length} bouquets to migrate\n`);

  let successCount = 0;
  let errorCount = 0;

  // Migrate each bouquet
  for (let i = 0; i < generatedBouquets.length; i++) {
    const bouquet = generatedBouquets[i];
    console.log(`[${i + 1}/${generatedBouquets.length}] Migrating: ${bouquet.name}...`);

    try {
      // Note: For local images, you'll need to upload them to Supabase Storage first
      // For now, we'll use the existing image URLs
      const imageUrl = bouquet.image;

      // Insert product
      const { data, error } = await supabase
        .from('collection_products')
        .insert({
          title: bouquet.name,
          description: bouquet.description,
          price: bouquet.price,
          category: bouquet.category,
          display_category: bouquet.displayCategory,
          featured: bouquet.featured,
          tags: bouquet.category ? [bouquet.category] : [], // Convert category to tag
          image_urls: [imageUrl],
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Error: ${error.message}`);
        errorCount++;
      } else {
        console.log(`  ✓ Created product ID: ${data.id}`);
        successCount++;
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Migration complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log('='.repeat(50) + '\n');

  if (successCount > 0) {
    console.log('🎉 Products are now in Supabase!');
    console.log('Next: Go to /admin/products to see them.');
  }
}

migrate().catch(console.error);

