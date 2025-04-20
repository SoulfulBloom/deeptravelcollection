# Deep Travel Collections - Migration Guide

This guide provides step-by-step instructions for migrating your Deep Travel Collections app from Replit to another hosting platform.

## Step 1: Prepare Your Codebase

Run the cleanup script to remove Replit-specific dependencies:

```bash
./cleanup-replit-files.sh
```

This script will:
- Remove Replit configuration files (.replit, .replit.template, etc.)
- Remove Replit-specific dependencies from package.json
- Create backups of modified files

## Step 2: Use the Platform-Independent Vite Configuration

```bash
# Backup the original config
cp vite.config.ts vite.config.ts.backup

# Replace with platform-independent version
cp platform-independent-vite.config.ts vite.config.ts
```

## Step 3: Verify Platform Independence

Run the verification script to check for any remaining Replit references:

```bash
./verify-platform-independence.sh
```

Address any issues found by the script.

## Step 4: Update Environment Variables

Your application requires these environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: For AI-powered itinerary generation
- `STRIPE_SECRET_KEY`: For payment processing
- `VITE_STRIPE_PUBLIC_KEY`: For Stripe Elements in the frontend

## Step 5: Choose a Hosting Platform

### Recommended Options:

#### Vercel
- **Pros**: Great for React apps, free tier, easy deployment
- **Setup**: 
  1. Push code to GitHub
  2. Import repository in Vercel dashboard
  3. Configure environment variables
  4. Deploy

#### Render
- **Pros**: Supports both web services and PostgreSQL
- **Setup**:
  1. Create web service pointing to your GitHub repo
  2. Create PostgreSQL instance
  3. Link database to web service
  4. Configure environment variables
  5. Deploy

#### Digital Ocean App Platform
- **Pros**: More control, managed database options
- **Setup**:
  1. Create app from GitHub repo
  2. Add PostgreSQL component
  3. Configure environment variables
  4. Deploy

## Step 6: Set Up Database

For each platform:

### Vercel + Neon Database
1. Create Neon PostgreSQL account
2. Create new database
3. Copy connection string to Vercel environment variables

### Render
1. Create PostgreSQL service
2. Copy internal connection string to your web service

### Digital Ocean
1. Create managed database
2. Link database to app
3. Environment variables are automatically configured

## Step 7: Deployment

1. Push your code to GitHub
2. Connect your repository to chosen platform
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist/public`
   - Install command: `npm install`
4. Set environment variables
5. Deploy

## Step 8: Verify Your Deployment

1. Check that the application loads correctly
2. Test all major features:
   - Content browsing
   - PDF generation
   - Payment processing
   - User authentication

## Step 9: Set Up Monitoring and Maintenance

1. Set up uptime monitoring
2. Configure database backups
3. Set up log monitoring
4. Configure CI/CD pipeline for future updates

## Backup Strategy

Continue using your backup scripts to maintain backups of:
- Core code (`github-push.sh`)
- PDF documents (`backup-important-pdfs.sh`)
- Assets (`assets-backup.sh`)
- Data files (`backup-data-files.sh`)

Run these periodically or after significant changes.

## Troubleshooting Common Issues

### Database Connection Problems
- Check connection string format
- Verify IP whitelisting/security settings
- Test connection using `psql` or similar tool

### Missing Assets
- Verify assets are properly copied during build
- Check paths and aliases in vite.config.ts
- Ensure public directory is properly served

### Stripe Integration Issues
- Verify Stripe keys are correctly set
- Check webhook endpoints are updated
- Test payment flow in development mode