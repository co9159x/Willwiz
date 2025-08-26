#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting custom build script for Netlify...');

// Check if we're on Netlify
const isNetlify = process.env.NETLIFY === 'true';
console.log(`📦 Environment: ${isNetlify ? 'Netlify' : 'Local'}`);

// Check if DATABASE_URL is available
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.log('⚠️  No DATABASE_URL found, using fallback for build...');
  // Set a dummy database URL for build time
  process.env.DATABASE_URL = 'file:./dev.db';
}

try {
  // Step 1: Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      PRISMA_TELEMETRY_DISABLED: '1',
      PRISMA_GENERATE_DATAPROXY: 'true'
    }
  });
  console.log('✅ Prisma client generated successfully');

  // Step 2: Run Next.js build
  console.log('🏗️  Running Next.js build...');
  execSync('npx next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      PRISMA_TELEMETRY_DISABLED: '1',
      PRISMA_GENERATE_DATAPROXY: 'true'
    }
  });
  console.log('✅ Next.js build completed successfully');

  console.log('🎉 Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
