#!/bin/bash
# update.sh - Update Vibe Kit

set -e

echo "🎵 Updating Vibe Kit..."

# Get latest version
LATEST_VERSION=$(curl -s https://api.github.com/repos/yourusername/vibe-kit/releases/latest | grep '"tag_name"' | cut -d'"' -f4)

echo "📦 Latest version: $LATEST_VERSION"

# Download and run installation script
curl -sSL https://raw.githubusercontent.com/yourusername/vibe-kit/main/install.sh | bash

echo "✅ Vibe Kit updated to $LATEST_VERSION!"
