const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const DownloadManager = require('../utils/download');
const ProjectDetector = require('../utils/project-detector');
const GitHooksManager = require('../utils/git-hooks');
const StatusManager = require('../utils/status-manager');
const ToolDetector = require('../utils/tool-detector');

class InstallCommand {
  constructor() {
    this.downloadManager = new DownloadManager();
    this.projectDetector = new ProjectDetector();
    this.gitHooksManager = new GitHooksManager();
    this.statusManager = new StatusManager();
    this.toolDetector = new ToolDetector();
    this.repoUrl = 'https://raw.githubusercontent.com/nolrm/vibe-kit/main';
  }

  async install(options = {}) {
    const requestedPlatform = options.platform;
    const isPlatformSpecific = !!requestedPlatform;
    
    // Handle platform-specific installation
    if (isPlatformSpecific) {
      const isInstalled = await this.isAlreadyInstalled();
      
      if (!isInstalled) {
        console.log(chalk.red('❌ .vibe-kit is not installed'));
        console.log(chalk.yellow('💡 Run: vibe-kit install'));
        console.log(chalk.dim('   This installs the base .vibe-kit directory'));
        console.log(chalk.dim('   Then you can run: vibe-kit ' + requestedPlatform));
        return;
      }
      
      // .vibe-kit exists, just add the platform integration
      console.log(chalk.green('✓ .vibe-kit already exists'));
      console.log(chalk.blue(`🔧 Adding ${requestedPlatform} integration...`));
      console.log('');
      await this.installPlatformIntegration(requestedPlatform);
      return;
    }
    
    // Full installation
    console.log(chalk.magenta('🎵 Installing Vibe Kit...'));
    console.log('');
    
    // Detect project type
    const projectType = this.projectDetector.detectProjectType();
    const packageManager = this.projectDetector.detectPackageManager();
    
    console.log(chalk.green(`🧩 Detected project: ${projectType}`));
    console.log(chalk.green(`📦 Package manager: ${packageManager}`));

    // Detect AI tools
    const detectedTools = await this.toolDetector.detectAll();
    const summary = this.toolDetector.getSummary();
    
    if (summary && summary.count > 0) {
      const tools = [...summary.editors, ...summary.cli].join(', ');
      console.log(chalk.green(`🧠 AI tools detected: ${tools}`));
    } else {
      console.log(chalk.yellow('⚠️  No AI tools detected'));
      console.log(chalk.blue('💡 Universal context files will still be installed'));
    }
    console.log('');

    // Check if already installed
    if (await this.isAlreadyInstalled()) {
      const { shouldContinue } = await this.promptReinstall();
      if (!shouldContinue) {
        console.log(chalk.yellow('⏭️  Installation cancelled'));
        return;
      }
    }

    // Create directory structure
    await this.createDirectoryStructure();

    // Download files
    await this.downloadFiles(projectType, options, detectedTools);

    // Ask about Git hooks
    let installHooks = true;
    if (!options.nonInteractive && !options.noHooks) {
      installHooks = await this.promptGitHooks();
    }

    // Install Git hooks if requested
    if (installHooks) {
      await this.gitHooksManager.installHooks(packageManager);
    }

    // Create configuration
    await this.createConfiguration(projectType, installHooks);

    // Create status tracking
    await this.createStatusFile(projectType, packageManager, installHooks);

    // Success message
    this.showSuccessMessage(installHooks, detectedTools, projectType, packageManager);
  }

  async installPlatformIntegration(platform) {
    try {
      // Create platform directory if needed
      const platformDirs = {
        cursor: '.cursor/rules',
        continue: '.continue',
        aider: '.aider',
        vscode: '.vscode',
        claude: '.claude',
        gemini: '.gemini',
        codex: '.codex'
      };
      
      if (platformDirs[platform]) {
        await fs.ensureDir(platformDirs[platform]);
      }
      
      // Install the specific platform
      switch (platform) {
        case 'cursor':
          await this.installCursorIntegration();
          break;
        case 'continue':
          await this.installContinueIntegration();
          break;
        case 'aider':
          await this.installAiderIntegration();
          break;
        case 'vscode':
          await this.installVSCodeIntegration();
          break;
        case 'claude':
          await this.installClaudeIntegration();
          break;
        case 'gemini':
          await this.installGeminiIntegration();
          break;
        case 'codex':
          await this.installCodexIntegration();
          break;
        default:
          console.log(chalk.red(`❌ Unknown platform: ${platform}`));
          console.log(chalk.yellow('💡 Available: cursor, continue, aider, vscode, claude, gemini, codex'));
          return;
      }
      
      console.log('');
      console.log(chalk.green(`🎉 ${platform} integration installed!`));
      
      // Show usage instructions
      this.showPlatformUsage(platform);
      
    } catch (error) {
      console.log(chalk.red(`❌ Failed to install ${platform} integration`));
      console.log(chalk.yellow(error.message));
    }
  }

