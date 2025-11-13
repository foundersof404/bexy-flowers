"""
Test script for Bexy Flowers AI Backend
========================================

This script tests if your backend is properly configured and working.

Run: python test_backend.py
"""

import sys
import requests
import json
from pathlib import Path

# Colors for terminal output
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
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.END}")


def test_imports():
    """Test if all required packages are installed."""
    print_header("Testing Python Packages")
    
    required_packages = [
        ('flask', 'Flask'),
        ('flask_cors', 'Flask-CORS'),
        ('torch', 'PyTorch'),
        ('diffusers', 'Diffusers'),
        ('transformers', 'Transformers'),
        ('PIL', 'Pillow'),
    ]
    
    all_good = True
    for module_name, display_name in required_packages:
        try:
            __import__(module_name)
            print_success(f"{display_name} installed")
        except ImportError:
            print_error(f"{display_name} NOT installed")
            all_good = False
    
    return all_good


def test_cuda():
    """Test CUDA availability."""
    print_header("Testing GPU/CUDA")
    
    try:
        import torch
        
        if torch.cuda.is_available():
            print_success(f"CUDA available! GPU: {torch.cuda.get_device_name(0)}")
            print_info(f"CUDA Version: {torch.version.cuda}")
            print_info(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
            return True
        else:
            print_warning("CUDA not available - will use CPU (slower)")
            print_info("This is OK, but generation will take 1-3 minutes per image")
            return True
    except Exception as e:
        print_error(f"Error checking CUDA: {str(e)}")
        return False


def test_server_running():
    """Test if the server is running."""
    print_header("Testing Server Connection")
    
    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Server is running!")
            print_info(f"Status: {data.get('status')}")
            print_info(f"Model loaded: {data.get('model_loaded')}")
            print_info(f"Device: {data.get('device')}")
            return True
        else:
            print_error(f"Server returned status code: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print_error("Can't connect to server!")
        print_warning("Make sure server.py is running:")
        print_info("   python server.py")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


def test_image_generation():
    """Test actual image generation."""
    print_header("Testing Image Generation")
    
    print_info("Generating a simple test image...")
    print_info("This will take 5-10 seconds on GPU, 1-2 minutes on CPU...")
    
    # Simple test request
    test_data = {
        "packaging_type": "box",
        "box_color": "red",
        "box_shape": "heart",
        "flowers": [
            {"type": "roses", "color": "red", "quantity": 5}
        ],
        "accessories": [],
        "glitter": False,
        "refinement": "",
        "steps": 20,  # Faster for testing
        "guidance": 7.5
    }
    
    try:
        response = requests.post(
            'http://localhost:5000/generate',
            json=test_data,
            timeout=300  # 5 minute timeout
        )
        
        if response.status_code == 200:
            # Save test image
            output_path = Path("test_output.png")
            output_path.write_bytes(response.content)
            
            print_success("Image generated successfully!")
            print_info(f"Saved to: {output_path.absolute()}")
            print_info(f"Image size: {len(response.content) / 1024:.1f} KB")
            return True
        else:
            print_error(f"Generation failed with status: {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print_error("Generation timed out (>5 minutes)")
        print_warning("This might be normal on CPU. Try again or check server logs.")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


def main():
    """Run all tests."""
    print_header("🌸 Bexy Flowers Backend Test Suite 🌸")
    
    print_info("This will test your backend setup and generate a test image.\n")
    
    results = []
    
    # Test 1: Packages
    results.append(("Python Packages", test_imports()))
    
    # Test 2: CUDA
    results.append(("GPU/CUDA", test_cuda()))
    
    # Test 3: Server
    server_ok = test_server_running()
    results.append(("Server Connection", server_ok))
    
    # Test 4: Generation (only if server is running)
    if server_ok:
        results.append(("Image Generation", test_image_generation()))
    else:
        print_warning("\nSkipping image generation test (server not running)")
        print_info("Start the server first: python server.py")
    
    # Summary
    print_header("Test Summary")
    
    all_passed = True
    for test_name, passed in results:
        if passed:
            print_success(f"{test_name}: PASSED")
        else:
            print_error(f"{test_name}: FAILED")
            all_passed = False
    
    print()
    
    if all_passed:
        print_success("🎉 All tests passed! Your backend is ready!")
        print_info("\nNext steps:")
        print_info("1. Check test_output.png to see the generated image")
        print_info("2. Connect your frontend (see FRONTEND_INTEGRATION.md)")
        print_info("3. Start creating beautiful flower bouquets! 🌸")
    else:
        print_error("❌ Some tests failed. Please fix the issues above.")
        print_info("\nCommon fixes:")
        print_info("- Missing packages? Run: pip install -r requirements.txt")
        print_info("- Server not running? Run: python server.py")
        print_info("- Check README.md for detailed setup instructions")
    
    print()
    return 0 if all_passed else 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Test interrupted by user.{Colors.END}")
        sys.exit(1)

