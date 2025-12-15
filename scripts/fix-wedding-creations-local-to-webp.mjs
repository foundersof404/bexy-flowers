import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); // scripts/ -> project root
const publicDir = path.join(projectRoot, 'public');
const BUCKET = 'wedding-creations';
const WEBP_QUALITY = Number(process.env.WEBP_QUALITY || 82);

function toWebpName(p) {
  return p.replace(/\.[^.]+$/, '.webp');
}

async function loadLocalFile(relativePath) {
  const filePath = path.join(publicDir, relativePath);
  const buf = await fs.readFile(filePath);
  return buf;
}

async function uploadWebp(relativePath, buffer) {
  const webpPath = toWebpName(relativePath);
  const { data, error } = await supabase.storage.from(BUCKET).upload(webpPath, buffer, {
    cacheControl: '31536000',
    upsert: true,
    contentType: 'image/webp',
  });
  if (error) throw new Error(`Upload failed for ${webpPath}: ${error.message}`);
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return { path: data.path, url: urlData.publicUrl };
}

async function convertLocalToWebp(relativePath) {
  const buffer = await loadLocalFile(relativePath);
  const webpBuffer = await sharp(buffer).webp({ quality: WEBP_QUALITY }).toBuffer();
  return uploadWebp(relativePath, webpBuffer);
}

async function main() {
  try {
    // Fetch wedding creations that still reference local /assets and are not webp
    const { data, error } = await supabase
      .from('wedding_creations')
      .select('id, image_url')
      .not('image_url', 'ilike', '%.webp')
      .ilike('image_url', '/assets/%');

    if (error) throw new Error(`Fetch failed: ${error.message}`);
    if (!data || data.length === 0) {
      console.log('No local asset references found.');
      return;
    }

    console.log(`Found ${data.length} local wedding images to convert/upload...`);

    for (const row of data) {
      const rel = row.image_url.replace(/^\//, ''); // strip leading slash
      try {
        const uploaded = await convertLocalToWebp(rel);
        const { error: uErr } = await supabase
          .from('wedding_creations')
          .update({ image_url: uploaded.url })
          .eq('id', row.id);
        if (uErr) throw uErr;
        console.log(`Updated ${row.id} -> ${uploaded.url}`);
      } catch (err) {
        console.error(`Failed ${row.id} (${row.image_url}): ${err.message}`);
      }
    }

    console.log('Done. Run npm run prune:non-webp after verifying.');
  } catch (err) {
    console.error('Script failed:', err.message);
    process.exit(1);
  }
}

main();