  showPlatformUsage(platform) {
    console.log('');
    console.log('📖 Usage:');
    
    switch (platform) {
      case 'cursor':
        console.log('  In Cursor Chat:');
        console.log('    @.vibe-kit/commands/analyze.md');
        console.log('    @.vibe-kit Create a button component');
        break;
      case 'continue':
        console.log('  Continue will auto-load Vibe Kit context files');
        console.log('  No additional setup needed!');
        break;
      case 'aider':
        console.log('  Aider will use .aider/rules.md automatically');
        console.log('  Just run: aider "create a button component"');
        break;
      case 'vscode':
        console.log('  In Copilot Chat:');
        console.log('    @.vibe-kit Create a button component');
        console.log('    @.vibe-kit/standards Create a login form');
        break;
      case 'claude':
        console.log('  In Claude CLI:');
        console.log('    claude "read .vibe-kit/context.md and create a button"');
        break;
      case 'gemini':
        console.log('  In Gemini CLI:');
        console.log('    gemini "read .vibe-kit/context.md and create a button"');
        break;
      case 'codex':
        console.log('  In Codex CLI:');
        console.log('    codex "read .vibe-kit/context.md and create a button"');
        console.log('    codex "read .vibe-kit/standards/code-style.md and apply it"');
        break;
    }
  }

  async isAlreadyInstalled() {
    return await fs.pathExists('.vibe-kit/config.yml');
  }

