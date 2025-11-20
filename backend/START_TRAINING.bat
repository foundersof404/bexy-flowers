@echo off
echo ============================================================
echo Starting Red Roses Test Training
echo ============================================================
echo.
echo This will train the AI on 10 red roses images
echo Training will run for 30 epochs (about 15-20 minutes)
echo.
echo Make sure you've run: python prepare_red_roses_test.py first
echo.
pause

cd /d "%~dp0"
venv\Scripts\python.exe train_model_test.py

pause
