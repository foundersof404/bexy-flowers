"""
Bexy Flowers - AI Image Generation Backend
==========================================

This Flask server uses Stable Diffusion to generate flower bouquet images locally.
No paid APIs - works completely offline once models are downloaded.

Author: AI Assistant
Date: 2025
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from PIL import Image
import io
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Global variable to store the pipeline
pipeline = None

# Configuration
MODEL_ID = "runwayml/stable-diffusion-v1-5"  # You can also use "stabilityai/stable-diffusion-2-1"
OUTPUT_DIR = "generated_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def load_model():
    """
    Load Stable Diffusion model with optimizations.
    Supports both GPU and CPU execution.
    """
    global pipeline
    
    if pipeline is not None:
        logger.info("Model already loaded.")
        return
    
    logger.info(f"Loading Stable Diffusion model: {MODEL_ID}")
    logger.info("This may take a few minutes on first run (downloading ~4GB model)...")
    
    try:
        # Detect device (GPU if available, else CPU)
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {device}")
        
        # Load the model
        pipeline = StableDiffusionPipeline.from_pretrained(
            MODEL_ID,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            safety_checker=None,  # Disable NSFW checker for flower images
            requires_safety_checker=False
        )
        
        # Use DPM++ solver for faster generation
        pipeline.scheduler = DPMSolverMultistepScheduler.from_config(
            pipeline.scheduler.config
        )
        
        # Move to device
        pipeline = pipeline.to(device)
        
        # Enable memory optimizations for GPU
        if device == "cuda":
            pipeline.enable_attention_slicing()
            # Uncomment if you have limited VRAM (< 8GB)
            # pipeline.enable_sequential_cpu_offload()
        
        logger.info("✅ Model loaded successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error loading model: {str(e)}")
        raise


def build_prompt(data):
    """
    Build a detailed prompt from the user's selections.
    
    Args:
        data (dict): Request data containing flower and packaging details
        
    Returns:
        tuple: (prompt, negative_prompt)
    """
    # Extract packaging details
    packaging_type = data.get('packaging_type', 'box')  # 'box' or 'wrap'
    box_color = data.get('box_color', 'red')
    box_shape = data.get('box_shape', 'heart')
    wrap_color = data.get('wrap_color', 'pink')
    
    # Extract flower details
    flowers = data.get('flowers', [])  # List of {type: 'rose', color: 'red', quantity: 5}
    
    # Build flower description
    flower_descriptions = []
    for flower in flowers:
        qty = flower.get('quantity', 0)
        color = flower.get('color', '')
        flower_type = flower.get('type', '')
        if qty > 0:
            flower_descriptions.append(f"{qty} {color} {flower_type}")
    
    flower_text = " and ".join(flower_descriptions) if flower_descriptions else "beautiful mixed flowers"
    
    # Build packaging description
    if packaging_type == 'box':
        packaging_text = f"in a {box_color} {box_shape}-shaped luxury gift box with 'Bexy Flowers' elegant logo printed on it"
    else:
        packaging_text = f"wrapped in {wrap_color} decorative wrapping paper with 'Bexy Flowers' branding"
    
    # Extract accessories
    accessories = data.get('accessories', [])
    accessory_text = ""
    if accessories:
        acc_list = []
        if 'crown' in accessories:
            acc_list.append("a decorative crown on top")
        if 'teddy' in accessories:
            acc_list.append("a cute teddy bear")
        if 'chocolates' in accessories:
            acc_list.append("a box of luxury chocolates")
        if 'card' in accessories:
            acc_list.append("a greeting card")
        
        if acc_list:
            accessory_text = ", with " + " and ".join(acc_list)
    
    # Glitter option
    glitter = data.get('glitter', False)
    glitter_text = ". Sparkly glitter on the flower petals" if glitter else ""
    
    # User refinement text
    refinement = data.get('refinement', '').strip()
    refinement_text = f". {refinement}" if refinement else ""
    
    # Build final prompt
    prompt = (
        f"A beautiful flower bouquet with {flower_text}, {packaging_text}{accessory_text}{glitter_text}. "
        f"Professional product photography, white background, studio lighting, high quality, sharp focus, "
        f"commercial photo, luxury floral arrangement{refinement_text}"
    )
    
    # Negative prompt to avoid common issues
    negative_prompt = (
        "ugly, blurry, low quality, deformed, disfigured, bad anatomy, "
        "poorly drawn, watermark, signature, text, dark background, "
        "messy, wilted flowers, amateur photo, low resolution"
    )
    
    logger.info(f"Generated prompt: {prompt}")
    
    return prompt, negative_prompt


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify server is running."""
    return jsonify({
        "status": "ok",
        "model_loaded": pipeline is not None,
        "device": "cuda" if torch.cuda.is_available() else "cpu",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/generate', methods=['POST'])
def generate_image():
    """
    Main endpoint to generate flower bouquet images.
    
    Expected JSON format:
    {
        "packaging_type": "box" or "wrap",
        "box_color": "red",
        "box_shape": "heart",
        "wrap_color": "pink",
        "flowers": [
            {"type": "roses", "color": "red", "quantity": 5},
            {"type": "tulips", "color": "yellow", "quantity": 3}
        ],
        "accessories": ["crown", "teddy"],
        "glitter": true,
        "refinement": "Make the roses bigger"
    }
    
    Returns:
        Image file (PNG) or error JSON
    """
    try:
        # Ensure model is loaded
        if pipeline is None:
            load_model()
        
        # Get request data
        data = request.get_json()
        logger.info(f"Received generation request: {data}")
        
        # Build prompt
        prompt, negative_prompt = build_prompt(data)
        
        # Generation parameters
        num_inference_steps = data.get('steps', 30)  # 20-50 recommended
        guidance_scale = data.get('guidance', 7.5)   # 7-12 recommended
        width = data.get('width', 1024)
        height = data.get('height', 1024)
        
        logger.info(f"Generating image... (steps={num_inference_steps}, guidance={guidance_scale})")
        
        # Generate image
        with torch.inference_mode():
            result = pipeline(
                prompt=prompt,
                negative_prompt=negative_prompt,
                num_inference_steps=num_inference_steps,
                guidance_scale=guidance_scale,
                width=width,
                height=height,
                num_images_per_prompt=1
            )
        
        # Get the generated image
        image = result.images[0]
        
        # Save image to disk (optional, for debugging)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_path = os.path.join(OUTPUT_DIR, f"bouquet_{timestamp}.png")
        image.save(save_path)
        logger.info(f"Image saved to: {save_path}")
        
        # Convert image to bytes for response
        img_io = io.BytesIO()
        image.save(img_io, 'PNG', quality=95)
        img_io.seek(0)
        
        logger.info("✅ Image generated successfully!")
        
        return send_file(
            img_io,
            mimetype='image/png',
            as_attachment=False,
            download_name=f'bouquet_{timestamp}.png'
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating image: {str(e)}")
        return jsonify({
            "error": str(e),
            "status": "failed"
        }), 500


@app.route('/models', methods=['GET'])
def list_models():
    """List available Stable Diffusion models (for future expansion)."""
    models = [
        {
            "id": "runwayml/stable-diffusion-v1-5",
            "name": "Stable Diffusion 1.5",
            "description": "Fast and reliable, good for general use"
        },
        {
            "id": "stabilityai/stable-diffusion-2-1",
            "name": "Stable Diffusion 2.1",
            "description": "Improved quality, slightly slower"
        },
        {
            "id": "stabilityai/stable-diffusion-xl-base-1.0",
            "name": "Stable Diffusion XL",
            "description": "Best quality, requires more VRAM"
        }
    ]
    return jsonify({"models": models})


if __name__ == '__main__':
    # Load model on startup
    logger.info("=" * 60)
    logger.info("🌸 Bexy Flowers AI Backend Server 🌸")
    logger.info("=" * 60)
    load_model()
    
    # Start Flask server
    logger.info("Starting Flask server on http://localhost:5000")
    logger.info("Press CTRL+C to stop the server")
    logger.info("=" * 60)
    
    app.run(
        host='0.0.0.0',  # Allow external connections
        port=5000,
        debug=False,  # Set to True for development
        threaded=True
    )

