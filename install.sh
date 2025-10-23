#!/bin/bash
# install.sh - Vibe Kit Installation Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
VIBE_KIT_VERSION="1.0.0"
REPO_URL="https://raw.githubusercontent.com/yourusername/vibe-kit/main"

echo -e "${PURPLE}🎵 Installing Vibe Kit v${VIBE_KIT_VERSION}...${NC}"

# Detect project type
detect_project_type() {
    if [ -f "package.json" ]; then
        if grep -q "react" package.json; then
            echo "react"
        elif grep -q "vue" package.json; then
            echo "vue"
        elif grep -q "angular" package.json; then
            echo "angular"
        else
            echo "node"
        fi
    elif [ -f "requirements.txt" ]; then
        echo "python"
    elif [ -f "Cargo.toml" ]; then
        echo "rust"
    elif [ -f "go.mod" ]; then
        echo "go"
    else
        echo "generic"
    fi
}

# Create directory structure
create_structure() {
    echo -e "${YELLOW}📁 Creating directory structure...${NC}"
    
    mkdir -p .vibe-kit/{standards,hooks,types,commands,templates,scripts}
    mkdir -p .cursor/rules
    
    echo -e "${GREEN}✅ Directory structure created${NC}"
}

# Download and install standards
install_standards() {
    local project_type=$1
    
    echo -e "${YELLOW}📚 Installing standards for ${project_type} project...${NC}"
    
    # Download base standards
    curl -s -o .vibe-kit/standards/README.md "${REPO_URL}/standards/README.md"
    curl -s -o .vibe-kit/standards/code-style.md "${REPO_URL}/standards/code-style.md"
    curl -s -o .vibe-kit/standards/testing.md "${REPO_URL}/standards/testing.md"
    curl -s -o .vibe-kit/standards/architecture.md "${REPO_URL}/standards/architecture.md"
    curl -s -o .vibe-kit/standards/workflows.md "${REPO_URL}/standards/workflows.md"
    curl -s -o .vibe-kit/standards/ai-guidelines.md "${REPO_URL}/standards/ai-guidelines.md"
    
    # Download project-specific standards if available
    if curl -s -f "${REPO_URL}/standards/${project_type}-specific.md" > /dev/null; then
        curl -s -o .vibe-kit/standards/${project_type}-specific.md "${REPO_URL}/standards/${project_type}-specific.md"
        echo -e "${GREEN}✅ Installed ${project_type}-specific standards${NC}"
    fi
    
    echo -e "${GREEN}✅ Standards installed${NC}"
}

# Install commands
install_commands() {
    echo -e "${YELLOW}⚡ Installing AI commands...${NC}"
    
    curl -s -o .vibe-kit/commands/create-feature.md "${REPO_URL}/commands/create-feature.md"
    curl -s -o .vibe-kit/commands/create-component.md "${REPO_URL}/commands/create-component.md"
    curl -s -o .vibe-kit/commands/run-tests.md "${REPO_URL}/commands/run-tests.md"
    curl -s -o .vibe-kit/commands/add-documentation.md "${REPO_URL}/commands/add-documentation.md"
    curl -s -o .vibe-kit/commands/quality-check.md "${REPO_URL}/commands/quality-check.md"
    
    echo -e "${GREEN}✅ Commands installed${NC}"
}

