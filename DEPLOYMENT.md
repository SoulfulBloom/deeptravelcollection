# Deep Travel Collections Deployment Guide

## Project Structure

This project uses a dual-mode deployment system to handle both ESM and CommonJS module systems:

- **ESM (ES Modules)**: Modern JavaScript module system used by the main application
- **CommonJS**: Legacy module system used by some deployment processes

## Key Files

- `index.js` - Main ESM entry point
- `index.cjs` - CommonJS entry point for Replit
- `deploy.js` - ESM deployment script
- `deploy.cjs` - CommonJS deployment script
- `server.js` - ESM server file
- `server.cjs` - CommonJS server file

## Deployment Process

1. Ensure all required environment variables are set:
   - `DATABASE_URL` - PostgreSQL connection string
   - `OPENAI_API_KEY` - OpenAI API key
   - `STRIPE_SECRET_KEY` - Stripe secret key
   - `VITE_STRIPE_PUBLIC_KEY` - Stripe public key (for client)

2. Build the application:
   ```
   npm run build
   ```

3. Start the production server:
   ```
   npm run start
   ```

## Replit Deployment

Replit will use the `index.cjs` file as the entry point for deployment.

## Backup Process

Use the `github-push.sh` script to back up essential code to GitHub:
```
./github-push.sh
```

This will push the core application code, excluding large assets and temporary files.
