#!/bin/bash
# install-fallback.sh - Fallback installation for users without Node.js

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🎵 Vibe Kit Installation${NC}"
echo ""

# Check if Node.js is available
if command -v node >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Node.js detected. Installing via npm...${NC}"
    echo ""
    
    # Install via npm
    npm install -g @nolrm/vibe-kit
    
    echo ""
    echo -e "${GREEN}🎉 Vibe Kit installed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📖 Usage:${NC}"
    echo "  vibe-kit install    # Install in current project"
    echo "  vibe-kit status     # Check installation status"
    echo "  vibe-kit update     # Update to latest version"
    echo ""
    echo -e "${YELLOW}💡 Try: 'vibe-kit install' in your project directory${NC}"
    
else
    echo -e "${YELLOW}⚠️  Node.js not found. Installing via shell script...${NC}"
    echo ""
    
    # Fallback to direct installation
    echo -e "${BLUE}📥 Downloading installation script...${NC}"
    
    # Download and run the legacy install.sh
    curl -sSL https://raw.githubusercontent.com/nolrm/vibe-kit/main/legacy/install.sh | bash
    
    echo ""
    echo -e "${GREEN}🎉 Vibe Kit installed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📖 Usage:${NC}"
    echo "  Use AI commands with @.vibe-kit/ references"
    echo "  Read .vibe-kit/standards/README.md for guidelines"
    echo ""
    echo -e "${YELLOW}💡 Try: 'Create a Button component following vibe-kit standards'${NC}"
    echo ""
    echo -e "${BLUE}💡 For CLI commands, install Node.js and run:${NC}"
    echo "  npm install -g @nolrm/vibe-kit"
fi

echo ""
echo -e "${PURPLE}🎵 Get the right vibe for your code!${NC}"
