@echo off
REM Windows Batch Script to Start Bexy Flowers Backend
REM ===================================================

echo.
echo ============================================================
echo         Starting Bexy Flowers AI Backend Server
echo ============================================================
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo.
    echo Please run setup first:
    echo   1. python -m venv venv
    echo   2. venv\Scripts\activate
    echo   3. pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if activation succeeded
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b 1
)

echo.
echo Starting Flask server...
echo.

REM Start the server
python server.py

REM If server stops, pause to see any error messages
if errorlevel 1 (
    echo.
    echo ERROR: Server crashed or failed to start!
    echo Check the error messages above.
    pause
)

deactivate

