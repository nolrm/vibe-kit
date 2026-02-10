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

echo -e "${PURPLE}🎵 ContextKit Installation${NC}"
echo ""

# Check if Node.js is available
if command -v node >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Node.js detected. Installing via npm...${NC}"
    echo ""
    
    # Install via npm
    npm install -g @nolrm/contextkit
    
    echo ""
    echo -e "${GREEN}🎉 ContextKit installed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📖 Usage:${NC}"
    echo "  contextkit install    # Install in current project"
    echo "  contextkit status     # Check installation status"
    echo "  contextkit update     # Update to latest version"
    echo ""
    echo -e "${YELLOW}💡 Try: 'contextkit install' in your project directory${NC}"
    
else
    echo -e "${YELLOW}⚠️  Node.js not found. Installing via shell script...${NC}"
    echo ""
    
    # Fallback to direct installation
    echo -e "${BLUE}📥 Downloading installation script...${NC}"
    
    # Download and run the legacy install.sh
    curl -sSL https://raw.githubusercontent.com/nolrm/contextkit/main/legacy/install.sh | bash
    
    echo ""
    echo -e "${GREEN}🎉 ContextKit installed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📖 Usage:${NC}"
    echo "  Use AI commands with @.contextkit/ references"
    echo "  Read .contextkit/standards/README.md for guidelines"
    echo ""
    echo -e "${YELLOW}💡 Try: 'Create a Button component following contextkit standards'${NC}"
    echo ""
    echo -e "${BLUE}💡 For CLI commands, install Node.js and run:${NC}"
    echo "  npm install -g @nolrm/contextkit"
fi

echo ""
echo -e "${PURPLE}🎵 Get the right vibe for your code!${NC}"
