@echo off
echo ========================================================
echo   Property Hub - GitHub Deployment Script
echo ========================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Git is not currently installed on your computer.
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo After installing Git, re-run this script.
    echo.
    pause
    exit /b
)

echo [*] Initializing Git repository...
git init

echo [*] Staging all project files...
git add .

echo [*] Creating commit...
git commit -m "Deploy Property Hub Real Estate Website"

echo.
echo ========================================================
echo   Next Steps to Connect with Your GitHub Account:
echo ========================================================
echo 1. Go to https://github.com/new and create a new repository (e.g. 'property-hub')
echo 2. Run the following two commands:
echo.
echo    git branch -M main
echo    git remote add origin https://github.com/YOUR_USERNAME/property-hub.git
echo    git push -u origin main
echo.
echo 3. In your GitHub repository:
echo    Go to Settings -> Pages -> Source -> Select 'GitHub Actions'
echo    Your website will be live in 60 seconds!
echo ========================================================
echo.
pause
