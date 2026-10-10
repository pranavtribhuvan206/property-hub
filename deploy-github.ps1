# Property Hub - GitHub Deployment Script (PowerShell)
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Property Hub - GitHub Deployment Script" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitInstalled) {
    Write-Host "`n[!] Git is not currently installed or found in your PATH." -ForegroundColor Red
    Write-Host "`nYou have two quick options:" -ForegroundColor Yellow
    Write-Host "1. Install Git for Windows: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Use GitHub Desktop: https://desktop.github.com" -ForegroundColor White
    Write-Host "`nProject folder location:" -ForegroundColor Cyan
    Write-Host "C:\Users\SAINATH\.gemini\antigravity\scratch\luxury-real-estate`n" -ForegroundColor Green
    return
}

Write-Host "`n[*] Initializing Git repository..." -ForegroundColor Cyan
git init

Write-Host "[*] Staging files..." -ForegroundColor Cyan
git add .

Write-Host "[*] Creating initial commit..." -ForegroundColor Cyan
git commit -m "Deploy Property Hub Real Estate Website"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "Repository initialized successfully!" -ForegroundColor Green
Write-Host "To push to your GitHub account, run:" -ForegroundColor Yellow
Write-Host "  git branch -M main" -ForegroundColor White
Write-Host "  git remote add origin https://github.com/<YOUR_USERNAME>/property-hub.git" -ForegroundColor White
Write-Host "  git push -u origin main" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Green
