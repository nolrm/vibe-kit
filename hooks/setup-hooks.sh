#!/bin/bash
# setup-hooks.sh - Setup Git hooks for ContextKit

set -e

echo "🎵 Setting up ContextKit Git hooks..."

# Make hooks executable
chmod +x .contextkit/hooks/*.sh

# Setup Husky if package.json exists
if [ -f "package.json" ]; then
    echo "🪝 Setting up Husky..."
    
    # Install Husky if not already installed
    if ! npm list husky > /dev/null 2>&1; then
        npm install --save-dev husky
    fi
    
    # Initialize Husky
    npx husky install
    
    # Add hooks
    npx husky add .husky/pre-push ".contextkit/hooks/pre-push.sh"
    npx husky add .husky/commit-msg ".contextkit/hooks/commit-msg.sh"
    
    echo "✅ Husky hooks setup complete"
else
    echo "⚠️  No package.json found, skipping Husky setup"
    echo "   You can manually setup Git hooks by copying .contextkit/hooks/*.sh to .git/hooks/"
fi

echo "✅ Git hooks setup complete!"
