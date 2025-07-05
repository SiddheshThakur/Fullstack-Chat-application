#!/bin/bash

echo "🚀 Setting up PDF Generation System..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd Backend
npm install --no-optional --no-audit --no-fund

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../Frontend
npm install --no-optional --no-audit --no-fund

# Go back to root
cd ..

# Install test dependencies
echo "📦 Installing test dependencies..."
npm install jspdf pdf-lib --no-optional --no-audit --no-fund

# Run the PDF generation test
echo "🧪 Running PDF generation test..."
node test-pdf-generation.js

echo "✅ Setup complete!"