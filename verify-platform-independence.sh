#!/bin/bash

# Verification script for platform independence
# This script checks for any remaining Replit-specific references

echo "Deep Travel Collections - Platform Independence Verification"
echo "==========================================================="
echo "Checking for Replit-specific references in your code..."
echo ""

# Function to print findings
print_findings() {
  local count=$1
  local term=$2
  local description=$3
  
  if [ $count -gt 0 ]; then
    echo "⚠️  Found $count instances of '$term' ($description)"
  else
    echo "✓ No instances of '$term' found"
  fi
}

# Check for Replit domain references
replit_domains=$(grep -r --include="*.{js,ts,tsx,jsx,json,html,css}" "replit\.(app|dev|co)" . --exclude-dir={node_modules,dist,.git} | wc -l)
print_findings $replit_domains "replit domains" "hardcoded Replit URLs"

# Check for Replit-specific environment variables
replit_env=$(grep -r --include="*.{js,ts,tsx,jsx,json,html,css,sh}" "REPL_" . --exclude-dir={node_modules,dist,.git} | wc -l)
print_findings $replit_env "REPL_" "Replit environment variables"

# Check for Replit import statements
replit_imports=$(grep -r --include="*.{js,ts,tsx,jsx}" "@replit" . --exclude-dir={node_modules,dist,.git} | wc -l)
print_findings $replit_imports "@replit" "Replit package imports"

# Check for Replit in package.json
replit_packages=$(grep -c "@replit" package.json)
print_findings $replit_packages "@replit in package.json" "Replit dependencies"

# Check for remaining Replit files
replit_files=$(find . -maxdepth 1 -name ".replit*" | wc -l)
print_findings $replit_files ".replit files" "Replit configuration files"

# Check for references to Replit-specific paths
replit_paths=$(grep -r --include="*.{js,ts,tsx,jsx,json,html,css,sh}" "/home/runner" . --exclude-dir={node_modules,dist,.git} | wc -l)
print_findings $replit_paths "/home/runner" "Replit-specific paths"

echo ""
echo "Verification complete!"
echo ""

# Recommendations
if [ $replit_domains -gt 0 ] || [ $replit_env -gt 0 ] || [ $replit_imports -gt 0 ] || [ $replit_packages -gt 0 ] || [ $replit_files -gt 0 ] || [ $replit_paths -gt 0 ]; then
  echo "⚠️  Some Replit-specific references remain. Please run the cleanup script and/or manually review the files."
else
  echo "✅ No Replit-specific references found. Your application should be ready for migration."
fi

# Create a list of files to manually review if needed
if [ $replit_domains -gt 0 ] || [ $replit_env -gt 0 ] || [ $replit_imports -gt 0 ] || [ $replit_paths -gt 0 ]; then
  echo ""
  echo "Files to manually review:"
  echo "------------------------"
  
  if [ $replit_domains -gt 0 ]; then
    echo "Files with Replit domain references:"
    grep -r --include="*.{js,ts,tsx,jsx,json,html,css}" "replit\.(app|dev|co)" . --exclude-dir={node_modules,dist,.git} -l | sed 's/^/  /'
  fi
  
  if [ $replit_env -gt 0 ]; then
    echo "Files with Replit environment variables:"
    grep -r --include="*.{js,ts,tsx,jsx,json,html,css,sh}" "REPL_" . --exclude-dir={node_modules,dist,.git} -l | sed 's/^/  /'
  fi
  
  if [ $replit_imports -gt 0 ]; then
    echo "Files with Replit imports:"
    grep -r --include="*.{js,ts,tsx,jsx}" "@replit" . --exclude-dir={node_modules,dist,.git} -l | sed 's/^/  /'
  fi
  
  if [ $replit_paths -gt 0 ]; then
    echo "Files with Replit-specific paths:"
    grep -r --include="*.{js,ts,tsx,jsx,json,html,css,sh}" "/home/runner" . --exclude-dir={node_modules,dist,.git} -l | sed 's/^/  /'
  fi
fi

echo ""
echo "Remember to update your CI/CD process, environment variables, and database connection string when migrating."