import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public', 'assets');

const exts = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
const quality = Number(process.env.WEBP_QUALITY || 82);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function isTarget(file) {
  return exts.some((ext) => file.endsWith(ext));
}

function toWebp(file) {
  return file.replace(/\.[^.]+$/, '.webp');
}

async function convertFile(file) {
  const webpPath = toWebp(file);
  try {
    // Skip if webp already exists
    await fs.access(webpPath);
    return { status: 'skipped', file };
  } catch {
    // continue
  }

  const input = await fs.readFile(file);
  const output = await sharp(input).webp({ quality }).toBuffer();
  await fs.writeFile(webpPath, output);
  return { status: 'converted', file };
}

async function main() {
  let converted = 0;
  let skipped = 0;
  for await (const file of walk(publicDir)) {
    if (!isTarget(file)) continue;
    const res = await convertFile(file);
    if (res.status === 'converted') converted += 1;
    else skipped += 1;
  }
  console.log(`Done. Converted: ${converted}, skipped (already webp): ${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

