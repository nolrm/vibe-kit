# Vibe Kit

> Context Engineering for AI Development

Vibe Kit is a **Context Engineering toolkit** that enriches AI assistants with structured markdown files containing your project's standards, code guides, and documentation. By providing comprehensive context through `.md` files, you prevent AI hallucinations and get code that matches your exact patterns, style, and architecture.

## What is Context Engineering?

**Context Engineering** is the practice of providing structured context to AI assistants through markdown files. Vibe Kit creates a rich knowledge base that your AI can reference, ensuring:

- **No AI Hallucinations** - AI has access to your actual standards
- **Consistent Code** - Every suggestion follows your patterns
- **Project-Specific Guidance** - Tailored to your tech stack
- **Living Documentation** - Standards evolve with your project

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
After installation, Vibe Kit provides:

- `.vibe-kit/standards/` - Development standards
- `.vibe-kit/commands/` - AI commands
- `.vibe-kit/hooks/` - Git hooks
- `.vibe-kit/types/` - Type safety
- `.vibe-kit/templates/` - Code templates

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

- `@.vibe-kit/standards/README.md` - Complete development standards
- `@.vibe-kit/standards/code-style.md` - Code style guide
- `@.vibe-kit/standards/testing.md` - Testing patterns
- `@.vibe-kit/standards/architecture.md` - Architecture patterns

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/nolrm/vibe-kit/issues)
- 💬 [Discussions](https://github.com/nolrm/vibe-kit/discussions)
