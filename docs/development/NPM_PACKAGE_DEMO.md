# Vibe Kit npm Package Demo

## Installation & Usage

### **1. Global Installation**
```bash
# Install globally
npm install -g vibe-kit

# Verify installation
vibe-kit --version
# Output: 1.0.0
```

### **2. Project Installation**
```bash
# Navigate to your project
cd my-react-project

# Install Vibe Kit
vibe-kit install

# Interactive prompt appears:
# 🪝 Git Hooks Setup
# Vibe Kit can install pre-commit and pre-push hooks to automatically run quality checks.
# These hooks will run tests, linting, and type checking before commits.
# 
# Do you want to install Git hooks? (y/n): y
```

### **3. Check Status**
```bash
vibe-kit status

# Output:
# ✅ Vibe Kit is installed in this project
# 
# 📋 Installation Details:
#    Version: 1.0.0
#    Project: my-react-project
#    Type: react-vite
#    Package Manager: npm
# 
# 🔧 Features:
#    Testing: ✅
#    Documentation: ✅
#    Code Review: ✅
#    Linting: ✅
#    Type Safety: ✅
#    Git Hooks: ✅
# 
# ✅ Vibe Kit is up to date
```

### **4. Update**
```bash
vibe-kit update

# Output:
# 🔄 Updating Vibe Kit...
# 📦 Updating from 1.0.0 to 1.1.0
# 📥 Downloading latest files...
# ✅ Files updated successfully
# ✅ Vibe Kit updated successfully!
```

## **CLI Commands**

| Command | Description | Example |
|---------|-------------|---------|
| `vibe-kit install` | Install in current project | `vibe-kit install` |
| `vibe-kit status` | Check installation status | `vibe-kit status` |
| `vibe-kit update` | Update to latest version | `vibe-kit update` |
| `vibe-kit --version` | Show version | `vibe-kit --version` |
| `vibe-kit --help` | Show help | `vibe-kit --help` |

## **Installation Options**

### **Skip Git Hooks**
```bash
vibe-kit install --no-hooks
```

### **Non-Interactive Mode**
```bash
NON_INTERACTIVE=true vibe-kit install
```

### **Force Update**
```bash
vibe-kit update --force
```

## **Project Structure After Installation**

```
my-project/
├── .vibe-kit/
│   ├── config.yml          # Configuration
│   ├── standards/          # Development standards
│   │   ├── README.md
│   │   ├── code-style.md
│   │   ├── testing.md
│   │   ├── architecture.md
│   │   ├── workflows.md
│   │   └── ai-guidelines.md
│   ├── commands/           # AI commands
│   │   ├── create-component.md
│   │   ├── create-feature.md
│   │   ├── run-tests.md
│   │   ├── add-documentation.md
│   │   └── quality-check.md
│   ├── hooks/              # Git hooks
│   │   ├── pre-commit.sh
│   │   ├── pre-push.sh
│   │   ├── commit-msg.sh
│   │   └── setup-hooks.sh
│   ├── types/              # Type safety
│   │   ├── strict.tsconfig.json
│   │   ├── global.d.ts
│   │   ├── type-check.sh
│   │   └── typescript-strict.json
│   ├── templates/          # Code templates
│   │   ├── component.tsx
│   │   ├── test.tsx
│   │   ├── story.tsx
│   │   ├── hook.ts
│   │   └── api.ts
│   └── scripts/            # Automation scripts
│       └── update.sh
├── .cursor/
│   └── rules/
│       └── vibe-kit.mdc    # Cursor integration
└── .husky/                 # Git hooks (if enabled)
    ├── pre-commit
    ├── pre-push
    └── commit-msg
```

## **Configuration File**

The `.vibe-kit/config.yml` file tracks your installation:

```yaml
# Vibe Kit Configuration
version: "1.0.0"
project_name: "my-react-project"
project_type: "react-vite"

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
```

## **Benefits of npm Package**

✅ **Familiar Installation** - `npm install -g vibe-kit`  
✅ **Easy Updates** - `vibe-kit update`  
✅ **Version Management** - Built-in versioning  
✅ **Cross-Platform** - Works on Windows, Mac, Linux  
✅ **Professional** - Scoped package looks official  
✅ **CLI Commands** - `vibe-kit install`, `vibe-kit status`  
✅ **Interactive Prompts** - User-friendly setup  
✅ **Safe Updates** - Backs up existing files  

## **Fallback for Non-Node Users**

For users without Node.js:

```bash
curl -sSL https://raw.githubusercontent.com/nolrm/vibe-kit/main/install-fallback.sh | bash
```

This script detects Node.js and installs via npm if available, otherwise falls back to direct installation.
