# ContextKit npm Package Demo

## Installation & Usage

### **1. Global Installation**
```bash
# Install globally
npm install -g @nolrm/contextkit

# Verify installation
contextkit --version
# Output: 1.0.0
```

### **2. Project Installation**
```bash
# Navigate to your project
cd my-react-project

# Install ContextKit
contextkit install

# Interactive prompt appears:
# 🪝 Git Hooks Setup
# ContextKit can install pre-commit and pre-push hooks to automatically run quality checks.
# These hooks will run tests, linting, and type checking before commits.
# 
# Do you want to install Git hooks? (y/n): y
```

### **3. Check Status**
```bash
contextkit status

# Output:
# ✅ ContextKit is installed in this project
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
# ✅ ContextKit is up to date
```

### **4. Update**
```bash
contextkit update

# Output:
# 🔄 Updating ContextKit...
# 📦 Updating from 1.0.0 to 1.1.0
# 📥 Downloading latest files...
# ✅ Files updated successfully
# ✅ ContextKit updated successfully!
```

## **CLI Commands**

| Command | Description | Example |
|---------|-------------|---------|
| `contextkit install` | Install in current project | `contextkit install` |
| `contextkit status` | Check installation status | `contextkit status` |
| `contextkit update` | Update to latest version | `contextkit update` |
| `contextkit --version` | Show version | `contextkit --version` |
| `contextkit --help` | Show help | `contextkit --help` |

## **Installation Options**

### **Skip Git Hooks**
```bash
contextkit install --no-hooks
```

### **Non-Interactive Mode**
```bash
NON_INTERACTIVE=true contextkit install
```

### **Force Update**
```bash
contextkit update --force
```

## **Project Structure After Installation**

```
my-project/
├── .contextkit/
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
│       └── contextkit.mdc    # Cursor integration
└── .husky/                 # Git hooks (if enabled)
    ├── pre-commit
    ├── pre-push
    └── commit-msg
```

## **Configuration File**

The `.contextkit/config.yml` file tracks your installation:

```yaml
# ContextKit Configuration
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
  create_component: "@.contextkit/commands/create-component.md"
  create_feature: "@.contextkit/commands/create-feature.md"
  run_tests: "@.contextkit/commands/run-tests.md"
  add_docs: "@.contextkit/commands/add-documentation.md"
  quality_check: "@.contextkit/commands/quality-check.md"
```

## **Benefits of npm Package**

✅ **Familiar Installation** - `npm install -g @nolrm/contextkit`  
✅ **Easy Updates** - `contextkit update`  
✅ **Version Management** - Built-in versioning  
✅ **Cross-Platform** - Works on Windows, Mac, Linux  
✅ **Professional** - Scoped package looks official  
✅ **CLI Commands** - `contextkit install`, `contextkit status`  
✅ **Interactive Prompts** - User-friendly setup  
✅ **Safe Updates** - Backs up existing files  

## **Fallback for Non-Node Users**

For users without Node.js:

```bash
curl -sSL https://raw.githubusercontent.com/nolrm/contextkit/main/install-fallback.sh | bash
```

This script detects Node.js and installs via npm if available, otherwise falls back to direct installation.
