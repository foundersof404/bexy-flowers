"""
Bexy Flowers - Fine-Tune Stable Diffusion Model
================================================

This script fine-tunes Stable Diffusion on your flower images using LoRA (Low-Rank Adaptation).
The result: AI that generates images in YOUR EXACT STYLE!

Author: AI Assistant
Date: 2025
"""

import os
import torch
import numpy as np
from diffusers import StableDiffusionPipeline, DDPMScheduler
from peft import LoraConfig, get_peft_model, PeftModel
from transformers import CLIPTokenizer
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import json
from pathlib import Path
from tqdm import tqdm
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
TRAINING_CONFIG = {
    "model_id": "runwayml/stable-diffusion-v1-5",
    "training_images_dir": "training_data/images",
    "captions_file": "training_data/captions.json",
    "output_dir": "fine_tuned_model",
    "lora_rank": 4,  # LoRA rank (4, 8, or 16)
    "learning_rate": 1e-4,
    "num_epochs": 100,
    "batch_size": 1,
    "gradient_accumulation_steps": 4,
    "save_every": 10,
    "resolution": 512,  # Training resolution
    "device": "cuda" if torch.cuda.is_available() else "cpu"
}


class BexyFlowersDataset(Dataset):
    """Dataset for Bexy Flowers training images."""
    
    def __init__(self, images_dir, captions_file, resolution=512):
        self.images_dir = Path(images_dir)
        self.resolution = resolution
        
        # Load captions
        with open(captions_file, 'r', encoding='utf-8') as f:
            self.captions = json.load(f)
        
        # Get all image files
        self.image_files = []
        for img_file in self.images_dir.glob("*.jpg"):
            if img_file.stem in self.captions:
                self.image_files.append(img_file)
        for img_file in self.images_dir.glob("*.png"):
            if img_file.stem in self.captions:
                self.image_files.append(img_file)
        
        logger.info(f"Found {len(self.image_files)} training images")
    
    def __len__(self):
        return len(self.image_files)
    
    def __getitem__(self, idx):
        img_path = self.image_files[idx]
        caption = self.captions[img_path.stem]
        
        # Load and preprocess image
        image = Image.open(img_path).convert("RGB")
        
        # Resize to training resolution
        image = image.resize((self.resolution, self.resolution), Image.LANCZOS)
        
        # Convert to tensor
        image = torch.from_numpy(np.array(image)).float() / 127.5 - 1.0
        image = image.permute(2, 0, 1)
        
        return {
            "image": image,
            "caption": caption
        }


def setup_lora_with_peft(unet, lora_rank=4):
    """Setup LoRA using PEFT library (modern approach)."""
    
    # Configure LoRA
    lora_config = LoraConfig(
        r=lora_rank,  # LoRA rank
        lora_alpha=lora_rank,  # LoRA alpha (usually same as rank)
        init_lora_weights="gaussian",
        target_modules=[
            "to_k",
            "to_q",
            "to_v",
            "to_out.0",
            "proj_in",
            "proj_out",
            "ff.net.0.proj",
            "ff.net.2",
            "conv1",
            "conv2",
            "conv_shortcut",
            "time_emb_proj",
        ],
    )
    
    # Apply LoRA to UNet
    unet = get_peft_model(unet, lora_config)
    
    logger.info("LoRA layers successfully added using PEFT!")
    unet.print_trainable_parameters()
    
    return unet


