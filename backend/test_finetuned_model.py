"""
Quick test script to verify the fine-tuned red roses model works
"""

import torch
from diffusers import StableDiffusionPipeline
from peft import PeftModel
from PIL import Image
import os

print("=" * 60)
print("Testing Fine-Tuned Red Roses Model")
print("=" * 60)

# Check if model exists
LORA_PEFT_PATH = "fine_tuned_model_test/final"
if not os.path.exists(LORA_PEFT_PATH):
    print(f"❌ Model not found at: {LORA_PEFT_PATH}")
    print("   Run: python train_model_test.py first")
    exit(1)

print(f"✅ Found model at: {LORA_PEFT_PATH}")

# Load base model
print("\n📦 Loading base Stable Diffusion model...")
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"   Using device: {device}")

pipeline = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    safety_checker=None
)

# Load PEFT adapter
print(f"\n🎨 Loading fine-tuned PEFT LoRA adapter...")
try:
    pipeline.unet = PeftModel.from_pretrained(
        pipeline.unet,
        LORA_PEFT_PATH,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32
    )
    print("✅ Fine-tuned model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {str(e)}")
    exit(1)

# Move to device
pipeline = pipeline.to(device)

# Test generation
print("\n🖼️  Generating test image...")
print("   Prompt: 'Beautiful red roses bouquet in heart-shaped box, Bexy Flowers branding'")

try:
    image = pipeline(
        prompt="Beautiful red roses bouquet in heart-shaped box, Bexy Flowers branding, professional product photography, white background",
        negative_prompt="blurry, distorted, low quality, bad anatomy",
        num_inference_steps=30,
        guidance_scale=7.5,
        height=512,
        width=512
    ).images[0]
    
    # Save test image
    output_path = "test_finetuned_output.jpg"
    image.save(output_path)
    print(f"✅ Test image saved to: {output_path}")
    print("\n" + "=" * 60)
    print("🎉 SUCCESS! Your fine-tuned model is working!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Start the Flask server: python server.py")
    print("2. Test via frontend customization page")
    print("3. If results look good, train on all images!")
    
except Exception as e:
    print(f"❌ Error generating image: {str(e)}")
    import traceback
    traceback.print_exc()



