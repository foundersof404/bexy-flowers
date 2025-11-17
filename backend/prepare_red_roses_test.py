"""
Quick script to prepare red roses images for test training
"""

import os
import json
import shutil
from pathlib import Path
from PIL import Image

# Try to import pillow-heif for HEIC support
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIC_SUPPORT = True
    print("✅ HEIC support enabled")
except ImportError:
    print("⚠️  Installing pillow-heif for HEIC support...")
    import subprocess
    import sys
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow-heif"], 
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        from pillow_heif import register_heif_opener
        register_heif_opener()
        HEIC_SUPPORT = True
        print("✅ pillow-heif installed and enabled")
    except:
        HEIC_SUPPORT = False
        print("❌ Warning: Could not install pillow-heif. HEIC images will be skipped.")

# Paths
RED_ROSES_DIR = Path("training_data/images/Red Roses")
TEST_OUTPUT_DIR = Path("training_data/test_red_roses")
TEST_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Create captions based on filenames
captions = {}
image_count = 0

print("Processing red roses images for test training...\n")

for img_file in RED_ROSES_DIR.iterdir():
    if img_file.name in ['desktop.ini', 'Thumbs.db']:
        continue
    
    # Check if it's an image
    if img_file.suffix.lower() not in ['.png', '.jpg', '.jpeg', '.heic', '.heif']:
        continue
    
    # Skip HEIC if no support
    if img_file.suffix.lower() in ['.heic', '.heif'] and not HEIC_SUPPORT:
        print(f"❌ Skipping {img_file.name} (no HEIC support - install pillow-heif)")
        continue
    
    try:
        # Load image (automatically converts HEIC to RGB)
        img = Image.open(img_file).convert('RGB')
        
        # Resize to 512x512 for training
        img = img.resize((512, 512), Image.LANCZOS)
        
        # Save as JPG
        output_name = f"red_roses_{image_count:03d}.jpg"
        output_path = TEST_OUTPUT_DIR / output_name
        img.save(output_path, 'JPEG', quality=95)
        
        # Create caption based on filename
        filename_lower = img_file.stem.lower()
        
        # Generate detailed caption
        caption = "Beautiful red roses bouquet"
        
        if 'heart' in filename_lower:
            caption += " in heart-shaped box"
        elif 'circle' in filename_lower or 'rounded' in filename_lower:
            caption += " in circle-shaped box"
        elif 'black box' in filename_lower:
            caption += " in elegant black box"
        elif 'golden' in filename_lower:
            caption += " in golden box"
        
        if 'glitter' in filename_lower or 'gliter' in filename_lower:
            caption += " with glitter on petals"
        
        if 'chocolate' in filename_lower or 'ferrero' in filename_lower:
            caption += " with Ferrero Rocher chocolates"
        
        if 'large' in filename_lower:
            caption += ", large size bouquet"
        elif 'medium' in filename_lower:
            caption += ", medium size bouquet"
        elif 'small' in filename_lower:
            caption += ", small size bouquet"
        
        if 'letter' in filename_lower or ' j' in filename_lower.lower():
            caption += " arranged in letter J shape"
        
        caption += ", Bexy Flowers branding, professional product photography, white background"
        
        captions[output_name.replace('.jpg', '')] = caption
        
        print(f"Processed: {img_file.name}")
        print(f"  -> {output_name}")
        print(f"  Caption: {caption}\n")
        
        image_count += 1
        
    except Exception as e:
        print(f"Error processing {img_file.name}: {str(e)}\n")

# Save captions
captions_file = Path("training_data/test_captions.json")
with open(captions_file, 'w', encoding='utf-8') as f:
    json.dump(captions, f, indent=2, ensure_ascii=False)

print("=" * 60)
print(f"Test training data ready!")
print(f"Images processed: {image_count}")
print(f"Output directory: {TEST_OUTPUT_DIR}")
print(f"Captions file: {captions_file}")
print("=" * 60)
print("\nNext step: Run quick test training:")
print("python train_model_test.py")
print("=" * 60)

