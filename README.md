# Vibe Kit

> Context Engineering for AI Development

Vibe Kit is a **Context Engineering toolkit** that enriches AI assistants with structured markdown files containing your project's standards, code guides, and documentation. By providing comprehensive context through `.md` files, you prevent AI hallucinations and get code that matches your exact patterns, style, and architecture.

## What is Context Engineering?

**Context Engineering** is the practice of providing structured context to AI assistants through markdown files. Vibe Kit creates a rich knowledge base that your AI can reference, ensuring:

- **No AI Hallucinations** - AI has access to your actual standards
- **Consistent Code** - Every suggestion follows your patterns
- **Project-Specific Guidance** - Tailored to your tech stack
- **Living Documentation** - Standards evolve with your project

## How It Works

Vibe Kit works by creating structured MD files that AI assistants read as context. Here's the complete flow:

### 📁 What Gets Installed

When you run `vibe-kit install`, it creates:

```
your-project/
├── .vibe-kit/
│   ├── standards/
│   │   ├── glossary.md          ← Project shortcuts & terminology
│   │   ├── code-style.md        ← Coding conventions
│   │   ├── testing.md           ← Test patterns
│   │   ├── architecture.md      ← Architecture decisions
│   │   └── ai-guidelines.md     ← AI behavior rules
│   ├── commands/
│   │   └── analyze.md           ← Analysis workflow
│   └── templates/
│       └── component.tsx         ← Component template
│
└── .cursor/rules/
    └── vibe-kit.mdc             ← Makes AI read the .md files
```

### 🤖 How AI Uses the Files

**1. Automatic Context Loading** (in Cursor IDE)

When you work on a file, Cursor reads `.cursor/rules/vibe-kit.mdc` which references all standards:

```markdown
- @.vibe-kit/standards/glossary.md       ← Project-specific shortcuts
- @.vibe-kit/standards/code-style.md    ← Your coding style
- @.vibe-kit/standards/testing.md       ← Your test patterns
```

**2. Context-Aware Code Generation**

Your prompt:
```bash
"Create a customer login button with TypeScript"
```

AI automatically:
```
✓ Checks glossary.md → "customer" = customer app
✓ Checks glossary.md → "button" = Button component pattern  
✓ Checks code-style.md → TypeScript strict mode
✓ Checks testing.md → Include numbered test cases
✓ Generates code matching YOUR patterns
```

**3. Example: Real-World Usage**

```bash
# Prompt with your project shortcuts
"Add @btn to customer for order checkout"

# AI understands:
# - @btn = Button component pattern
# - customer = customer app directory
# - Follows YOUR code style, testing patterns, etc.
```

### 🎯 The Context Engineering Flow

```
Your Prompt
    ↓
AI Reads .md Context Files
    ↓
┌────────────────────────────────────┐
│  📄 glossary.md                    │
│  → "customer" = apps/customer-app  │
│  → "@btn" = Button component        │
│                                     │
│  📄 code-style.md                  │
│  → TypeScript strict               │
│  → Functional components           │
│                                     │
│  📄 testing.md                     │
│  → Numbered test cases (1., 2., 3.)│
│                                     │
│  📄 ai-guidelines.md               │
│  → Use templates, error handling   │
└────────────────────────────────────┘
    ↓
Context-Aware Code Generated
```

### 💡 Key Benefits

- **No hallucinations**: AI sees your actual standards
- **Consistent**: Every suggestion follows your patterns  
- **Fast**: Quick shortcuts instead of long prompts
- **Evolving**: Update `.md` files as project grows

## Features

- 🧠 **Context Engineering** - Structured MD files for AI context
- 🤖 **AI Guidance** - Prevent AI hallucinations with your standards
- 🔍 **Smart Analysis** - AI-powered project analysis and customization
- 📚 **Standards Library** - Comprehensive development standards in MD format
- 🎯 **Code Templates** - Ready-to-use templates matching your patterns
- 🔒 **Type Safety** - Strict TypeScript configuration
- ✅ **Quality Checks** - Automated pre-commit and pre-push hooks
- 🛡️ **Safe Installation** - Backs up existing files with automatic rollback
- 📦 **Multi-Package Manager** - Supports npm, yarn, and pnpm

## Quick Start