def train_bexy_flowers_model():
    """Main training function."""
    
    logger.info("=" * 60)
    logger.info("Bexy Flowers Model Fine-Tuning")
    logger.info("=" * 60)
    
    config = TRAINING_CONFIG
    device = config["device"]
    
    # Create directories
    os.makedirs(config["training_images_dir"], exist_ok=True)
    os.makedirs(config["output_dir"], exist_ok=True)
    
    logger.info(f"Using device: {device}")
    
    # Load base model
    logger.info(f"Loading base model: {config['model_id']}")
    pipeline = StableDiffusionPipeline.from_pretrained(
        config["model_id"],
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        safety_checker=None
    )
    
    unet = pipeline.unet
    vae = pipeline.vae
    text_encoder = pipeline.text_encoder
    tokenizer = pipeline.tokenizer
    noise_scheduler = DDPMScheduler.from_pretrained(config["model_id"], subfolder="scheduler")
    
    # Move to device
    vae.to(device)
    text_encoder.to(device)
    
    # Setup LoRA using PEFT
    logger.info(f"Setting up LoRA layers (rank={config['lora_rank']})")
    unet = setup_lora_with_peft(unet, config["lora_rank"])
    unet.to(device)
    
    # Freeze non-LoRA parameters (PEFT handles this automatically)
    vae.requires_grad_(False)
    text_encoder.requires_grad_(False)
    
    # Setup optimizer (only LoRA parameters)
    trainable_params = [p for p in unet.parameters() if p.requires_grad]
    optimizer = torch.optim.AdamW(
        trainable_params,
        lr=config["learning_rate"]
    )
    
    # Load dataset
    logger.info("Loading training dataset...")
    try:
        dataset = BexyFlowersDataset(
            config["training_images_dir"],
            config["captions_file"],
            resolution=config["resolution"]
        )
        
        dataloader = DataLoader(
            dataset,
            batch_size=config["batch_size"],
            shuffle=True,
            num_workers=0
        )
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")
        logger.info("\n" + "=" * 60)
        logger.info("SETUP REQUIRED:")
        logger.info("=" * 60)
        logger.info(f"1. Add your flower images to: {config['training_images_dir']}/")
        logger.info(f"2. Create captions file: {config['captions_file']}")
        logger.info("\nSee TRAINING_GUIDE.md for detailed instructions!")
        logger.info("=" * 60)
        return
    
    # Training loop
    logger.info("=" * 60)
    logger.info("Starting training...")
    logger.info(f"Epochs: {config['num_epochs']}")
    logger.info(f"Batch size: {config['batch_size']}")
    logger.info(f"Gradient accumulation: {config['gradient_accumulation_steps']}")
    logger.info("=" * 60)
    
    global_step = 0
    
    for epoch in range(config["num_epochs"]):
        logger.info(f"\nEpoch {epoch + 1}/{config['num_epochs']}")
        
        progress_bar = tqdm(dataloader, desc=f"Training")
        
        for step, batch in enumerate(progress_bar):
            # Get batch
            images = batch["image"].to(device, dtype=torch.float16 if device == "cuda" else torch.float32)
            captions = batch["caption"]
            
            # Encode images to latent space
            with torch.no_grad():
                latents = vae.encode(images).latent_dist.sample()
                latents = latents * vae.config.scaling_factor
            
            # Add noise
            noise = torch.randn_like(latents)
            timesteps = torch.randint(
                0, 
                noise_scheduler.config.num_train_timesteps,
                (latents.shape[0],), 
                device=device
            ).long()
            noisy_latents = noise_scheduler.add_noise(latents, noise, timesteps)
            
            # Encode text
            text_inputs = tokenizer(
                captions,
                padding="max_length",
                max_length=tokenizer.model_max_length,
                truncation=True,
                return_tensors="pt"
            )
            
            with torch.no_grad():
                text_embeddings = text_encoder(text_inputs.input_ids.to(device))[0]
            
            # Predict noise
            noise_pred = unet(
                noisy_latents,
                timesteps,
                encoder_hidden_states=text_embeddings
            ).sample
            
            # Calculate loss
            loss = torch.nn.functional.mse_loss(noise_pred, noise)
            
            # Backpropagation
            loss.backward()
            
            if (step + 1) % config["gradient_accumulation_steps"] == 0:
                optimizer.step()
                optimizer.zero_grad()
                global_step += 1
            
            progress_bar.set_postfix({"loss": f"{loss.item():.4f}"})
        
        # Save checkpoint
        if (epoch + 1) % config["save_every"] == 0:
            checkpoint_dir = Path(config["output_dir"]) / f"checkpoint-{epoch + 1}"
            checkpoint_dir.mkdir(parents=True, exist_ok=True)
            
            # Save using PEFT's built-in save method
            unet.save_pretrained(checkpoint_dir)
            logger.info(f"Saved checkpoint to {checkpoint_dir}")
    
    # Save final model
    logger.info("\n" + "=" * 60)
    logger.info("Training complete! Saving final model...")
    final_dir = Path(config["output_dir"]) / "final"
    final_dir.mkdir(parents=True, exist_ok=True)
    
    # Save using PEFT
    unet.save_pretrained(final_dir)
    
    # Save config
    with open(final_dir / "training_config.json", "w") as f:
        json.dump(config, f, indent=2)
    
    logger.info(f"Final model saved to {final_dir}")
    logger.info("=" * 60)
    logger.info("Training complete!")
    logger.info("\nTo use your fine-tuned model:")
    logger.info("1. Update server.py to load LoRA weights")
    logger.info("2. Restart the backend server")
    logger.info("3. Generate images with your custom style!")
    logger.info("=" * 60)


if __name__ == "__main__":
    train_bexy_flowers_model()