  async promptReinstall() {
    const { shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: 'Vibe Kit is already installed. Do you want to reinstall?',
        default: false
      }
    ]);
    return { shouldContinue };
  }

  async promptGitHooks() {
    // Check for non-interactive mode
    if (process.env.CI === 'true' || process.env.NON_INTERACTIVE === 'true') {
      console.log(chalk.yellow('🤖 Non-interactive mode detected, skipping Git hooks'));
      return false;
    }

    if (!await fs.pathExists('package.json')) {
      console.log(chalk.yellow('⚠️  Skipping Git hooks setup (no package.json found)'));
      return false;
    }

    console.log('');
    console.log('──────────────────────────────────────────────');
    console.log(chalk.blue('⚙️  Git Hooks Setup'));
    console.log('──────────────────────────────────────────────');
    console.log('Vibe Kit can install **pre-commit** and **pre-push** hooks');
    console.log('to automatically run tests, linting, and type checks before commits.');
    console.log('');
    console.log('');

    const { installHooks } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installHooks',
        message: 'Do you want to enable Git hooks?',
        default: false
      }
    ]);

    if (installHooks) {
      console.log(chalk.green('✅ Git hooks enabled'));
    } else {
      console.log(chalk.yellow('⏭️  Skipping Git hooks for now'));
      console.log(chalk.blue('💡 You can enable them anytime with: `vk update --hooks`'));
    }
    console.log('');

    return installHooks;
  }

  async createDirectoryStructure() {
    console.log(chalk.blue('📁 Creating structure...'));
    
    const directories = [
      '.vibe-kit/standards',
      '.vibe-kit/hooks',
      '.vibe-kit/types',
      '.vibe-kit/commands',
      '.vibe-kit/templates',
      '.vibe-kit/scripts',
      '.vibe-kit/integrations'
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
    }

    // Create platform-specific directories (create if they don't exist, don't error if they do)
    const platformDirs = [
      '.cursor/rules',
      '.continue',
      '.aider',
      '.vscode',
      '.claude',
      '.gemini',
      '.codex'
    ];

    for (const dir of platformDirs) {
      await fs.ensureDir(dir);
    }

    console.log(chalk.green('✅ .vibe-kit/ directory created'));
    console.log(chalk.green('✅ Standards, templates, and commands installed'));
    console.log('');
  }

  async createSkeletonStandards() {
    const skeletonFiles = {
      'standards/code-style.md': `# Code Style

<!-- Content will be generated by running: vk analyze -->

Your code style standards will be automatically generated based on your codebase patterns, conventions, and existing code.

Run \`vk analyze\` to generate this content.`,
      
      'standards/testing.md': `# Testing

<!-- Content will be generated by running: vk analyze -->

Your testing standards will be automatically generated based on your existing test patterns and testing framework.

Run \`vk analyze\` to generate this content.`,
      
      'standards/architecture.md': `# Architecture

<!-- Content will be generated by running: vk analyze -->

Your architecture patterns will be documented based on your project structure and organization.

Run \`vk analyze\` to generate this content.`,
      
      'standards/ai-guidelines.md': `# AI Guidelines

<!-- Content will be generated by running: vk analyze -->

Guidelines for AI assistance will be defined based on your project's needs and patterns.

Run \`vk analyze\` to generate this content.`,
      
      'standards/workflows.md': `# Workflows

<!-- Content will be generated by running: vk analyze -->

Development workflows and processes will be documented based on your project's practices.

Run \`vk analyze\` to generate this content.`
    };

    for (const [relativePath, content] of Object.entries(skeletonFiles)) {
      await fs.writeFile(`.vibe-kit/${relativePath}`, content);
    }
  }

  async downloadFiles(projectType, options = {}, detectedTools = {}) {
    try {
      // Create skeleton standards files (will be customized by analyze)
      console.log(chalk.blue('📝 Creating skeleton standards files...'));
      await this.createSkeletonStandards();
      
      console.log(chalk.green('✅ Skeleton files created'));
      console.log(chalk.yellow('💡 Run: vk analyze to generate content based on your codebase'));
      console.log('');
      
      // Download base files
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/README.md`,
        '.vibe-kit/standards/README.md'
      );
      
      // Download the actual glossary (keep it as-is, universal across all projects)
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/glossary.md`,
        '.vibe-kit/standards/glossary.md'
      );

      // Download commands
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/create-feature.md`,
        '.vibe-kit/commands/create-feature.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/create-component.md`,
        '.vibe-kit/commands/create-component.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/run-tests.md`,
        '.vibe-kit/commands/run-tests.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/add-documentation.md`,
        '.vibe-kit/commands/add-documentation.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/quality-check.md`,
        '.vibe-kit/commands/quality-check.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/analyze.md`,
        '.vibe-kit/commands/analyze.md'
      );

      // Download hooks
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/hooks/pre-commit.sh`,
        '.vibe-kit/hooks/pre-commit.sh'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/hooks/pre-push.sh`,
        '.vibe-kit/hooks/pre-push.sh'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/hooks/commit-msg.sh`,
        '.vibe-kit/hooks/commit-msg.sh'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/hooks/setup-hooks.sh`,
        '.vibe-kit/hooks/setup-hooks.sh'
      );

      // Download types
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/types/strict.tsconfig.json`,
        '.vibe-kit/types/strict.tsconfig.json'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/types/global.d.ts`,
        '.vibe-kit/types/global.d.ts'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/types/type-check.sh`,
        '.vibe-kit/types/type-check.sh'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/types/typescript-strict.json`,
        '.vibe-kit/types/typescript-strict.json'
      );

      // Download templates
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/component.tsx`,
        '.vibe-kit/templates/component.tsx'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/test.tsx`,
        '.vibe-kit/templates/test.tsx'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/story.tsx`,
        '.vibe-kit/templates/story.tsx'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/hook.ts`,
        '.vibe-kit/templates/hook.ts'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/api.ts`,
        '.vibe-kit/templates/api.ts'
      );

      // Download Cursor integration
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/cursor/vibe-kit.mdc`,
        '.cursor/rules/vibe-kit.mdc'
      );

      // Download scripts
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/legacy/update.sh`,
        '.vibe-kit/scripts/update.sh'
      );

      // Make scripts executable
      await fs.chmod('.vibe-kit/hooks/pre-commit.sh', '755');
      await fs.chmod('.vibe-kit/hooks/pre-push.sh', '755');
      await fs.chmod('.vibe-kit/hooks/commit-msg.sh', '755');
      await fs.chmod('.vibe-kit/hooks/setup-hooks.sh', '755');
      await fs.chmod('.vibe-kit/types/type-check.sh', '755');
      await fs.chmod('.vibe-kit/scripts/update.sh', '755');
    } catch (error) {
      console.log(chalk.red('❌ Failed to download files'));
      throw error;
    }

    // Install platform integrations
    await this.installPlatformIntegrations(detectedTools);
  }

  async installPlatformIntegrations(detectedTools = {}) {
    console.log(chalk.blue('🔧 Installing integrations...'));
    
    try {
      
      // Install integrations based on detected tools
      if (detectedTools.cursor) {
        await this.installCursorIntegration();
      }
      
      if (detectedTools.continue) {
        await this.installContinueIntegration();
      }
      
      if (detectedTools.aider || detectedTools.aider_cli) {
        await this.installAiderIntegration();
      }
      
      if (detectedTools.vscode) {
        await this.installVSCodeIntegration();
      }

      // Always install CLI helpers
      await this.installCLIHelpers();

      console.log(chalk.green('✅ Platform integrations complete'));
      console.log('');
    } catch (error) {
      console.log(chalk.red('❌ Failed to install platform integrations'));
      console.log(chalk.yellow(error.message));
    }
  }

  async installCursorIntegration() {
    // Cursor integration already downloaded above
    console.log(chalk.green('✅ Cursor integration installed'));
  }

  async installContinueIntegration() {
    const continueConfig = {
      "description": "Vibe Kit - Context Engineering",
      "rules": [
        "Context Engineering toolkit that provides structured markdown files to enrich AI assistants.",
        "",
        "Standards: @.vibe-kit/standards/code-style.md",
        "Testing: @.vibe-kit/standards/testing.md",
        "Guidelines: @.vibe-kit/standards/ai-guidelines.md",
        "",
        "Commands: @.vibe-kit/commands/"
      ]
    };

    await fs.writeJson('.continue/config.json', continueConfig, { spaces: 2 });
    console.log(chalk.green('✅ Continue integration installed'));
  }

  async installAiderIntegration() {
    // Copy aider rules from integrations folder
    const rulesFile = path.join(__dirname, '../../integrations/aider.rules.md');
    if (await fs.pathExists(rulesFile)) {
      await fs.copy(rulesFile, '.aider/rules.md');
      console.log(chalk.green('✅ Aider integration installed'));
    } else {
      // Create basic aider rules
      const rules = `# Vibe Kit Rules\n\nReference: .vibe-kit/standards/*.md\n`;
      await fs.writeFile('.aider/rules.md', rules);
      console.log(chalk.green('✅ Aider integration installed'));
    }
  }

  async installClaudeIntegration() {
    // Claude CLI reads from .vibe-kit automatically when you reference files
    // Create a README for Claude usage
    const claudeReadme = '.claude/README.md';
    const claudeReadmeContent = `# Using Vibe Kit with Claude CLI

## Usage

Claude CLI reads your codebase. Reference Vibe Kit context files in your prompts:

\`\`\`bash
# Reference specific standards
claude "read .vibe-kit/standards/code-style.md and apply it to create a button"

# Reference all standards  
claude "read .vibe-kit/standards/*.md and create a login form"

# Use commands
claude "read .vibe-kit/commands/create-component.md and execute"
\`\`\`

## What Gets Loaded

Claude CLI will automatically include context from referenced files, ensuring your generated code follows your project standards.

For more info, see: https://github.com/nolrm/vibe-kit
`;
    
    await fs.writeFile(claudeReadme, claudeReadmeContent);
    console.log(chalk.green('✅ Claude CLI integration installed'));
  }

  async installGeminiIntegration() {
    // Gemini CLI reads from .vibe-kit automatically when you reference files
    // Create a README for Gemini usage
    const geminiReadme = '.gemini/README.md';
    const geminiReadmeContent = `# Using Vibe Kit with Google Gemini CLI

## Usage

Gemini CLI reads your codebase. Reference Vibe Kit context files in your prompts:

\`\`\`bash
# Reference specific standards
gemini "read .vibe-kit/standards/code-style.md and apply it to create a button"

# Reference all standards  
gemini "read .vibe-kit/standards/*.md and create a login form"

# Use commands
gemini "read .vibe-kit/commands/create-component.md and execute"
\`\`\`

## What Gets Loaded

Gemini CLI will automatically include context from referenced files, ensuring your generated code follows your project standards.

For more info, see: https://github.com/nolrm/vibe-kit
`;
    
    await fs.writeFile(geminiReadme, geminiReadmeContent);
    console.log(chalk.green('✅ Gemini CLI integration installed'));
  }

  async installCodexIntegration() {
    // Codex CLI reads from .vibe-kit automatically when you reference files
    // Create a README for Codex usage
    const codexReadme = '.codex/README.md';
    const codexReadmeContent = `# Using Vibe Kit with OpenAI Codex CLI

## Usage

Codex CLI reads your codebase. Reference Vibe Kit context files in your prompts:

\`\`\`bash
# Reference specific standards
codex "read .vibe-kit/standards/code-style.md and apply it to create a button"

# Reference all standards  
codex "read .vibe-kit/standards/*.md and create a login form"

# Use commands
codex "read .vibe-kit/commands/create-component.md and execute"
\`\`\`

## What Gets Loaded

Codex CLI will automatically include context from referenced files, ensuring your generated code follows your project standards.

For more info, see: https://github.com/nolrm/vibe-kit
`;
    
    await fs.writeFile(codexReadme, codexReadmeContent);
    console.log(chalk.green('✅ Codex CLI integration installed'));
  }

  async installVSCodeIntegration() {
    // Create .vscode/settings.json if it doesn't exist or merge settings
    let settings = {};
    const settingsPath = '.vscode/settings.json';
    
    if (await fs.pathExists(settingsPath)) {
      settings = await fs.readJson(settingsPath);
    }

    // Merge Vibe Kit settings
    settings['// Vibe Kit'] = 'Context Engineering - Add AI_TOOL=vscode to use';
    settings['vibeKit.standardsPath'] = '.vibe-kit/standards';
    settings['vibeKit.templatesPath'] = '.vibe-kit/templates';
    
    await fs.writeJson(settingsPath, settings, { spaces: 2 });
    
    // Create a README for VS Code usage
    const vscodeReadme = `.vibe-kit/VSCODE_USAGE.md`;
    const vscodeReadmeContent = `# Using Vibe Kit with VS Code Copilot

## ⚡ Easiest Method: Just @ mention .vibe-kit

In Copilot Chat, simply mention the vibe-kit folder:

### Recommended (simplest):
\`\`\`
@.vibe-kit Create a login button
\`\`\`
This includes ALL context files: standards, templates, and commands!

### Or mention just standards folder:
\`\`\`
@.vibe-kit/standards Create a login button
\`\`\`
This includes only your standards files.

### Individual files (if you want specific ones):
\`\`\`
@.vibe-kit/standards/glossary.md @.vibe-kit/standards/code-style.md Create a login button
\`\`\`

## Available Context Files

- \`@.vibe-kit/standards/glossary.md\` - Project shortcuts & terminology
- \`@.vibe-kit/standards/code-style.md\` - Coding conventions
- \`@.vibe-kit/standards/testing.md\` - Testing patterns
- \`@.vibe-kit/standards/architecture.md\` - Architecture decisions
- \`@.vibe-kit/standards/ai-guidelines.md\` - AI behavior rules
- \`@.vibe-kit/templates/component.tsx\` - Component template
- \`@.vibe-kit/templates/\` - All templates

## Pro Tips

1. **Best:** Mention \`@.vibe-kit\` to include everything in one mention
2. Or mention just standards: \`@.vibe-kit/standards\`
3. Copilot automatically reads the mentioned files/folders as context
4. One folder mention = all your context files included!

## Difference from Cursor

**Cursor**: Auto-loads all context (no @ mentions needed)
**VS Code**: Manual @ mentions required for each prompt
`;
    
    await fs.writeFile('.vscode/VSCODE_USAGE.md', vscodeReadmeContent);
    
    console.log(chalk.green('✅ VS Code integration installed'));
    console.log(chalk.yellow('💡 Tip: Use @ mentions in Copilot Chat to include Vibe Kit context files'));
  }

  async installCLIHelpers() {
    // Create universal context.md file that references ALL standards
    // CLI tools can read this single file to understand what context is available
    const context = `# Vibe Kit - Context Entry Point

**Single file to reference for ALL context:** \`.vibe-kit/context.md\`

This file tells you what context files are available. Cursor/VS Code auto-load all files.
For CLI tools, this is your quick reference of what standards exist.

## Quick Usage

\`\`\`bash
# Claude, Gemini, Codex
claude "read .vibe-kit/context.md to see available standards, then create a button"
\`\`\`

## Available Context Files

### Standards
- \`.vibe-kit/standards/README.md\` - Standards overview
- \`.vibe-kit/standards/glossary.md\` - **Project terms & shortcuts**
- \`.vibe-kit/standards/code-style.md\` - Coding conventions
- \`.vibe-kit/standards/testing.md\` - Test patterns
- \`.vibe-kit/standards/architecture.md\` - Architecture decisions
- \`.vibe-kit/standards/ai-guidelines.md\` - AI behavior rules
- \`.vibe-kit/standards/workflows.md\` - Development workflows

### Commands
- \`.vibe-kit/commands/analyze.md\` - Analyze & customize standards
- \`.vibe-kit/commands/create-component.md\` - Create component
- \`.vibe-kit/commands/create-feature.md\` - Create feature
- \`.vibe-kit/commands/run-tests.md\` - Run tests
- \`.vibe-kit/commands/quality-check.md\` - Quality checks
- \`.vibe-kit/commands/add-documentation.md\` - Add documentation

### Templates
- \`.vibe-kit/templates/component.tsx\`
- \`.vibe-kit/templates/test.tsx\`
- \`.vibe-kit/templates/story.tsx\`
- \`.vibe-kit/templates/hook.ts\`
- \`.vibe-kit/templates/api.ts\`

## How to Use

**In Cursor/VS Code:** Everything auto-loads! Just work normally.

**In CLI tools (Claude, Gemini, Codex):**
\`\`\`bash
# Reference specific files you need:
claude "read .vibe-kit/standards/glossary.md and create a @btn for @customer login"

# Or reference multiple files:
claude "read .vibe-kit/standards/README.md .vibe-kit/standards/glossary.md and create a button"
\`\`\`
`;
    
    await fs.writeFile('.vibe-kit/context.md', context);
    await fs.writeFile('.vibe-kit/CONTEXT.md', context); // Keep uppercase for backward compatibility

    // Create CLI wrapper script
    const cliScript = `#!/bin/bash
# Vibe Kit AI CLI wrapper
# Usage: .vibe-kit/scripts/ai-cli.sh "your prompt"

CONTEXT_FILE=".vibe-kit/context.md"
AI_TOOL="\${AI_TOOL:-aider}"
PROMPT="\$@"

if [ ! -f "$CONTEXT_FILE" ]; then
  echo "❌ Vibe Kit not initialized. Run: vibe-kit install"
  exit 1
fi

CONTEXT=\$(cat "$CONTEXT_FILE")

case "$AI_TOOL" in
  "aider")
    echo "$PROMPT" | aider
    ;;
  "claude")
    echo "$CONTEXT

User: $PROMPT" | claude
    ;;
  *)
    echo "$CONTEXT

User: $PROMPT"
    ;;
esac
`;

    await fs.writeFile('.vibe-kit/scripts/ai-cli.sh', cliScript);
    await fs.chmod('.vibe-kit/scripts/ai-cli.sh', '755');
    
    console.log(chalk.green('✅ CLI helpers installed'));
  }

  async createConfiguration(projectType, gitHooksEnabled) {
    const projectName = path.basename(process.cwd());
    
    const config = {
      version: '1.0.0',
      project_name: projectName,
      project_type: projectType,
      features: {
        testing: true,
        documentation: true,
        code_review: true,
        linting: true,
        type_safety: true,
        git_hooks: gitHooksEnabled
      },
      paths: {
        components: 'src/components',
        tests: 'src/__tests__',
        stories: 'src/stories',
        docs: 'docs'
      },
      commands: {
        create_component: '@.vibe-kit/commands/create-component.md',
        create_feature: '@.vibe-kit/commands/create-feature.md',
        run_tests: '@.vibe-kit/commands/run-tests.md',
        add_docs: '@.vibe-kit/commands/add-documentation.md',
        quality_check: '@.vibe-kit/commands/quality-check.md',
        analyze: '@.vibe-kit/commands/analyze.md'
      }
    };

    await fs.writeFile('.vibe-kit/config.yml', 
      `# Vibe Kit Configuration
version: "${config.version}"
project_name: "${config.project_name}"
project_type: "${config.project_type}"

# Features
features:
  testing: ${config.features.testing}
  documentation: ${config.features.documentation}
  code_review: ${config.features.code_review}
  linting: ${config.features.linting}
  type_safety: ${config.features.type_safety}
  git_hooks: ${config.features.git_hooks}

# Paths (customize for your project)
paths:
  components: "${config.paths.components}"
  tests: "${config.paths.tests}"
  stories: "${config.paths.stories}"
  docs: "${config.paths.docs}"

# Commands
commands:
  create_component: "${config.commands.create_component}"
  create_feature: "${config.commands.create_feature}"
  run_tests: "${config.commands.run_tests}"
  add_docs: "${config.commands.add_docs}"
  quality_check: "${config.commands.quality_check}"
  analyze: "${config.commands.analyze}"
`
    );
  }

  async createStatusFile(projectType, packageManager, gitHooksEnabled) {
    try {
      const status = this.statusManager.getDefaultStatus();
      status.project_type = projectType;
      status.package_manager = packageManager;
      status.features.git_hooks = gitHooksEnabled;
      
      await this.statusManager.saveStatus(status);
      console.log(chalk.green('✅ Status tracking initialized'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Warning: Could not create status file'), error.message);
    }
  }

  showSuccessMessage(gitHooksEnabled, detectedTools = {}, projectType = '', packageManager = '') {
    console.log('');
    console.log(chalk.green('🎉 Vibe Kit v1.0.0 successfully installed!'));
    console.log('');
    
    // Quick Reference
    console.log(''.padEnd(48, '─'));
    console.log(chalk.bold('📖 Quick Reference'));
    console.log(''.padEnd(48, '─'));
    console.log(`vk status    → Check installation & integrations`);
    console.log(`vk ai <cmd>  → Use AI with project context`);
    console.log('');
    console.log(`Docs → ${chalk.blue('https://vibe-kit-docs.vercel.app')}`);
    console.log(`Issues → ${chalk.blue('https://github.com/nolrm/vibe-kit/issues')}`);
    console.log('');
    
    // Next Step Section
    console.log(''.padEnd(48, '─'));
    console.log(chalk.bold('🚀 NEXT STEP — GENERATE STANDARDS'));
    console.log(''.padEnd(48, '─'));
    
    if (detectedTools.cursor) {
      console.log(chalk.bold('In Cursor Chat:'));
      console.log(`   @.vibe-kit/commands/analyze.md`);
      console.log('');
      console.log('Or via CLI:');
      console.log(chalk.yellow('👉'), `vk analyze`);
    } else {
      console.log(chalk.yellow('👉'), `vk analyze`);
    }
    
    console.log('');
    console.log('This will:');
    console.log('  • Scan your codebase and detect patterns');
    console.log('  • Generate content for `.vibe-kit/standards/*.md` based on YOUR code');
    console.log('  • Extract domain terms and project conventions');
    console.log('  • Document your actual architecture and patterns');
    console.log('');
    console.log(chalk.blue('💡 The standards files are currently empty/skeleton'));
    console.log(chalk.blue('   Run analyze to populate them with YOUR project details'));
    console.log('');
    
    // After Analyze Section
    console.log(''.padEnd(48, '─'));
    console.log(chalk.bold('💡 After Analyze — Try This'));
    console.log(''.padEnd(48, '─'));
    
    // Platform-specific examples
    if (detectedTools.cursor) {
      console.log(chalk.bold('In Cursor Chat'));
      console.log(`@.vibe-kit/commands/create-component.md`);
      console.log(chalk.dim('"Create a Button component for customer checkout"'));
      console.log('');
    }
    
    console.log(chalk.bold('In CLI'));
    console.log(`vk ai "create a Button component for customer checkout"`);
    console.log('');
    
    if (detectedTools.claude_cli || detectedTools.gemini_cli) {
      const toolName = detectedTools.claude_cli ? 'Claude' : 'Gemini';
      console.log(chalk.bold(`In ${toolName} CLI`));
      console.log(`read .vibe-kit/commands/analyze.md and execute`);
      console.log('');
    }
    
    console.log(chalk.magenta('✨ Done! Your AI now understands your project.'));
    console.log('');
  }
}

async function install(options) {
  const installer = new InstallCommand();
  await installer.install(options);
}

module.exports = install;
