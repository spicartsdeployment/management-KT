#!/bin/bash
# Azure App Service Deployment Script
# This script runs BEFORE deployment to build the app locally
# Place in root directory and configure in Azure

echo "================================"
echo "Pre-deployment Build Script"
echo "================================"

# Install dependencies
echo "Installing dependencies..."
yarn install

# Build the application
echo "Building Vite application..."
yarn run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "dist/ folder is ready for Azure deployment"
    exit 0
else
    echo "❌ Build failed!"
    exit 1
fi
