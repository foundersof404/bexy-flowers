"""
Convert HEIC images to JPG for training
"""

import os
from pathlib import Path
from PIL import Image

# Try to import pillow-heif for HEIC support
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIC_SUPPORT = True
    print("✅ HEIC support enabled")
except ImportError:
    HEIC_SUPPORT = False
    print("❌ ERROR: pillow-heif not found!")
    print("   Installing pillow-heif...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow-heif"])
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIC_SUPPORT = True
    print("✅ pillow-heif installed and enabled")

# Paths
RED_ROSES_DIR = Path("training_data/images/Red Roses")
CONVERTED_DIR = Path("training_data/images/Red Roses Converted")
CONVERTED_DIR.mkdir(exist_ok=True)

print("\n" + "=" * 60)
print("Converting HEIC images to JPG")
print("=" * 60 + "\n")

converted_count = 0
skipped_count = 0

for img_file in RED_ROSES_DIR.iterdir():
    if img_file.name in ['desktop.ini', 'Thumbs.db', '.DS_Store']:
        continue
    
    # Check if it's a HEIC file
    if img_file.suffix.lower() not in ['.heic', '.heif']:
        print(f"⏭️  Skipping {img_file.name} (not HEIC)")
        skipped_count += 1
        continue
    
    try:
        print(f"🔄 Converting: {img_file.name}")
        
        # Load HEIC image
        img = Image.open(img_file).convert('RGB')
        
        # Create output filename (replace .heic/.heif with .jpg)
        output_name = img_file.stem + '.jpg'
        output_path = CONVERTED_DIR / output_name
        
        # Save as high-quality JPG
        img.save(output_path, 'JPEG', quality=95)
        
        print(f"   ✅ Saved: {output_path.name}")
        converted_count += 1
        
    except Exception as e:
        print(f"   ❌ Error converting {img_file.name}: {str(e)}")

print("\n" + "=" * 60)
print(f"Conversion complete!")
print(f"   Converted: {converted_count} HEIC files")
print(f"   Skipped: {skipped_count} files")
print("=" * 60)

if converted_count > 0:
    print(f"\n✅ HEIC images converted to: {CONVERTED_DIR}")
    print("\nNext: Copy converted JPGs to Red Roses folder or update training script")



