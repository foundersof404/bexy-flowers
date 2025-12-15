import 'dotenv/config';
import { readdir, stat, unlink } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function findImageFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subFiles = await findImageFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      const ext = entry.name.toLowerCase();
      if (IMAGE_EXTENSIONS.some(e => ext.endsWith(e.toLowerCase()))) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

async function hasWebpVersion(imagePath) {
  const webpPath = imagePath.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '.webp');
  try {
    await stat(webpPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  try {
    const assetsDir = join(__dirname, '..', 'public', 'assets');
    console.log(`Scanning ${assetsDir} for original images...`);
    
    const imageFiles = await findImageFiles(assetsDir);
    console.log(`Found ${imageFiles.length} potential original images`);
    
    let deleted = 0;
    let skipped = 0;
    
    for (const imagePath of imageFiles) {
      const hasWebp = await hasWebpVersion(imagePath);
      
      if (hasWebp) {
        try {
          await unlink(imagePath);
          console.log(`✓ Deleted: ${imagePath.replace(assetsDir + '\\', '').replace(assetsDir + '/', '')}`);
          deleted++;
        } catch (error) {
          console.error(`✗ Failed to delete ${imagePath}:`, error.message);
        }
      } else {
        console.log(`⊘ Skipped (no .webp): ${imagePath.replace(assetsDir + '\\', '').replace(assetsDir + '/', '')}`);
        skipped++;
      }
    }
    
    console.log(`\nDone! Deleted ${deleted} original images, skipped ${skipped} (no .webp version)`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
