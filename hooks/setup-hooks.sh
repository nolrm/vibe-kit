#!/bin/bash
# setup-hooks.sh - Setup Git hooks for ContextKit via core.hooksPath

set -e

echo "🪝 Setting up ContextKit Git hooks..."

# Check for .git directory
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Run 'git init' first."
    exit 1
fi

# Make hook scripts executable
chmod +x .contextkit/hooks/pre-push .contextkit/hooks/commit-msg 2>/dev/null || true

# Point git to .contextkit/hooks/ for all hooks
git config core.hooksPath .contextkit/hooks

echo "✅ Git hooks path set to .contextkit/hooks/"

# Add prepare script to package.json if it exists
if [ -f "package.json" ]; then
    if ! grep -q "core.hooksPath" package.json 2>/dev/null; then
        echo "💡 Add this to your package.json scripts for automatic setup:"
        echo '   "prepare": "git config core.hooksPath .contextkit/hooks"'
    fi
fi
