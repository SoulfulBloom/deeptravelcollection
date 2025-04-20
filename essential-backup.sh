#!/bin/bash

# Essential Backup Script for Deep Travel Collections
# This script creates a new repository with just the essential code

# Set colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if the token is provided
if [ -z "$1" ]; then
  echo "Error: GitHub token not provided."
  echo "Usage: ./essential-backup.sh YOUR_GITHUB_TOKEN"
  exit 1
fi

TOKEN=$1
REPO_URL="https://$TOKEN@github.com/SoulfulBloom/deeptravelcollection.git"

echo -e "${GREEN}Creating Essential Backup for Deep Travel Collections${NC}"
echo -e "${BLUE}==============================================${NC}"

# Create temporary directory
TEMP_DIR="essential_code_backup"
mkdir -p $TEMP_DIR
cd $TEMP_DIR

# Initialize a new git repository
echo "Initializing a new Git repository..."
git init

# Copy essential files
echo "Copying essential files..."

# Create directory structure
mkdir -p client/src
mkdir -p server
mkdir -p shared
mkdir -p public

# Copy the core files from the main project
echo "Copying client code..."
cp -r ../client/src/* client/src/

echo "Copying server code..."
cp -r ../server/* server/

echo "Copying shared code..."
cp -r ../shared/* shared/

echo "Copying configuration files..."
cp ../package.json .
cp ../tsconfig.json .
cp ../vite.config.ts .
cp ../drizzle.config.ts .
cp ../tailwind.config.ts .
cp ../theme.json .
cp ../.env.example .
cp ../README.md .
cp ../MODULE_SYSTEM_FIX.md .
cp ../DEPLOYMENT.md .

# Create .gitignore
cat > .gitignore << EOF
# Dependency directories
node_modules/

# Local environment files
.env

# Build outputs
dist/
build/

# Logs
*.log

# Temporary files
tmp/
temp/
EOF

# Configure git
git config --global user.name "SoulfulBloom"
git config --global user.email "your-email@example.com"

# Add files to git
echo "Adding files to Git..."
git add .

# Commit files
echo "Committing files..."
git commit -m "Essential backup of Deep Travel Collections"

# Add remote
echo "Adding remote repository..."
git remote add origin $REPO_URL

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main --force

echo -e "${GREEN}Essential backup pushed to GitHub!${NC}"
echo -e "Repository URL: ${BLUE}https://github.com/SoulfulBloom/deeptravelcollection${NC}"