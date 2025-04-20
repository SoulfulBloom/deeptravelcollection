#!/bin/bash

# Cleanup script for Deep Travel Collections project
# This script identifies and removes redundant deployment files
# while preserving essential project structure

# Create a backup directory
echo "Creating backup directory..."
BACKUP_DIR="./deployment_scripts_backup"
mkdir -p $BACKUP_DIR

# Essential files that should NOT be removed
ESSENTIAL_FILES=(
  "index.js"
  "index.cjs"
  "deploy.js"
  "deploy.cjs"
  "server.js"
  "server.cjs"
  "prod-server.js"
  "vite.config.ts"
  "postcss.config.js"
  "tailwind.config.ts"
  "tsconfig.json"
  "tsconfig.node.json"
  "drizzle.config.ts"
  "package.json"
  "package-lock.json"
  ".env"
  ".env.example"
  "github-push.sh"
  "essential-backup.sh"
)

# Move redundant deployment files to backup
echo "Moving redundant deployment files to backup..."
for file in *.js *.cjs; do
  # Skip if file is in essential list
  if [[ " ${ESSENTIAL_FILES[*]} " =~ " ${file} " ]]; then
    echo "Keeping essential file: $file"
  else
    echo "Moving to backup: $file"
    mv "$file" "$BACKUP_DIR/" 2>/dev/null || true
  fi
done

# Move redundant shell scripts to backup
echo "Moving redundant shell scripts to backup..."
for file in *.sh; do
  # Skip essential scripts
  if [[ "$file" == "github-push.sh" || "$file" == "essential-backup.sh" || "$file" == "cleanup-project.sh" ]]; then
    echo "Keeping essential script: $file"
  else
    echo "Moving to backup: $file"
    mv "$file" "$BACKUP_DIR/" 2>/dev/null || true
  fi
done

echo "Creating a simplified deployment README..."
cat > DEPLOYMENT.md << 'EOF'
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
EOF

echo "Creating a simplified README file for the project..."
cat > README.md << 'EOF'
# Deep Travel Collections

An AI-powered premium travel platform for Canadian snowbirds, offering intelligent and personalized travel planning solutions with advanced recommendation capabilities.

## Key Technologies

- React.js with TypeScript
- Drizzle ORM for PostgreSQL integration
- OpenAI-powered recommendation engine
- Stripe payment integration
- Comprehensive deployment and server management infrastructure
- Responsive, mobile-first design with enhanced user interaction

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env` file:
   ```
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. For production build:
   ```
   npm run build
   npm run start
   ```

## Project Structure

- `client/src` - React frontend application
- `server` - Express backend server
- `shared` - Shared types and utilities
- `public` - Static assets

## Database

PostgreSQL database with Drizzle ORM. Run migrations with:
```
npm run db:push
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.
EOF

echo "Cleanup completed successfully!"
echo "Redundant files have been moved to: $BACKUP_DIR"
echo "Check DEPLOYMENT.md and README.md for simplified documentation."