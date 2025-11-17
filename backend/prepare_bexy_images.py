"""
Bexy Flowers - Prepare Training Images from Project Assets
===========================================================

This script:
1. Copies images from src/assets/imagess/
2. Converts HEIC to JPG
3. Resizes to 512x512
4. Creates initial captions
5. Ready for training!
"""

import os
import shutil
from pathlib import Path
from PIL import Image
import json

# Colors for terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}[OK] {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}[ERROR] {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}[WARNING] {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}[INFO] {text}{Colors.END}")


def convert_heic_to_jpg(heic_path, jpg_path):
    """Convert HEIC to JPG using pillow_heif."""
    try:
        # Try using pillow_heif (needs to be installed)
        from pillow_heif import register_heif_opener
        register_heif_opener()
        
        img = Image.open(heic_path)
        img = img.convert('RGB')
        img.save(jpg_path, 'JPEG', quality=95)
        return True
    except ImportError:
        print_error("pillow_heif not installed. Install it with:")
        print_info("   pip install pillow-heif")
        return False
    except Exception as e:
        print_error(f"Error converting {heic_path.name}: {str(e)}")
        return False


def prepare_bexy_images():
    """Main function to prepare Bexy Flowers images for training."""
    
    print_header("Bexy Flowers Training Image Preparation")
    
    # Paths
    source_dir = Path("../src/assets/imagess")  # Relative to backend folder
    raw_dir = Path("training_data/raw_images")
    processed_dir = Path("training_data/images")
    
    # Check if source exists
    if not source_dir.exists():
        # Try absolute path
        source_dir = Path(r"C:\Users\bossm\Desktop\e-commerce-Bexy_Flowers-main\src\assets\imagess")
    
    if not source_dir.exists():
        print_error("Source directory not found!")
        print_info(f"Looking for: {source_dir.absolute()}")
        print_info("Please run this from the backend/ directory")
        return
    
    # Create directories
    raw_dir.mkdir(parents=True, exist_ok=True)
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    print_info(f"Source: {source_dir}")
    print_info(f"Output: {processed_dir}")
    print()
    
    # Get all image files
    image_files = []
    for ext in ['.heic', '.HEIC', '.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG']:
        image_files.extend(source_dir.glob(f"*{ext}"))
    
    print_info(f"Found {len(image_files)} images in source directory")
    print()
    
    if len(image_files) == 0:
        print_error("No image files found!")
        return
    
    # Check if pillow_heif is available for HEIC files
    heic_count = sum(1 for f in image_files if f.suffix.lower() == '.heic')
    if heic_count > 0:
        print_info(f"Found {heic_count} HEIC files - will try to convert...")
        try:
            from pillow_heif import register_heif_opener
            register_heif_opener()
            print_success("HEIC conversion available!")
        except ImportError:
            print_warning("pillow_heif not installed - HEIC files will be skipped")
            print_info("To convert HEIC files, install: pip install pillow-heif")
        print()
    
    # Process images
    print_header("Processing Images")
    
    captions = {}
    processed_count = 0
    skipped_count = 0
    
    for idx, img_file in enumerate(image_files, 1):
        try:
            output_name = f"bexy_{processed_count + 1:03d}"
            output_path = processed_dir / f"{output_name}.jpg"
            
            # Load image
            if img_file.suffix.lower() == '.heic':
                try:
                    from pillow_heif import register_heif_opener
                    register_heif_opener()
                    img = Image.open(img_file).convert('RGB')
                except ImportError:
                    print_warning(f"Skipping HEIC: {img_file.name}")
                    skipped_count += 1
                    continue
            else:
                img = Image.open(img_file).convert('RGB')
            
            # Resize to 512x512 (training resolution)
            img_resized = img.resize((512, 512), Image.LANCZOS)
            
            # Save as JPG
            img_resized.save(output_path, 'JPEG', quality=95)
            
            # Create initial caption (will be edited later)
            captions[output_name] = (
                f"Beautiful flower bouquet arrangement by Bexy Flowers, "
                f"professional product photography, elegant floral design, "
                f"high quality commercial photo, luxury style"
            )
            
            print_success(f"[{idx}/{len(image_files)}] Processed: {img_file.name} -> {output_name}.jpg")
            processed_count += 1
            
        except Exception as e:
            print_error(f"Error processing {img_file.name}: {str(e)}")
            skipped_count += 1
    
    # Save captions
    captions_file = Path("training_data/captions.json")
    with open(captions_file, "w", encoding="utf-8") as f:
        json.dump(captions, f, indent=2, ensure_ascii=False)
    
    # Summary
    print()
    print_header("Summary")
    print_success(f"Processed: {processed_count} images")
    if skipped_count > 0:
        print_warning(f"Skipped: {skipped_count} images")
    print_info(f"Saved to: {processed_dir}")
    print()
    
    # Next steps
    print_header("IMPORTANT NEXT STEPS")
    print()
    print_info("1. EDIT CAPTIONS - Make them SPECIFIC!")
    print(f"   Open: {captions_file}")
    print()
    print_info("2. For EACH image, describe:")
    print("   - Flower types (roses, tulips, lilies, etc.)")
    print("   - Flower colors (red, pink, white, etc.)")
    print("   - Quantities (approximate count)")
    print("   - Packaging (box shape/color, wrap color)")
    print("   - Accessories (teddy bear, crown, chocolates, etc.)")
    print("   - Special features (glitter, ribbons, etc.)")
    print()
    print_info("3. Example GOOD caption:")
    print('   "Beautiful flower bouquet with 15 red roses in pink')
    print('    heart-shaped gift box with Bexy Flowers gold logo,')
    print('    professional product photography, white background"')
    print()
    print_info("4. After editing captions, train the model:")
    print("   python train_model.py")
    print()
    print_header("Ready for Training!")
    print()
    print_info(f"You have {processed_count} images - that's {'EXCELLENT' if processed_count >= 30 else 'GOOD'}!")
    print_info("More images = Better AI quality")
    print()
    
    if skipped_count > 0 and heic_count > 0:
        print_warning(f"{skipped_count} HEIC files were skipped")
        print_info("To convert HEIC files, run:")
        print_info("   pip install pillow-heif")
        print_info("Then run this script again")
        print()


