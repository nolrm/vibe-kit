#!/bin/bash
# install.sh - ContextKit Installation Script (Enhanced)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
VIBE_KIT_VERSION="1.0.0"
REPO_URL="https://raw.githubusercontent.com/nolrm/contextkit/main"
BACKUP_DIR=".contextkit-backup-$(date +%Y%m%d-%H%M%S)"
INSTALL_LOG=".contextkit-install.log"

# Global variables for rollback
INSTALLED_FILES=()
BACKED_UP_FILES=()
CREATED_DIRS=()

# Error handling
set -euo pipefail

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$INSTALL_LOG"
    echo -e "$1"
}

# Error handler with rollback
error_handler() {
    local exit_code=$?
    log "${RED}❌ Installation failed with exit code $exit_code${NC}"
    
    if [ ${#BACKED_UP_FILES[@]} -gt 0 ]; then
        log "${YELLOW}🔄 Attempting rollback...${NC}"
        rollback_changes
    fi
    
    log "${RED}💥 Installation failed. Check $INSTALL_LOG for details.${NC}"
    exit $exit_code
}

# Rollback function
rollback_changes() {
    log "${YELLOW}🔄 Rolling back changes...${NC}"
    
    # Restore backed up files
    for file in "${BACKED_UP_FILES[@]}"; do
        if [ -f "$file.backup" ]; then
            mv "$file.backup" "$file"
            log "Restored: $file"
        fi
    done
    
    # Remove installed files
    for file in "${INSTALLED_FILES[@]}"; do
        if [ -f "$file" ]; then
            rm -f "$file"
            log "Removed: $file"
        fi
    done
    
    # Remove created directories (in reverse order)
    for ((i=${#CREATED_DIRS[@]}-1; i>=0; i--)); do
        local dir="${CREATED_DIRS[i]}"
        if [ -d "$dir" ] && [ -z "$(ls -A "$dir" 2>/dev/null)" ]; then
            rmdir "$dir" 2>/dev/null || true
            log "Removed empty directory: $dir"
        fi
    done
    
    # Remove backup directory if empty
    if [ -d "$BACKUP_DIR" ] && [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
        rmdir "$BACKUP_DIR" 2>/dev/null || true
    fi
    
    log "${GREEN}✅ Rollback completed${NC}"
}

# Set up error handling
trap error_handler ERR

# Initialize installation log
echo "ContextKit Installation Log - $(date)" > "$INSTALL_LOG"
log "${PURPLE}🎵 Starting ContextKit v${VIBE_KIT_VERSION} installation...${NC}"

# Utility functions
backup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        mkdir -p "$BACKUP_DIR/$(dirname "$file")"
        cp "$file" "$BACKUP_DIR/$file"
        BACKED_UP_FILES+=("$file")
        log "${YELLOW}📦 Backed up existing file: $file${NC}"
    fi
}

safe_download() {
    local url="$1"
    local output="$2"
    local description="$3"
    
    log "${YELLOW}📥 Downloading $description...${NC}"
    
    # Create directory if it doesn't exist
    local dir=$(dirname "$output")
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        CREATED_DIRS+=("$dir")
    fi
    
    # Backup existing file
    backup_file "$output"
    
    # Download with retry logic
    local retry_count=0
    local max_retries=3
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -s -f -L -o "$output" "$url"; then
            INSTALLED_FILES+=("$output")
            log "${GREEN}✅ Downloaded: $description${NC}"
            return 0
        else
            retry_count=$((retry_count + 1))
            log "${YELLOW}⚠️  Download failed, retry $retry_count/$max_retries${NC}"
            sleep 2
        fi
    done
    
    log "${RED}❌ Failed to download $description after $max_retries attempts${NC}"
    return 1
}

detect_package_manager() {
    if [ -f "package.json" ]; then
        if [ -f "yarn.lock" ]; then
            echo "yarn"
        elif [ -f "pnpm-lock.yaml" ]; then
            echo "pnpm"
        elif [ -f "package-lock.json" ]; then
            echo "npm"
        else
            echo "npm"  # Default to npm
        fi
    else
        echo "none"
    fi
}

check_command_exists() {
    local cmd="$1"
    if command -v "$cmd" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Enhanced project type detection
detect_project_type() {
    local project_type="generic"
    local framework=""
    local version=""
    
    if [ -f "package.json" ]; then
        # Detect framework
        if grep -q '"react"' package.json || grep -q '"@types/react"' package.json; then
            framework="react"
        elif grep -q '"vue"' package.json || grep -q '"@vue"' package.json; then
            framework="vue"
        elif grep -q '"@angular"' package.json; then
            framework="angular"
        elif grep -q '"next"' package.json; then
            framework="nextjs"
        elif grep -q '"nuxt"' package.json; then
            framework="nuxt"
        elif grep -q '"svelte"' package.json; then
            framework="svelte"
        else
            framework="node"
        fi
        
        # Detect build tools
        if grep -q '"vite"' package.json; then
            project_type="${framework}-vite"
        elif grep -q '"webpack"' package.json; then
            project_type="${framework}-webpack"
        elif grep -q '"rollup"' package.json; then
            project_type="${framework}-rollup"
        else
            project_type="$framework"
        fi
        
    elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        project_type="python"
    elif [ -f "Cargo.toml" ]; then
        project_type="rust"
    elif [ -f "go.mod" ]; then
        project_type="go"
    elif [ -f "composer.json" ]; then
        project_type="php"
    elif [ -f "Gemfile" ]; then
        project_type="ruby"
    elif [ -f "pom.xml" ] || [ -f "build.gradle" ]; then
        project_type="java"
    fi
    
    log "${BLUE}🔍 Detected project type: $project_type${NC}"
    echo "$project_type"
}

# Create directory structure safely
create_structure() {
    log "${YELLOW}📁 Creating directory structure...${NC}"
    
    # Create .contextkit directories
    local vibe_dirs=(
        ".contextkit/standards"
        ".contextkit/hooks"
        ".contextkit/types"
        ".contextkit/commands"
        ".contextkit/templates"
        ".contextkit/scripts"
    )
    
    for dir in "${vibe_dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            CREATED_DIRS+=("$dir")
            log "Created directory: $dir"
        else
            log "Directory already exists: $dir"
        fi
    done
    
    # Create .cursor/rules directory (safe for existing .cursor folders)
    if [ ! -d ".cursor/rules" ]; then
        mkdir -p ".cursor/rules"
        CREATED_DIRS+=(".cursor/rules")
        log "Created directory: .cursor/rules"
    else
        log "Directory already exists: .cursor/rules"
    fi
    
    log "${GREEN}✅ Directory structure created${NC}"
}

# Download and install standards safely
install_standards() {
    local project_type=$1
    
    log "${YELLOW}📚 Installing standards for ${project_type} project...${NC}"
    
    # Download base standards
    safe_download "${REPO_URL}/standards/README.md" ".contextkit/standards/README.md" "Standards README"
    safe_download "${REPO_URL}/standards/code-style.md" ".contextkit/standards/code-style.md" "Code Style Guide"
    safe_download "${REPO_URL}/standards/testing.md" ".contextkit/standards/testing.md" "Testing Standards"
    safe_download "${REPO_URL}/standards/architecture.md" ".contextkit/standards/architecture.md" "Architecture Guide"
    safe_download "${REPO_URL}/standards/workflows.md" ".contextkit/standards/workflows.md" "Workflow Standards"
    safe_download "${REPO_URL}/standards/ai-guidelines.md" ".contextkit/standards/ai-guidelines.md" "AI Guidelines"
    
    # Download project-specific standards if available
    local project_specific_url="${REPO_URL}/standards/${project_type}-specific.md"
    if curl -s -f "$project_specific_url" > /dev/null 2>&1; then
        safe_download "$project_specific_url" ".contextkit/standards/${project_type}-specific.md" "${project_type} Specific Standards"
        log "${GREEN}✅ Installed ${project_type}-specific standards${NC}"
    else
        log "${YELLOW}ℹ️  No ${project_type}-specific standards available${NC}"
    fi
    
    log "${GREEN}✅ Standards installed${NC}"
}

# Install commands safely
install_commands() {
    log "${YELLOW}⚡ Installing AI commands...${NC}"
    
    safe_download "${REPO_URL}/commands/create-feature.md" ".contextkit/commands/create-feature.md" "Create Feature Command"
    safe_download "${REPO_URL}/commands/create-component.md" ".contextkit/commands/create-component.md" "Create Component Command"
    safe_download "${REPO_URL}/commands/run-tests.md" ".contextkit/commands/run-tests.md" "Run Tests Command"
    safe_download "${REPO_URL}/commands/add-documentation.md" ".contextkit/commands/add-documentation.md" "Add Documentation Command"
    safe_download "${REPO_URL}/commands/quality-check.md" ".contextkit/commands/quality-check.md" "Quality Check Command"
    
    log "${GREEN}✅ Commands installed${NC}"
}

# Install hooks safely
install_hooks() {
    log "${YELLOW}🪝 Installing Git hooks...${NC}"
    
    safe_download "${REPO_URL}/hooks/pre-commit.sh" ".contextkit/hooks/pre-commit.sh" "Pre-commit Hook"
    safe_download "${REPO_URL}/hooks/pre-push.sh" ".contextkit/hooks/pre-push.sh" "Pre-push Hook"
    safe_download "${REPO_URL}/hooks/commit-msg.sh" ".contextkit/hooks/commit-msg.sh" "Commit Message Hook"
    safe_download "${REPO_URL}/hooks/setup-hooks.sh" ".contextkit/hooks/setup-hooks.sh" "Setup Hooks Script"
    
    # Make hooks executable
    chmod +x .contextkit/hooks/*.sh
    
    log "${GREEN}✅ Hooks installed${NC}"
}

# Install type safety safely
install_types() {
    local project_type=$1
    
    log "${YELLOW}🔒 Installing type safety...${NC}"
    
    safe_download "${REPO_URL}/types/strict.tsconfig.json" ".contextkit/types/strict.tsconfig.json" "Strict TypeScript Config"
    safe_download "${REPO_URL}/types/global.d.ts" ".contextkit/types/global.d.ts" "Global Type Definitions"
    safe_download "${REPO_URL}/types/type-check.sh" ".contextkit/types/type-check.sh" "Type Check Script"
    safe_download "${REPO_URL}/types/typescript-strict.json" ".contextkit/types/typescript-strict.json" "TypeScript Strict Config"
    
    # Make type check script executable
    chmod +x .contextkit/types/type-check.sh
    
    log "${GREEN}✅ Type safety installed${NC}"
}

# Install templates safely
install_templates() {
    local project_type=$1
    
    log "${YELLOW}📝 Installing code templates...${NC}"
    
    # Download base templates
    safe_download "${REPO_URL}/templates/component.tsx" ".contextkit/templates/component.tsx" "Component Template"
    safe_download "${REPO_URL}/templates/test.tsx" ".contextkit/templates/test.tsx" "Test Template"
    safe_download "${REPO_URL}/templates/story.tsx" ".contextkit/templates/story.tsx" "Storybook Template"
    safe_download "${REPO_URL}/templates/hook.ts" ".contextkit/templates/hook.ts" "Hook Template"
    safe_download "${REPO_URL}/templates/api.ts" ".contextkit/templates/api.ts" "API Template"
    
    # Download project-specific templates if available
    local project_templates_url="${REPO_URL}/templates/${project_type}/"
    if curl -s -f "$project_templates_url" > /dev/null 2>&1; then
        mkdir -p ".contextkit/templates/${project_type}"
        CREATED_DIRS+=(".contextkit/templates/${project_type}")
        
        safe_download "${REPO_URL}/templates/${project_type}/component.tsx" ".contextkit/templates/${project_type}/component.tsx" "${project_type} Component Template"
        safe_download "${REPO_URL}/templates/${project_type}/test.tsx" ".contextkit/templates/${project_type}/test.tsx" "${project_type} Test Template"
        
        log "${GREEN}✅ Installed ${project_type}-specific templates${NC}"
    else
        log "${YELLOW}ℹ️  No ${project_type}-specific templates available${NC}"
    fi
    
    log "${GREEN}✅ Templates installed${NC}"
}

# Install Cursor integration safely
install_cursor_integration() {
    log "${YELLOW}🎯 Installing Cursor integration...${NC}"
    
    safe_download "${REPO_URL}/cursor/contextkit.mdc" ".cursor/rules/contextkit.mdc" "Cursor Rules"
    
    log "${GREEN}✅ Cursor integration installed${NC}"
}

# Install scripts safely
install_scripts() {
    log "${YELLOW}🔧 Installing automation scripts...${NC}"
    
    safe_download "${REPO_URL}/scripts/setup.sh" ".contextkit/scripts/setup.sh" "Setup Script"
    safe_download "${REPO_URL}/scripts/type-check.sh" ".contextkit/scripts/type-check.sh" "Type Check Script"
    safe_download "${REPO_URL}/scripts/quality-check.sh" ".contextkit/scripts/quality-check.sh" "Quality Check Script"
    safe_download "${REPO_URL}/scripts/update.sh" ".contextkit/scripts/update.sh" "Update Script"
    
    # Make scripts executable
    chmod +x .contextkit/scripts/*.sh
    
    log "${GREEN}✅ Scripts installed${NC}"
}

# Create configuration safely
create_config() {
    local project_type=$1
    local project_name=$(basename "$(pwd)")
    local git_hooks_enabled=${2:-false}
    
    log "${YELLOW}⚙️  Creating configuration...${NC}"
    
    # Backup existing config if it exists
    backup_file ".contextkit/config.yml"
    
    cat > .contextkit/config.yml << EOF
# ContextKit Configuration
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
  git_hooks: ${git_hooks_enabled}

# Paths (customize for your project)
paths:
  components: "src/components"
  tests: "src/__tests__"
  stories: "src/stories"
  docs: "docs"

# Commands
commands:
  create_component: "@.contextkit/commands/create-component.md"
  create_feature: "@.contextkit/commands/create-feature.md"
  run_tests: "@.contextkit/commands/run-tests.md"
  add_docs: "@.contextkit/commands/add-documentation.md"
  quality_check: "@.contextkit/commands/quality-check.md"
EOF

    INSTALLED_FILES+=(".contextkit/config.yml")
    log "${GREEN}✅ Configuration created${NC}"
}

# Interactive prompt for Husky setup
prompt_husky_setup() {
    if [ -f "package.json" ]; then
        # Check for non-interactive mode (CI/CD environments)
        if [ "${CI:-}" = "true" ] || [ "${NON_INTERACTIVE:-}" = "true" ]; then
            log "${YELLOW}🤖 Non-interactive mode detected, skipping Git hooks${NC}"
            return 1
        fi
        
        echo ""
        log "${BLUE}🪝 Git Hooks Setup${NC}"
        log "${YELLOW}ContextKit can install pre-commit and pre-push hooks to automatically run quality checks.${NC}"
        log "${YELLOW}These hooks will run tests, linting, and type checking before commits.${NC}"
        echo ""
        
        while true; do
            read -p "Do you want to install Git hooks? (y/n): " -n 1 -r
            echo
            case $REPLY in
                [Yy]* ) 
                    log "${GREEN}✅ Git hooks will be installed${NC}"
                    return 0
                    ;;
                [Nn]* ) 
                    log "${YELLOW}⏭️  Skipping Git hooks installation${NC}"
                    log "${BLUE}💡 You can install them later by running: .contextkit/hooks/setup-hooks.sh${NC}"
                    return 1
                    ;;
                * ) 
                    log "${RED}Please answer yes (y) or no (n)${NC}"
                    ;;
            esac
        done
    else
        log "${YELLOW}⚠️  Skipping Git hooks setup (no package.json found)${NC}"
        return 1
    fi
}

# Setup Husky with package manager support
setup_husky() {
    if [ -f "package.json" ]; then
        local package_manager=$(detect_package_manager)
        log "${YELLOW}🪝 Setting up Husky with $package_manager...${NC}"
        
        # Check if Node.js is available
        if ! check_command_exists "node"; then
            log "${YELLOW}⚠️  Node.js not found, skipping Husky setup${NC}"
            return 0
        fi
        
        # Install Husky based on package manager
        case "$package_manager" in
            "yarn")
                if ! yarn list husky > /dev/null 2>&1; then
                    log "Installing Husky with yarn..."
                    yarn add --dev husky
                fi
                ;;
            "pnpm")
                if ! pnpm list husky > /dev/null 2>&1; then
                    log "Installing Husky with pnpm..."
                    pnpm add --save-dev husky
                fi
                ;;
            "npm"|*)
                if ! npm list husky > /dev/null 2>&1; then
                    log "Installing Husky with npm..."
                    npm install --save-dev husky
                fi
                ;;
        esac
        
        # Initialize Husky
        case "$package_manager" in
            "yarn")
                yarn husky install
                ;;
            "pnpm")
                pnpm exec husky install
                ;;
            "npm"|*)
                npx husky install
                ;;
        esac
        
        # Backup existing hooks before adding new ones
        backup_file ".husky/pre-commit"
        backup_file ".husky/pre-push"
        backup_file ".husky/commit-msg"
        
        # Add hooks safely
        case "$package_manager" in
            "yarn")
                yarn husky add .husky/pre-commit ".contextkit/hooks/pre-commit.sh"
                yarn husky add .husky/pre-push ".contextkit/hooks/pre-push.sh"
                yarn husky add .husky/commit-msg ".contextkit/hooks/commit-msg.sh"
                ;;
            "pnpm")
                pnpm exec husky add .husky/pre-commit ".contextkit/hooks/pre-commit.sh"
                pnpm exec husky add .husky/pre-push ".contextkit/hooks/pre-push.sh"
                pnpm exec husky add .husky/commit-msg ".contextkit/hooks/commit-msg.sh"
                ;;
            "npm"|*)
                npx husky add .husky/pre-commit ".contextkit/hooks/pre-commit.sh"
                npx husky add .husky/pre-push ".contextkit/hooks/pre-push.sh"
                npx husky add .husky/commit-msg ".contextkit/hooks/commit-msg.sh"
                ;;
        esac
        
        log "${GREEN}✅ Husky setup complete${NC}"
    else
        log "${YELLOW}⚠️  Skipping Husky setup (no package.json found)${NC}"
    fi
}

# Cleanup function
cleanup() {
    log "${YELLOW}🧹 Cleaning up installation artifacts...${NC}"
    
    # Remove installation log if installation was successful
    if [ -f "$INSTALL_LOG" ]; then
        rm -f "$INSTALL_LOG"
    fi
    
    # Remove backup directory if no files were backed up
    if [ -d "$BACKUP_DIR" ] && [ ${#BACKED_UP_FILES[@]} -eq 0 ]; then
        rmdir "$BACKUP_DIR" 2>/dev/null || true
    fi
    
    log "${GREEN}✅ Cleanup completed${NC}"
}

# Main installation function
main() {
    local project_type=$(detect_project_type)
    local package_manager=$(detect_package_manager)
    
    log "${BLUE}🔍 Detected project type: $project_type${NC}"
    log "${BLUE}📦 Detected package manager: $package_manager${NC}"
    
    # Check prerequisites
    if [ ! -d ".git" ]; then
        log "${YELLOW}⚠️  Warning: Not in a git repository. Some features may not work properly.${NC}"
    fi
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    CREATED_DIRS+=("$BACKUP_DIR")
    
    # Run installation steps
    create_structure
    install_standards "$project_type"
    install_commands
    install_hooks
    install_types "$project_type"
    install_templates "$project_type"
    install_cursor_integration
    install_scripts
    
    # Ask user about Git hooks setup
    local git_hooks_enabled=false
    if prompt_husky_setup; then
        setup_husky
        git_hooks_enabled=true
    fi
    
    # Create configuration with Git hooks status
    create_config "$project_type" "$git_hooks_enabled"
    
    # Installation completed successfully
    log ""
    log "${GREEN}🎉 ContextKit v${VIBE_KIT_VERSION} successfully installed!${NC}"
    log ""
    log "${BLUE}📖 Next steps:${NC}"
    log "1. Read .contextkit/standards/README.md to understand the standards"
    log "2. Customize .contextkit/config.yml for your project"
    log "3. Start using AI commands with @.contextkit/ references"
    
    if [ "$git_hooks_enabled" = "true" ]; then
        log "4. Git hooks are active - quality checks will run automatically"
    else
        log "4. To install Git hooks later: .contextkit/hooks/setup-hooks.sh"
    fi
    
    log ""
    log "${YELLOW}💡 Try: 'Create a Button component following contextkit standards'${NC}"
    log ""
    log "${BLUE}🔗 Documentation: https://github.com/nolrm/contextkit${NC}"
    log "${PURPLE}🎵 Get the right vibe for your code!${NC}"
    
    # Cleanup
    cleanup
}

# Run installation
main "$@"