### **Step 1: Install Globally**
```bash
# Install Vibe Kit globally
npm install -g @nolrm/vibe-kit
```

### **Step 2: Install in Your Project**
```bash
# Navigate to your project directory
cd your-project

# Install Vibe Kit in current project
vibe-kit install
```

### **Step 3: Customize Standards (Recommended)**
```bash
# In Cursor AI chat, run:
@.vibe-kit/commands/analyze.md
```

**🎯 The analyze command will:**
- **Scan your project** structure and dependencies
- **Detect existing patterns** and configurations
- **Customize standards** to match your tech stack
- **Update guidelines** based on your project type

### **Alternative: Direct Installation**
```bash
# For users without Node.js
curl -sSL https://raw.githubusercontent.com/nolrm/vibe-kit/main/install-fallback.sh | bash
```

**✨ Features:**
- 🛡️ Safe installation with backup & rollback
- 📦 Auto-detects package manager (npm/yarn/pnpm)
- 🎯 Smart project type detection
- 🪝 Optional Git hooks (interactive prompt)
- 🔄 Easy updates with `vibe-kit update`
- 🤖 **AI-powered analysis** for project-specific customization

**For CI/CD environments:**
```bash
# Non-interactive installation
NON_INTERACTIVE=true vibe-kit install
```

## Usage

### **CLI Commands**
```bash
vibe-kit install    # Install in current project
vibe-kit status     # Check installation status
vibe-kit update     # Update to latest version
vibe-kit --version  # Show version
```

### **🤖 AI-Powered Analysis Workflow**
```bash
# 1. Check if analysis is needed
vibe-kit status

# 2. Run analysis in Cursor AI chat
@.vibe-kit/commands/analyze.md
```

**The analyze command provides:**
- **Project-specific standards** tailored to your tech stack
- **Intelligent recommendations** based on existing patterns
- **Interactive customization** - choose what to update
- **Automatic file updates** - standards files customized for your project

### **Project Structure**

After installation, Vibe Kit creates:

```
.vibe-kit/
├── standards/           ← Standards that AI reads as context
│   ├── glossary.md      ← YOUR project shortcuts & terms
│   ├── code-style.md     ← YOUR coding conventions
│   ├── testing.md        ← YOUR test patterns
│   ├── architecture.md   ← YOUR architecture decisions
│   └── ai-guidelines.md  ← AI behavior rules
├── commands/             ← AI workflow commands
├── hooks/                ← Git hooks (optional)
├── types/                ← Type safety configs
└── templates/            ← Code templates

.cursor/rules/
└── vibe-kit.mdc          ← Makes Cursor read the .md files
```

**How it works:**
- AI automatically reads the MD files as context
- You reference them using `@.vibe-kit/standards/...`
- Each file provides specific guidance to AI

## Pre-Push Hook

Vibe Kit includes a pre-push hook that automatically runs tests before pushing:

```bash
# Skip hook (not recommended)
git push --no-verify
```

**Features:**
- 🧪 **Test Runner** - Runs all tests before push
- 🚫 **Push Protection** - Blocks broken code from reaching repository
- ⚡ **Fast Execution** - Quick feedback loop

## Commands

### **🤖 AI Commands (Use in Cursor Chat)**
- `@.vibe-kit/commands/analyze.md` - **Analyze and customize standards for your project**
- `@.vibe-kit/commands/create-component.md` - Create new component
- `@.vibe-kit/commands/create-feature.md` - Create new feature
- `@.vibe-kit/commands/run-tests.md` - Run test suite
- `@.vibe-kit/commands/quality-check.md` - Quality check
- `@.vibe-kit/commands/add-documentation.md` - Add documentation

## Standards

These MD files provide context to AI:

- `@.vibe-kit/standards/README.md` - Complete development standards
- `@.vibe-kit/standards/code-style.md` - Code style guide
- `@.vibe-kit/standards/testing.md` - Testing patterns
- `@.vibe-kit/standards/architecture.md` - Architecture patterns
- `@.vibe-kit/standards/glossary.md` - **Project shortcuts & terminology**
- `@.vibe-kit/standards/ai-guidelines.md` - AI development guidelines

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/nolrm/vibe-kit/issues)
- 💬 [Discussions](https://github.com/nolrm/vibe-kit/discussions)
