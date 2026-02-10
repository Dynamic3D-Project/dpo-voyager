# Vercel Blob Storage Setup

This document explains how to configure and use Vercel Blob Storage for the `files/` directory to reduce deployment source size.

## Overview

The `files/` directory (~2GB) is stored in Vercel Blob Storage instead of being included in the deployment source. A serverless function proxies requests to serve files from the blob store.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @vercel/blob
```

### 2. Create Blob Store

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Blob**
3. Create a new Blob Store (if not already created)
4. Copy the **Read-Write Token**

### 3. Upload Files to Blob Storage

Set the blob token as an environment variable and run the upload script:

```bash
BLOB_READ_WRITE_TOKEN=your_token_here npm run upload-blob
```

This will:
- Upload all files from `files/` directory to Vercel Blob
- Create a manifest file at `scripts/blob-manifest.json`
- Show upload progress and results

### 4. Configure Environment Variables

In your Vercel project settings, add the following environment variables:

- **BLOB_READ_WRITE_TOKEN**: Your blob store read-write token (for uploads)
- **BLOB_BASE_URL**: Your blob store URL (usually auto-set by Vercel)

Alternatively, Vercel automatically provides `VERCEL_BLOB_STORE_URL` which is used by default.

## How It Works

1. **Build Time**: The `files/` directory is excluded from deployment via `.vercelignore`
2. **Runtime**: Requests to `/files/*` are rewritten to `/api/files/*` (serverless function)
3. **Serverless Function**: The API route fetches and streams files from Vercel Blob Storage
4. **Caching**: Proper cache headers ensure optimal performance

## File Access

Files are accessible at the same paths:
- `/files/models/chair/model.glb` → served from Blob Storage
- `/files/DISCLAIMER.txt` → served from Blob Storage

## Updating Files

To update files in the blob store:

```bash
BLOB_READ_WRITE_TOKEN=your_token_here npm run upload-blob
```

The script will overwrite existing files with the same path.

## Local Development

For local development, the `files/` directory is still present and served directly by the development server. The blob storage is only used in production Vercel deployments.

## Benefits

- **Reduced deployment size**: 2GB → excluded from git and deployment
- **Faster deployments**: Less data to transfer on each deploy
- **Better performance**: CDN-backed blob storage with global distribution
- **Cost effective**: Pay only for storage and bandwidth used

## Troubleshooting

**Files not loading:**
1. Check that environment variables are set correctly
2. Verify files were uploaded: check `scripts/blob-manifest.json`
3. Check Vercel function logs for errors

**Upload fails:**
1. Ensure `BLOB_READ_WRITE_TOKEN` is valid
2. Check file sizes (max 500MB per file)
3. Verify network connectivity

## Alternative: Direct Blob URLs

Instead of proxying through a serverless function, you can also update your application code to fetch directly from blob URLs stored in the manifest file. This approach is faster but requires code changes.