if __name__ == "__main__":
    prepare_bexy_images()


===========================================================

This script:
1. Copies images from src/assets/imagess/
2. Converts HEIC to JPG
3. Resizes to 512x512
4. Creates initial captions
5. Ready for training!
"""

import os
import shutil
from pathlib import Path
from PIL import Image
import json

# Colors for terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}[OK] {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}[ERROR] {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}[WARNING] {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}[INFO] {text}{Colors.END}")


def convert_heic_to_jpg(heic_path, jpg_path):
    """Convert HEIC to JPG using pillow_heif."""
    try:
        # Try using pillow_heif (needs to be installed)
        from pillow_heif import register_heif_opener
        register_heif_opener()
        
        img = Image.open(heic_path)
        img = img.convert('RGB')
        img.save(jpg_path, 'JPEG', quality=95)
        return True
    except ImportError:
        print_error("pillow_heif not installed. Install it with:")
        print_info("   pip install pillow-heif")
        return False
    except Exception as e:
        print_error(f"Error converting {heic_path.name}: {str(e)}")
        return False


def prepare_bexy_images():
    """Main function to prepare Bexy Flowers images for training."""
    
    print_header("Bexy Flowers Training Image Preparation")
    
    # Paths
    source_dir = Path("../src/assets/imagess")  # Relative to backend folder
    raw_dir = Path("training_data/raw_images")
    processed_dir = Path("training_data/images")
    
    # Check if source exists
    if not source_dir.exists():
        # Try absolute path
        source_dir = Path(r"C:\Users\bossm\Desktop\e-commerce-Bexy_Flowers-main\src\assets\imagess")
    
    if not source_dir.exists():
        print_error("Source directory not found!")
        print_info(f"Looking for: {source_dir.absolute()}")
        print_info("Please run this from the backend/ directory")
        return
    
    # Create directories
    raw_dir.mkdir(parents=True, exist_ok=True)
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    print_info(f"Source: {source_dir}")
    print_info(f"Output: {processed_dir}")
    print()
    
    # Get all image files
    image_files = []
    for ext in ['.heic', '.HEIC', '.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG']:
        image_files.extend(source_dir.glob(f"*{ext}"))
    
    print_info(f"Found {len(image_files)} images in source directory")
    print()
    
    if len(image_files) == 0:
        print_error("No image files found!")
        return
    
    # Check if pillow_heif is available for HEIC files
    heic_count = sum(1 for f in image_files if f.suffix.lower() == '.heic')
    if heic_count > 0:
        print_info(f"Found {heic_count} HEIC files - will try to convert...")
        try:
            from pillow_heif import register_heif_opener
            register_heif_opener()
            print_success("HEIC conversion available!")
        except ImportError:
            print_warning("pillow_heif not installed - HEIC files will be skipped")
            print_info("To convert HEIC files, install: pip install pillow-heif")
        print()
    
    # Process images
    print_header("Processing Images")
    
    captions = {}
    processed_count = 0
    skipped_count = 0
    
    for idx, img_file in enumerate(image_files, 1):
        try:
            output_name = f"bexy_{processed_count + 1:03d}"
            output_path = processed_dir / f"{output_name}.jpg"
            
            # Load image
            if img_file.suffix.lower() == '.heic':
                try:
                    from pillow_heif import register_heif_opener
                    register_heif_opener()
                    img = Image.open(img_file).convert('RGB')
                except ImportError:
                    print_warning(f"Skipping HEIC: {img_file.name}")
                    skipped_count += 1
                    continue
            else:
                img = Image.open(img_file).convert('RGB')
            
            # Resize to 512x512 (training resolution)
            img_resized = img.resize((512, 512), Image.LANCZOS)
            
            # Save as JPG
            img_resized.save(output_path, 'JPEG', quality=95)
            
            # Create initial caption (will be edited later)
            captions[output_name] = (
                f"Beautiful flower bouquet arrangement by Bexy Flowers, "
                f"professional product photography, elegant floral design, "
                f"high quality commercial photo, luxury style"
            )
            
            print_success(f"[{idx}/{len(image_files)}] Processed: {img_file.name} -> {output_name}.jpg")
            processed_count += 1
            
        except Exception as e:
            print_error(f"Error processing {img_file.name}: {str(e)}")
            skipped_count += 1
    
    # Save captions
    captions_file = Path("training_data/captions.json")
    with open(captions_file, "w", encoding="utf-8") as f:
        json.dump(captions, f, indent=2, ensure_ascii=False)
    
    # Summary
    print()
    print_header("Summary")
    print_success(f"Processed: {processed_count} images")
    if skipped_count > 0:
        print_warning(f"Skipped: {skipped_count} images")
    print_info(f"Saved to: {processed_dir}")
    print()
    
    # Next steps
    print_header("IMPORTANT NEXT STEPS")
    print()
    print_info("1. EDIT CAPTIONS - Make them SPECIFIC!")
    print(f"   Open: {captions_file}")
    print()
    print_info("2. For EACH image, describe:")
    print("   - Flower types (roses, tulips, lilies, etc.)")
    print("   - Flower colors (red, pink, white, etc.)")
    print("   - Quantities (approximate count)")
    print("   - Packaging (box shape/color, wrap color)")
    print("   - Accessories (teddy bear, crown, chocolates, etc.)")
    print("   - Special features (glitter, ribbons, etc.)")
    print()
    print_info("3. Example GOOD caption:")
    print('   "Beautiful flower bouquet with 15 red roses in pink')
    print('    heart-shaped gift box with Bexy Flowers gold logo,')
    print('    professional product photography, white background"')
    print()
    print_info("4. After editing captions, train the model:")
    print("   python train_model.py")
    print()
    print_header("Ready for Training!")
    print()
    print_info(f"You have {processed_count} images - that's {'EXCELLENT' if processed_count >= 30 else 'GOOD'}!")
    print_info("More images = Better AI quality")
    print()
    
    if skipped_count > 0 and heic_count > 0:
        print_warning(f"{skipped_count} HEIC files were skipped")
        print_info("To convert HEIC files, run:")
        print_info("   pip install pillow-heif")
        print_info("Then run this script again")
        print()


if __name__ == "__main__":
    prepare_bexy_images()



