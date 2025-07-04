import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Checking frontend build...');

const distPath = path.join(process.cwd(), 'Frontend', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.log('Frontend not built, building now...');
  try {
    // Install frontend dependencies
    execSync('cd Frontend && npm install', { stdio: 'inherit' });
    
    // Build frontend
    execSync('cd Frontend && npm run build', { stdio: 'inherit' });
    
    console.log('✅ Frontend built successfully!');
  } catch (error) {
    console.error('❌ Failed to build frontend:', error.message);
  }
} else {
  console.log('✅ Frontend already built');
}

// Start the main application
console.log('Starting server...');
import('./index.js'); 