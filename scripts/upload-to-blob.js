#!/usr/bin/env node

/**
 * Upload files/ directory to Vercel Blob Storage
 * 
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=<token> node scripts/upload-to-blob.js
 * 
 * Get token from: https://vercel.com/dashboard/stores/blob
 */

const { put, list } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

const FILES_DIR = path.join(__dirname, '..', 'files');
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB per file limit

async function getAllFiles(dir, baseDir = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getAllFiles(fullPath, baseDir);
      } else {
        const relativePath = path.relative(baseDir, fullPath);
        return { path: fullPath, relativePath };
      }
    })
  );
  return files.flat();
}

async function uploadFile(filePath, relativePath) {
  try {
    const stats = await stat(filePath);
    
    if (stats.size > MAX_FILE_SIZE) {
      console.warn(`⚠️  Skipping ${relativePath} (${(stats.size / 1024 / 1024).toFixed(2)}MB exceeds 500MB limit)`);
      return null;
    }

    const content = await readFile(filePath);
    const blob = await put(`files/${relativePath}`, content, {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log(`✅ Uploaded: ${relativePath} -> ${blob.url}`);
    return blob;
  } catch (error) {
    console.error(`❌ Failed to upload ${relativePath}:`, error.message);
    return null;
  }
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is required');
    console.error('Get your token from: https://vercel.com/dashboard/stores/blob');
    process.exit(1);
  }

  console.log('📦 Starting upload to Vercel Blob Storage...\n');
  console.log(`📂 Source directory: ${FILES_DIR}\n`);

  const files = await getAllFiles(FILES_DIR);
  console.log(`Found ${files.length} files to upload\n`);

  const results = [];
  for (const { path: filePath, relativePath } of files) {
    const result = await uploadFile(filePath, relativePath);
    if (result) {
      results.push(result);
    }
  }

  console.log('\n✨ Upload complete!');
  console.log(`Uploaded ${results.length} of ${files.length} files`);
  
  // Save manifest
  const manifest = {
    uploadDate: new Date().toISOString(),
    files: results.map(r => ({
      pathname: r.pathname,
      url: r.url,
      size: r.size,
    })),
  };
  
  const manifestPath = path.join(__dirname, 'blob-manifest.json');
  await promisify(fs.writeFile)(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📄 Manifest saved to: ${manifestPath}`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
