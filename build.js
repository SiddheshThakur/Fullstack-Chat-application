import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting build process...');

try {
  // Install frontend dependencies
  console.log('Installing frontend dependencies...');
  execSync('cd Frontend && npm install', { stdio: 'inherit' });
  
  // Build frontend
  console.log('Building frontend...');
  execSync('cd Frontend && npm run build', { stdio: 'inherit' });
  
  // Check if dist folder exists
  const distPath = path.join(process.cwd(), 'Frontend', 'dist');
  if (fs.existsSync(distPath)) {
    console.log('✅ Frontend build completed successfully!');
    console.log('Dist folder location:', distPath);
  } else {
    console.log('❌ Frontend dist folder not found!');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 