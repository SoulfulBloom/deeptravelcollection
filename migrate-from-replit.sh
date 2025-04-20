#!/bin/bash

# Comprehensive migration script from Replit to platform-independent setup
# This script removes all Replit-specific configurations and dependencies

echo "Deep Travel Collections - Migration from Replit"
echo "=============================================="

# Check if running from the project root directory
if [ ! -f "package.json" ]; then
  echo "Error: This script must be run from the project root directory"
  echo "Please navigate to the root directory and try again"
  exit 1
fi

# Create a migration log
LOG_FILE="migration-log-$(date +%Y%m%d%H%M%S).txt"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "Starting migration at $(date)"
echo "Creating backup directory..."

# Create backup directory
BACKUP_DIR="replit-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup Replit-specific files
echo "Backing up Replit-specific files..."
cp -v .replit "$BACKUP_DIR/" 2>/dev/null || true
cp -v .replit.template "$BACKUP_DIR/" 2>/dev/null || true
cp -v .replit.commonjs "$BACKUP_DIR/" 2>/dev/null || true
cp -v replit.nix "$BACKUP_DIR/" 2>/dev/null || true
cp -v run "$BACKUP_DIR/" 2>/dev/null || true
cp -v package.json "$BACKUP_DIR/"
cp -v vite.config.ts "$BACKUP_DIR/"

# Remove Replit-specific files
echo "Removing Replit-specific files..."
rm -fv .replit .replit.template .replit.commonjs replit.nix run

# Replace package.json with cleaned version
echo "Updating package.json to remove Replit dependencies..."
cp -v clean-package.json package.json

# Replace vite.config.ts with platform-independent version
echo "Updating vite.config.ts to remove Replit plugins..."
cp -v platform-independent-vite.config.ts vite.config.ts

# Install dependencies
echo "Installing dependencies with new configuration..."
npm install

# Verify changes
echo "Verifying changes..."
./verify-platform-independence.sh

# Create vercel.json for Vercel deployment (if needed)
echo "Creating deployment configuration files..."
cat > vercel.json << 'EOL'
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "dist/public/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/public/$1"
    }
  ]
}
EOL

# Create netlify.toml for Netlify deployment (if needed)
cat > netlify.toml << 'EOL'
[build]
  command = "npm run build"
  publish = "dist/public"
  functions = "dist/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOL

# Create render.yaml for Render deployment (if needed)
cat > render.yaml << 'EOL'
services:
  - type: web
    name: deep-travel-collections
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: STRIPE_SECRET_KEY
        sync: false
      - key: VITE_STRIPE_PUBLIC_KEY
        sync: false

databases:
  - name: deep-travel-db
    databaseName: deep_travel
    user: deep_travel_user
EOL

echo "Migration completed at $(date)"
echo ""
echo "Next steps:"
echo "1. Test the application locally"
echo "  - Run: npm run dev"
echo "2. Deploy to your preferred platform"
echo "  - Vercel: vercel --prod"
echo "  - Render: Use the render.yaml file"
echo "  - Netlify: Use the netlify.toml file"
echo ""
echo "Migration log has been saved to: $LOG_FILE"
echo "Replit backup files have been saved to: $BACKUP_DIR"