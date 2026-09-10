# Azure App Service Deployment Script (Windows)
# This script runs BEFORE deployment to build the app locally
# Run: .\scripts\deploy.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Pre-deployment Build Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
yarn install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Install failed!" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "Building Vite application..." -ForegroundColor Yellow
yarn run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "dist/ folder is ready for Azure deployment" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Commit and push to your repository" -ForegroundColor White
    Write-Host "2. Azure will deploy and run: yarn start" -ForegroundColor White
    exit 0
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
