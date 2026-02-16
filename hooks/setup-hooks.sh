#!/bin/bash
# setup-hooks.sh - Setup native Git hooks for ContextKit

set -e

echo "🪝 Setting up ContextKit Git hooks..."

# Check for .git directory
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Run 'git init' first."
    exit 1
fi

# Make hook scripts executable
chmod +x .contextkit/hooks/*.sh

# Ensure .git/hooks exists
mkdir -p .git/hooks

# Install pre-push hook
cat > .git/hooks/pre-push << 'HOOK'
#!/usr/bin/env sh
# ContextKit managed hook — do not edit
.contextkit/hooks/pre-push.sh "$@"
HOOK
chmod +x .git/hooks/pre-push

# Install commit-msg hook
cat > .git/hooks/commit-msg << 'HOOK'
#!/usr/bin/env sh
# ContextKit managed hook — do not edit
.contextkit/hooks/commit-msg.sh "$@"
HOOK
chmod +x .git/hooks/commit-msg

echo "✅ Git hooks installed to .git/hooks/"
