#!/bin/bash
# Shell Script to Start Bexy Flowers Backend (macOS/Linux)
# ==========================================================

echo ""
echo "============================================================"
echo "       Starting Bexy Flowers AI Backend Server"
echo "============================================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ ERROR: Virtual environment not found!"
    echo ""
    echo "Please run setup first:"
    echo "  1. python3 -m venv venv"
    echo "  2. source venv/bin/activate"
    echo "  3. pip install -r requirements.txt"
    echo ""
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Failed to activate virtual environment!"
    exit 1
fi

echo ""
echo "Starting Flask server..."
echo ""

# Start the server
python server.py

# Deactivate when done
deactivate

