import 'dotenv/config';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local or environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const WEBP_QUALITY = Number(process.env.WEBP_QUALITY || 82);

/**
 * Extract bucket and path from a public Supabase Storage URL.
 */
function parseBucketAndPath(url) {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    if (!match) return null;
    const [, bucket, path] = match;
    return { bucket, path };
  } catch (err) {
    return null;
  }
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function convertBufferToWebp(buffer) {
  return sharp(buffer).webp({ quality: WEBP_QUALITY }).toBuffer();
}

async function uploadWebp(bucket, path, buffer) {
  const newPath = path.replace(/\.[^.]+$/, '.webp');
  const { data, error } = await supabase.storage.from(bucket).upload(newPath, buffer, {
    cacheControl: '31536000',
    upsert: true,
    contentType: 'image/webp',
  });
  if (error) throw new Error(`Upload failed for ${bucket}/${newPath}: ${error.message}`);
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { path: data.path, url: urlData.publicUrl };
}

async function processSingleImage(url) {
  if (!url) return null;
  if (url.toLowerCase().endsWith('.webp')) return url;

  const parsed = parseBucketAndPath(url);
  if (!parsed) {
    console.warn(`Skip non-supabase url: ${url}`);
    return url;
  }

  const buffer = await downloadImage(url);
  const webpBuffer = await convertBufferToWebp(buffer);
  const uploaded = await uploadWebp(parsed.bucket, parsed.path, webpBuffer);
  return uploaded.url;
}

async function processArray(urls = []) {
  const results = [];
  for (const url of urls) {
    results.push(await processSingleImage(url));
  }
  return results;
}

async function updateTable({ table, select, column, type }) {
  const { data, error } = await supabase.from(table).select(select);
  if (error) throw new Error(`Fetch failed for ${table}: ${error.message}`);

  console.log(`Processing ${data.length} rows from ${table}...`);

  for (const row of data) {
    try {
      if (type === 'array') {
        const converted = await processArray(row[column] || []);
        if (JSON.stringify(converted) === JSON.stringify(row[column])) continue;
        const { error: uErr } = await supabase.from(table).update({ [column]: converted }).eq('id', row.id);
        if (uErr) throw uErr;
        console.log(`Updated ${table} id=${row.id}`);
      } else {
        const converted = await processSingleImage(row[column]);
        if (converted === row[column]) continue;
        const { error: uErr } = await supabase.from(table).update({ [column]: converted }).eq('id', row.id);
        if (uErr) throw uErr;
        console.log(`Updated ${table} id=${row.id}`);
      }
    } catch (err) {
      console.error(`Failed on ${table} id=${row.id}:`, err.message);
    }
  }
}

async function main() {
  try {
    await updateTable({
      table: 'collection_products',
      select: 'id, image_urls',
      column: 'image_urls',
      type: 'array',
    });

    await updateTable({
      table: 'accessories',
      select: 'id, image_url',
      column: 'image_url',
      type: 'single',
    });

    await updateTable({
      table: 'flower_types',
      select: 'id, image_url',
      column: 'image_url',
      type: 'single',
    });

    await updateTable({
      table: 'wedding_creations',
      select: 'id, image_url',
      column: 'image_url',
      type: 'single',
    });

    console.log('Done converting images to WebP.');
  } catch (err) {
    console.error('Conversion failed:', err);
    process.exit(1);
  }
}

main();

