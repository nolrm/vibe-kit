#!/bin/bash
# update.sh - Update ContextKit

set -e

echo "🎵 Updating ContextKit..."

# Get latest version
LATEST_VERSION=$(curl -s https://api.github.com/repos/nolrm/contextkit/releases/latest | grep '"tag_name"' | cut -d'"' -f4)

echo "📦 Latest version: $LATEST_VERSION"

# Download and run installation script
curl -sSL https://raw.githubusercontent.com/nolrm/contextkit/main/legacy/install.sh | bash

echo "✅ ContextKit updated to $LATEST_VERSION!"
