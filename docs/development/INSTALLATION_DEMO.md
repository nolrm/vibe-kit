# Vibe Kit Installation Demo

## Interactive Git Hooks Setup

When you run the installation, you'll now see an interactive prompt for Git hooks:

```bash
$ ./install.sh

🎵 Starting Vibe Kit v1.0.0 installation...
🔍 Detected project type: react-vite
📦 Detected package manager: npm
📁 Creating directory structure...
✅ Directory structure created
📚 Installing standards for react-vite project...
✅ Standards installed
⚡ Installing AI commands...
✅ Commands installed
🪝 Installing Git hooks...
✅ Hooks installed
🔒 Installing type safety...
✅ Type safety installed
📝 Installing code templates...
✅ Templates installed
🎯 Installing Cursor integration...
✅ Cursor integration installed
🔧 Installing automation scripts...
✅ Scripts installed

🪝 Git Hooks Setup
Vibe Kit can install pre-commit and pre-push hooks to automatically run quality checks.
These hooks will run tests, linting, and type checking before commits.

Do you want to install Git hooks? (y/n): y
✅ Git hooks will be installed
🪝 Setting up Husky with npm...
✅ Husky setup complete
⚙️  Creating configuration...
✅ Configuration created

🎉 Vibe Kit v1.0.0 successfully installed!

📖 Next steps:
1. Read .vibe-kit/standards/README.md to understand the standards
2. Customize .vibe-kit/config.yml for your project
3. Start using AI commands with @.vibe-kit/ references
4. Git hooks are active - quality checks will run automatically

💡 Try: 'Create a Button component following vibe-kit standards'
🔗 Documentation: https://github.com/yourusername/vibe-kit
🎵 Get the right vibe for your code!
```

## Non-Interactive Mode

For CI/CD environments, use the non-interactive flag:

```bash
$ NON_INTERACTIVE=true ./install.sh

🎵 Starting Vibe Kit v1.0.0 installation...
🔍 Detected project type: react-vite
📦 Detected package manager: npm
📁 Creating directory structure...
✅ Directory structure created
# ... installation continues ...
🤖 Non-interactive mode detected, skipping Git hooks
⚙️  Creating configuration...
✅ Configuration created

🎉 Vibe Kit v1.0.0 successfully installed!

📖 Next steps:
1. Read .vibe-kit/standards/README.md to understand the standards
2. Customize .vibe-kit/config.yml for your project
3. Start using AI commands with @.vibe-kit/ references
4. To install Git hooks later: .vibe-kit/hooks/setup-hooks.sh
```

## Manual Git Hooks Installation

If you skipped Git hooks during installation, you can install them later:

```bash
# Run the setup script
./vibe-kit/hooks/setup-hooks.sh
```

## Configuration

The installation creates a `.vibe-kit/config.yml` file that tracks whether Git hooks are enabled:

```yaml
# Vibe Kit Configuration
version: "1.0.0"
project_name: "my-project"
project_type: "react-vite"

# Features
features:
  testing: true
  documentation: true
  code_review: true
  linting: true
  type_safety: true
  git_hooks: true  # or false if skipped
```
