# Vibe Kit

> Get the right vibe for your code

Vibe Kit is a comprehensive development toolkit that provides AI guidance, type safety, quality checks, and automated workflows for modern development teams.

## Features

- 🤖 **AI Guidance** - Prevent AI hallucinations with structured standards
- 🔒 **Type Safety** - Strict TypeScript configuration and type checking
- ✅ **Quality Checks** - Automated pre-commit and pre-push hooks
- 📚 **Standards** - Comprehensive development standards and patterns
- 🎯 **Templates** - Ready-to-use code templates
- 🔧 **Automation** - Automated setup and quality checks
- 🛡️ **Safe Installation** - Backs up existing files with automatic rollback
- 📦 **Multi-Package Manager** - Supports npm, yarn, and pnpm

## Quick Start

### **Recommended: npm Package**
```bash
# Install globally
npm install -g @nolrm/vibe-kit

# Install in current project
vibe-kit install
```

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

- `@.vibe-kit/commands/create-component.md` - Create new component
- `@.vibe-kit/commands/create-feature.md` - Create new feature
- `@.vibe-kit/commands/run-tests.md` - Run test suite
- `@.vibe-kit/commands/quality-check.md` - Quality check

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
- 🐛 [Issues](https://github.com/yourusername/vibe-kit/issues)
- 💬 [Discussions](https://github.com/yourusername/vibe-kit/discussions)