# Install hooks
install_hooks() {
    echo -e "${YELLOW}🪝 Installing Git hooks...${NC}"
    
    curl -s -o .vibe-kit/hooks/pre-commit.sh "${REPO_URL}/hooks/pre-commit.sh"
    curl -s -o .vibe-kit/hooks/pre-push.sh "${REPO_URL}/hooks/pre-push.sh"
    curl -s -o .vibe-kit/hooks/commit-msg.sh "${REPO_URL}/hooks/commit-msg.sh"
    curl -s -o .vibe-kit/hooks/setup-hooks.sh "${REPO_URL}/hooks/setup-hooks.sh"
    
    chmod +x .vibe-kit/hooks/*.sh
    
    echo -e "${GREEN}✅ Hooks installed${NC}"
}

# Install type safety
install_types() {
    local project_type=$1
    
    echo -e "${YELLOW}🔒 Installing type safety...${NC}"
    
    curl -s -o .vibe-kit/types/strict.tsconfig.json "${REPO_URL}/types/strict.tsconfig.json"
    curl -s -o .vibe-kit/types/global.d.ts "${REPO_URL}/types/global.d.ts"
    curl -s -o .vibe-kit/types/type-check.sh "${REPO_URL}/types/type-check.sh"
    curl -s -o .vibe-kit/types/typescript-strict.json "${REPO_URL}/types/typescript-strict.json"
    
    chmod +x .vibe-kit/types/type-check.sh
    
    echo -e "${GREEN}✅ Type safety installed${NC}"
}

# Install templates
install_templates() {
    local project_type=$1
    
    echo -e "${YELLOW}📝 Installing code templates...${NC}"
    
    # Download base templates
    curl -s -o .vibe-kit/templates/component.tsx "${REPO_URL}/templates/component.tsx"
    curl -s -o .vibe-kit/templates/test.tsx "${REPO_URL}/templates/test.tsx"
    curl -s -o .vibe-kit/templates/story.tsx "${REPO_URL}/templates/story.tsx"
    curl -s -o .vibe-kit/templates/hook.ts "${REPO_URL}/templates/hook.ts"
    curl -s -o .vibe-kit/templates/api.ts "${REPO_URL}/templates/api.ts"
    
    # Download project-specific templates
    if curl -s -f "${REPO_URL}/templates/${project_type}/" > /dev/null; then
        mkdir -p .vibe-kit/templates/${project_type}
        curl -s -o .vibe-kit/templates/${project_type}/component.tsx "${REPO_URL}/templates/${project_type}/component.tsx"
        curl -s -o .vibe-kit/templates/${project_type}/test.tsx "${REPO_URL}/templates/${project_type}/test.tsx"
    fi
    
    echo -e "${GREEN}✅ Templates installed${NC}"
}

# Install Cursor integration
install_cursor_integration() {
    echo -e "${YELLOW}🎯 Installing Cursor integration...${NC}"
    
    curl -s -o .cursor/rules/vibe-kit.mdc "${REPO_URL}/cursor/vibe-kit.mdc"
    
    echo -e "${GREEN}✅ Cursor integration installed${NC}"
}

# Install scripts
install_scripts() {
    echo -e "${YELLOW}🔧 Installing automation scripts...${NC}"
    
    curl -s -o .vibe-kit/scripts/setup.sh "${REPO_URL}/scripts/setup.sh"
    curl -s -o .vibe-kit/scripts/type-check.sh "${REPO_URL}/scripts/type-check.sh"
    curl -s -o .vibe-kit/scripts/quality-check.sh "${REPO_URL}/scripts/quality-check.sh"
    curl -s -o .vibe-kit/scripts/update.sh "${REPO_URL}/scripts/update.sh"
    
    chmod +x .vibe-kit/scripts/*.sh
    
    echo -e "${GREEN}✅ Scripts installed${NC}"
}

# Create configuration
create_config() {
    local project_type=$1
    local project_name=$(basename "$(pwd)")
    
    echo -e "${YELLOW}⚙️  Creating configuration...${NC}"
    
    cat > .vibe-kit/config.yml << EOF
# Vibe Kit Configuration
version: "${VIBE_KIT_VERSION}"
project_name: "${project_name}"
project_type: "${project_type}"

# Features
features:
  testing: true
  documentation: true
  code_review: true
  linting: true
  type_safety: true
  git_hooks: true

# Paths (customize for your project)
paths:
  components: "src/components"
  tests: "src/__tests__"
  stories: "src/stories"
  docs: "docs"

# Commands
commands:
  create_component: "@.vibe-kit/commands/create-component.md"
  create_feature: "@.vibe-kit/commands/create-feature.md"
  run_tests: "@.vibe-kit/commands/run-tests.md"
  add_docs: "@.vibe-kit/commands/add-documentation.md"
  quality_check: "@.vibe-kit/commands/quality-check.md"
EOF

    echo -e "${GREEN}✅ Configuration created${NC}"
}

# Setup Husky
setup_husky() {
    if [ -f "package.json" ]; then
        echo -e "${YELLOW}🪝 Setting up Husky...${NC}"
        
        # Install Husky if not already installed
        if ! npm list husky > /dev/null 2>&1; then
            npm install --save-dev husky
        fi
        
        # Initialize Husky
        npx husky install
        
        # Add hooks
        npx husky add .husky/pre-commit ".vibe-kit/hooks/pre-commit.sh"
        npx husky add .husky/pre-push ".vibe-kit/hooks/pre-push.sh"
        npx husky add .husky/commit-msg ".vibe-kit/hooks/commit-msg.sh"
        
        echo -e "${GREEN}✅ Husky setup complete${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping Husky setup (no package.json found)${NC}"
    fi
}

# Main installation
main() {
    local project_type=$(detect_project_type)
    
    echo -e "${BLUE}🔍 Detected project type: ${project_type}${NC}"
    
    create_structure
    install_standards "$project_type"
    install_commands
    install_hooks
    install_types "$project_type"
    install_templates "$project_type"
    install_cursor_integration
    install_scripts
    create_config "$project_type"
    setup_husky
    
    echo ""
    echo -e "${GREEN}🎉 Vibe Kit v${VIBE_KIT_VERSION} successfully installed!${NC}"
    echo ""
    echo -e "${BLUE}📖 Next steps:${NC}"
    echo "1. Read .vibe-kit/standards/README.md to understand the standards"
    echo "2. Customize .vibe-kit/config.yml for your project"
    echo "3. Start using AI commands with @.vibe-kit/ references"
    echo ""
    echo -e "${YELLOW}💡 Try: 'Create a Button component following vibe-kit standards'${NC}"
    echo ""
    echo -e "${BLUE}🔗 Documentation: https://github.com/yourusername/vibe-kit${NC}"
    echo -e "${PURPLE}🎵 Get the right vibe for your code!${NC}"
}

# Run installation
main "$@"
