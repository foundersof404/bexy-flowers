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
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
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
    // Directory might not exist, skip silently
    return [];
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

async function cleanupDirectory(dir, dirName) {
  console.log(`\n🔍 Scanning ${dirName} (${dir})...`);
  const imageFiles = await findImageFiles(dir);
  
  if (imageFiles.length === 0) {
    console.log(`   ✅ No original image files found in ${dirName}\n`);
    return { deleted: 0, skipped: 0 };
  }
  
  console.log(`   📊 Found ${imageFiles.length} potential original image files\n`);
  
  let deleted = 0;
  let skipped = 0;
  
  for (const imagePath of imageFiles) {
    try {
      const hasWebp = await hasWebpVersion(imagePath);
      const relativePath = imagePath.replace(dir + '\\', '').replace(dir + '/', '');
      
      if (hasWebp) {
        await unlink(imagePath);
        console.log(`   ✅ Deleted: ${relativePath}`);
        deleted++;
      } else {
        console.log(`   ⏭️  Skipped (no .webp): ${relativePath}`);
        skipped++;
      }
    } catch (error) {
      console.error(`   ❌ Error: ${imagePath}: ${error.message}`);
    }
  }
  
  return { deleted, skipped };
}

async function main() {
  try {
    const projectRoot = join(__dirname, '..');
    const publicAssetsDir = join(projectRoot, 'public', 'assets');
    const srcAssetsDir = join(projectRoot, 'src', 'assets');
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧹 CLEANING UP DUPLICATE IMAGES`);
    console.log(`${'='.repeat(60)}\n`);
    
    // Clean public/assets
    const publicResult = await cleanupDirectory(publicAssetsDir, 'public/assets');
    
    // Clean src/assets
    const srcResult = await cleanupDirectory(srcAssetsDir, 'src/assets');
    
    const totalDeleted = publicResult.deleted + srcResult.deleted;
    const totalSkipped = publicResult.skipped + srcResult.skipped;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📈 FINAL SUMMARY:`);
    console.log(`   ✅ Total Deleted: ${totalDeleted} duplicate images`);
    console.log(`   ⏭️  Total Skipped: ${totalSkipped} images (no .webp - kept)`);
    console.log(`${'='.repeat(60)}\n`);
    
    if (totalDeleted > 0) {
      console.log('✅ Cleanup complete! All duplicate .jpg/.png files with .webp versions have been removed.\n');
    } else {
      console.log('ℹ️  No duplicates found. All images are either already WebP or don\'t have duplicates.\n');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
