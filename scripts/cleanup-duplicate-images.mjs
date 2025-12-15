import 'dotenv/config';
import { readdir, stat, unlink } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function findImageFiles(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      // Skip certain directories
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }
      
      if (entry.isDirectory()) {
        const subFiles = await findImageFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.some(e => e.toLowerCase() === ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

async function hasWebpVersion(imagePath) {
  const dir = dirname(imagePath);
  const baseName = basename(imagePath);
  // Remove original extension and add .webp
  const nameWithoutExt = baseName.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '');
  const webpPath = join(dir, `${nameWithoutExt}.webp`);
  
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
    console.log(`\n🔍 Scanning ${assetsDir} for duplicate images...\n`);
    
    const imageFiles = await findImageFiles(assetsDir);
    console.log(`📊 Found ${imageFiles.length} potential original image files (.jpg/.jpeg/.png)\n`);
    
    if (imageFiles.length === 0) {
      console.log('✅ No original image files found. All images are already converted to WebP!\n');
      return;
    }
    
    let deleted = 0;
    let skipped = 0;
    const errors = [];
    
    console.log('Processing files...\n');
    
    for (const imagePath of imageFiles) {
      try {
        const hasWebp = await hasWebpVersion(imagePath);
        const relativePath = imagePath.replace(assetsDir + '\\', '').replace(assetsDir + '/', '');
        
        if (hasWebp) {
          await unlink(imagePath);
          console.log(`✅ Deleted: ${relativePath}`);
          deleted++;
        } else {
          console.log(`⏭️  Skipped (no .webp version found): ${relativePath}`);
          skipped++;
        }
      } catch (error) {
        const relativePath = imagePath.replace(assetsDir + '\\', '').replace(assetsDir + '/', '');
        errors.push({ path: relativePath, error: error.message });
        console.error(`❌ Error processing ${relativePath}:`, error.message);
      }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📈 Summary:`);
    console.log(`   ✅ Deleted: ${deleted} duplicate images (had .webp version)`);
    console.log(`   ⏭️  Skipped: ${skipped} images (no .webp version - keeping them)`);
    if (errors.length > 0) {
      console.log(`   ❌ Errors: ${errors.length} files`);
      errors.forEach(({ path, error }) => {
        console.log(`      - ${path}: ${error}`);
      });
    }
    console.log(`${'='.repeat(60)}\n`);
    
    if (deleted > 0) {
      console.log('✅ Cleanup complete! All duplicate .jpg/.png files with .webp versions have been removed.\n');
    } else if (skipped > 0) {
      console.log('ℹ️  All original images were kept because they don\'t have .webp versions.\n');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
