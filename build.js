import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting build process...');

try {
  // Use npm ci if lockfile exists, else fallback to npm install
  const hasLockfile = fs.existsSync(path.join(process.cwd(), 'Frontend', 'package-lock.json'));
  const installCmd = hasLockfile
    ? 'cd Frontend && npm ci'
    : 'cd Frontend && npm install';

  console.log('Installing frontend dependencies...');
  execSync(installCmd, { stdio: 'inherit' });

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