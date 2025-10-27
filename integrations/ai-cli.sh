#!/bin/bash
# Vibe Kit AI CLI Wrapper
# Usage: vibe-kit ai "create a button component"
# Or: vibe-ai "create a button" (with alias)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load context file
CONTEXT_FILE=".vibe-kit/CONTEXT.md"

# Check if Vibe Kit is installed
if [ ! -f "$CONTEXT_FILE" ]; then
  echo -e "${RED}❌ Vibe Kit not initialized.${NC}"
  echo -e "${YELLOW}   Run: vibe-kit install${NC}"
  exit 1
fi

# Get user's AI preference (set via AI_TOOL env var)
AI_TOOL="${AI_TOOL:-aider}"  # Default to aider
PROMPT="$@"

if [ -z "$PROMPT" ]; then
  echo -e "${RED}❌ Please provide a prompt${NC}"
  echo -e "${BLUE}   Usage: vibe-kit ai \"your prompt here\"${NC}"
  exit 1
fi

# Load context
CONTEXT=$(cat "$CONTEXT_FILE")

# Show what we're doing
echo -e "${BLUE}🤖 Using AI tool: ${AI_TOOL}${NC}"
echo -e "${YELLOW}📝 Loading Vibe Kit context...${NC}"
echo ""

# Execute based on AI tool
case "$AI_TOOL" in
  "aider")
    # Aider automatically reads .aider/rules.md
    echo "$PROMPT" | aider
    ;;
  
  "claude")
    # Claude can read .claude/context.md if it exists
    echo "$CONTEXT

User Request: $PROMPT" | claude
    ;;
  
  "gemini")
    echo "$CONTEXT

User Request: $PROMPT" | gemini
    ;;
  
  *)
    echo -e "${RED}❌ Unknown AI tool: ${AI_TOOL}${NC}"
    echo -e "${YELLOW}Available tools: aider, claude, gemini${NC}"
    echo -e "${BLUE}Set AI_TOOL environment variable:${NC}"
    echo -e "  export AI_TOOL=aider"
    exit 1
    ;;
esac
