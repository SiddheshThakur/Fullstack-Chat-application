#!/bin/bash
echo "Starting build process..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd Frontend
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Check if build was successful
if [ -f "dist/index.html" ]; then
    echo "✅ Frontend build completed successfully!"
    echo "Dist folder location: $(pwd)/dist"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

cd ..
echo "Build process completed!" 