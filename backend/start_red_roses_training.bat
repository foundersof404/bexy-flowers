@echo off
echo ============================================================
echo Red Roses Test Training
echo ============================================================
echo.

REM Change to the script's directory
cd /d "%~dp0"

echo Current directory: %CD%
echo.

REM Check if venv exists
if not exist "venv\Scripts\python.exe" (
    echo ERROR: Virtual environment not found!
    echo Please make sure you're in the backend directory.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting training...
echo This will train on 10 red roses images for 30 epochs
echo Estimated time: 15-20 minutes
echo.
echo Press Ctrl+C to stop training
echo.

python train_model_test.py

echo.
echo Training completed or stopped.
pause



