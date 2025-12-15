import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const buckets = ['product-images', 'flower-images', 'accessory-images', 'wedding-creations'];

function parseBucketAndPath(url) {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    if (!match) return null;
    const [, bucket, path] = match;
    return { bucket, path };
  } catch {
    return null;
  }
}

async function listAllFiles(bucket) {
  const files = [];
  const queue = ['']; // start at root
  while (queue.length) {
    const prefix = queue.shift();
    let offset = 0;
    const limit = 1000;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit, offset });
      if (error) throw new Error(`List failed for ${bucket}/${prefix}: ${error.message}`);
      if (!data || data.length === 0) break;
      for (const item of data) {
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
        // Heuristic: if id is null, treat as folder
        if (item.id === null || item.metadata?.mimetype === 'folder') {
          queue.push(fullPath);
        } else {
          files.push(fullPath);
        }
      }
      if (data.length < limit) break;
      offset += limit;
    }
  }
  return files;
}

async function main() {
  try {
    const referenced = new Map();
    buckets.forEach((b) => referenced.set(b, new Set()));

    // Collect referenced paths from DB
    const tableDefs = [
      { table: 'collection_products', select: 'id, image_urls', column: 'image_urls', type: 'array' },
      { table: 'accessories', select: 'id, image_url', column: 'image_url', type: 'single' },
      { table: 'flower_types', select: 'id, image_url', column: 'image_url', type: 'single' },
      { table: 'wedding_creations', select: 'id, image_url', column: 'image_url', type: 'single' },
    ];

    for (const def of tableDefs) {
      const { data, error } = await supabase.from(def.table).select(def.select);
      if (error) throw new Error(`Fetch failed for ${def.table}: ${error.message}`);
      for (const row of data) {
        const values = def.type === 'array' ? row[def.column] || [] : [row[def.column]];
        for (const url of values) {
          const parsed = parseBucketAndPath(url);
          if (parsed && referenced.has(parsed.bucket)) {
            referenced.get(parsed.bucket).add(parsed.path);
          }
        }
      }
    }

    // Find and delete non-webp files that are not referenced
    for (const bucket of buckets) {
      const refSet = referenced.get(bucket) || new Set();
      const allFiles = await listAllFiles(bucket);
      const candidates = allFiles.filter((path) => !path.toLowerCase().endsWith('.webp'));
      const toDelete = candidates.filter((path) => !refSet.has(path));

      console.log(`${bucket}: total ${allFiles.length}, non-webp candidates ${candidates.length}, to delete ${toDelete.length}`);

      // Batch delete in chunks
      const chunkSize = 50;
      for (let i = 0; i < toDelete.length; i += chunkSize) {
        const chunk = toDelete.slice(i, i + chunkSize);
        const { error } = await supabase.storage.from(bucket).remove(chunk);
        if (error) {
          console.error(`Delete failed for ${bucket} chunk starting ${i}: ${error.message}`);
        } else {
          console.log(`Deleted ${chunk.length} from ${bucket}`);
        }
      }
    }

    console.log('Prune complete.');
  } catch (err) {
    console.error('Prune failed:', err.message);
    process.exit(1);
  }
}

main();

