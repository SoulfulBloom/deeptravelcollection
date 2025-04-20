#!/bin/bash

# GitHub Push Script for Deep Travel Collections
# This script pushes essential code to GitHub

echo "GitHub Push Script for Deep Travel Collections"
echo "=============================================="

# Check if the token is provided
if [ -z "$1" ]; then
  echo "Error: GitHub token not provided."
  echo "Usage: ./github-push.sh YOUR_GITHUB_TOKEN"
  exit 1
fi

TOKEN=$1
REPO_URL="https://$TOKEN@github.com/SoulfulBloom/deeptravelcollection.git"

# Create a temporary directory for files to push
TEMP_DIR="temp_github_push"
mkdir -p $TEMP_DIR

# Essential directories to copy
echo "Preparing essential directories..."
cp -r client $TEMP_DIR/
cp -r server $TEMP_DIR/
cp -r shared $TEMP_DIR/
cp -r public $TEMP_DIR/
mkdir -p $TEMP_DIR/scripts
cp -r scripts/performance $TEMP_DIR/scripts/ 2>/dev/null || true

# Clean up node_modules in copied directories
echo "Removing node_modules and other large files..."
find $TEMP_DIR -name "node_modules" -type d -exec rm -rf {} +
find $TEMP_DIR -name ".cache" -type d -exec rm -rf {} +
find $TEMP_DIR -name "dist" -type d -exec rm -rf {} +

# Essential files to copy
echo "Copying essential files..."
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp tsconfig.node.json $TEMP_DIR/
cp vite.config.ts $TEMP_DIR/
cp postcss.config.js $TEMP_DIR/
cp tailwind.config.ts $TEMP_DIR/
cp drizzle.config.ts $TEMP_DIR/
cp .env.example $TEMP_DIR/
cp .gitignore $TEMP_DIR/
cp README.md $TEMP_DIR/
cp DEPLOYMENT.md $TEMP_DIR/
cp MODULE_SYSTEM_FIX.md $TEMP_DIR/ 2>/dev/null || true
cp index.js $TEMP_DIR/
cp index.cjs $TEMP_DIR/
cp deploy.js $TEMP_DIR/
cp deploy.cjs $TEMP_DIR/
cp server.js $TEMP_DIR/
cp server.cjs $TEMP_DIR/
cp prod-server.js $TEMP_DIR/
cp github-push.sh $TEMP_DIR/
cp essential-backup.sh $TEMP_DIR/
cp cleanup-project.sh $TEMP_DIR/

# Initialize git repo in the temp dir
echo "Initializing git repository..."
cd $TEMP_DIR
git init
git add .
git config user.email "deeptravel@example.com"
git config user.name "Deep Travel Collections"
git commit -m "Updated essential code backup"

# Set the remote and push
echo "Updating remote URL with token..."
git remote add origin $REPO_URL
git branch -M main
git push -f origin main

# Clean up
echo "Cleaning up..."
cd ..
rm -rf $TEMP_DIR

echo "GitHub push completed successfully!"
echo "Repository: https://github.com/SoulfulBloom/deeptravelcollection"