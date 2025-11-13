"""
Bexy Flowers - Training Setup Script
=====================================

This script helps you prepare training data for fine-tuning.
"""

import os
import json
from pathlib import Path
from PIL import Image
import shutil

def setup_training_environment():
    """Create necessary directories and files for training."""
    
    print("=" * 60)
    print("🌸 Bexy Flowers Training Setup 🌸")
    print("=" * 60)
    print()
    
    # Create directories
    directories = [
        "training_data",
        "training_data/images",
        "training_data/raw_images",
        "fine_tuned_model"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created: {directory}/")
    
    print()
    print("=" * 60)
    print("📸 NEXT STEPS:")
    print("=" * 60)
    print()
    print("1. Add your Bexy Flowers images to:")
    print(f"   training_data/raw_images/")
    print()
    print("   Copy at least 10-50 images of:")
    print("   - Flower boxes (different colors, shapes)")
    print("   - Wrapped bouquets (different wrapping colors)")
    print("   - Mixed arrangements")
    print("   - With accessories (teddy bears, crowns, etc.)")
    print()
    print("2. Run the image preparation:")
    print("   python setup_training.py --prepare")
    print()
    print("3. Edit captions:")
    print("   training_data/captions.json")
    print("   (Describe each image accurately)")
    print()
    print("4. Start training:")
    print("   python train_model.py")
    print()
    print("=" * 60)
    print()
    print("💡 TIP: More training images = Better results!")
    print("   Aim for 20-50 high-quality images of your actual products")
    print()
    print("=" * 60)


def prepare_images():
    """Resize and optimize images for training."""
    
    raw_dir = Path("training_data/raw_images")
    output_dir = Path("training_data/images")
    
    if not raw_dir.exists() or not list(raw_dir.glob("*")):
        print("❌ No images found in training_data/raw_images/")
        print("   Please add your Bexy Flowers images there first!")
        return
    
    print("=" * 60)
    print("📸 Preparing Training Images")
    print("=" * 60)
    print()
    
    captions = {}
    image_count = 0
    
    # Supported formats
    extensions = [".jpg", ".jpeg", ".png", ".webp"]
    
    for img_file in raw_dir.iterdir():
        if img_file.suffix.lower() not in extensions:
            continue
        
        try:
            # Load image
            img = Image.open(img_file).convert("RGB")
            
            # Resize to 512x512 (training resolution)
            img_resized = img.resize((512, 512), Image.LANCZOS)
            
            # Save
            output_name = f"bexy_image_{image_count + 1:03d}"
            output_path = output_dir / f"{output_name}.jpg"
            img_resized.save(output_path, "JPEG", quality=95)
            
            # Generate default caption
            captions[output_name] = (
                f"Beautiful flower bouquet arrangement by Bexy Flowers, "
                f"professional product photography, white background, "
                f"studio lighting, high quality, commercial photo, luxury floral design"
            )
            
            print(f"✅ Processed: {img_file.name} → {output_name}.jpg")
            image_count += 1
            
        except Exception as e:
            print(f"❌ Error processing {img_file.name}: {str(e)}")
    
    # Save captions
    captions_file = Path("training_data/captions.json")
    with open(captions_file, "w", encoding="utf-8") as f:
        json.dump(captions, f, indent=2)
    
    print()
    print("=" * 60)
    print(f"✅ Prepared {image_count} images!")
    print()
    print("📝 IMPORTANT: Edit the captions in:")
    print(f"   {captions_file}")
    print()
    print("Make them SPECIFIC and ACCURATE:")
    print("❌ BAD:  'flower bouquet'")
    print("✅ GOOD: 'red roses in pink heart box with Bexy Flowers logo'")
    print()
    print("After editing captions, run:")
    print("   python train_model.py")
    print("=" * 60)


def download_sample_images():
    """
    Download sample Bexy Flowers images from the user's provided photos.
    In a real scenario, you'd use actual URLs or have users provide their own images.
    """
    print("=" * 60)
    print("📥 Sample Images")
    print("=" * 60)
    print()
    print("Please manually add your Bexy Flowers product images to:")
    print("   training_data/raw_images/")
    print()
    print("You showed 3 great examples:")
    print("1. Mixed flower table decoration")
    print("2. 'I ❤️ U' rose box arrangement")
    print("3. Black wrap with glittery roses + Spider-Man plush")
    print()
    print("Add these and 10-50 more similar product photos!")
    print()
    print("=" * 60)


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--prepare":
        prepare_images()
    elif len(sys.argv) > 1 and sys.argv[1] == "--download-samples":
        download_sample_images()
    else:
        setup_training_environment()

