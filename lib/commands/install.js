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
    console.log(chalk.magenta('🎵 Installing Vibe Kit...'));
    
    // Detect project type
    const projectType = this.projectDetector.detectProjectType();
    const packageManager = this.projectDetector.detectPackageManager();
    
    console.log(chalk.blue(`🔍 Detected project type: ${projectType}`));
    console.log(chalk.blue(`📦 Detected package manager: ${packageManager}`));

    // Detect AI tools
    const detectedTools = await this.toolDetector.detectAll();
    const summary = this.toolDetector.getSummary();
    
    if (summary && summary.count > 0) {
      console.log(chalk.green(`✅ AI Tools detected: ${summary.editors.join(', ')}${summary.cli.length > 0 ? ', ' + summary.cli.join(', ') : ''}`));
    } else {
      console.log(chalk.yellow('⚠️  No AI tools detected'));
      console.log(chalk.blue('💡 Universal context files will still be installed'));
    }

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
    await this.downloadFiles(projectType, options);

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
    this.showSuccessMessage(installHooks);
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
    console.log(chalk.blue('🪝 Git Hooks Setup'));
    console.log(chalk.yellow('Vibe Kit can install pre-commit and pre-push hooks to automatically run quality checks.'));
    console.log(chalk.yellow('These hooks will run tests, linting, and type checking before commits.'));
    console.log('');

    const { installHooks } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installHooks',
        message: 'Do you want to install Git hooks?',
        default: true
      }
    ]);

    if (installHooks) {
      console.log(chalk.green('✅ Git hooks will be installed'));
    } else {
      console.log(chalk.yellow('⏭️  Skipping Git hooks installation'));
      console.log(chalk.blue('💡 You can install them later by running: vibe-kit update'));
    }

    return installHooks;
  }

  async createDirectoryStructure() {
    const spinner = ora('Creating directory structure...').start();
    
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
      '.claude'
    ];

    for (const dir of platformDirs) {
      await fs.ensureDir(dir);
    }

    spinner.succeed('Directory structure created');
  }

  async downloadFiles(projectType, options = {}) {
    const spinner = ora('Downloading Vibe Kit files...').start();

    try {
      // Download base files
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/README.md`,
        '.vibe-kit/standards/README.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/code-style.md`,
        '.vibe-kit/standards/code-style.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/testing.md`,
        '.vibe-kit/standards/testing.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/architecture.md`,
        '.vibe-kit/standards/architecture.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/workflows.md`,
        '.vibe-kit/standards/workflows.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/ai-guidelines.md`,
        '.vibe-kit/standards/ai-guidelines.md'
      );
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

      spinner.succeed('Files downloaded successfully');
    } catch (error) {
      spinner.fail('Failed to download files');
      throw error;
    }

    // Install platform integrations
    await this.installPlatformIntegrations();
  }

  async installPlatformIntegrations() {
    const spinner = ora('Installing platform integrations...').start();
    
    try {
      // Get detected tools
      const detectedTools = await this.toolDetector.detectAll();
      
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

      spinner.succeed('Platform integrations installed');
    } catch (error) {
      spinner.fail('Failed to install platform integrations');
      console.log(chalk.yellow(error.message));
    }
  }

  async installCursorIntegration() {
    // Cursor integration already downloaded above
    console.log(chalk.green('  ✅ Cursor integration installed'));
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
    console.log(chalk.green('  ✅ Continue integration installed'));
  }

  async installAiderIntegration() {
    // Copy aider rules from integrations folder
    const rulesFile = path.join(__dirname, '../../integrations/aider.rules.md');
    if (await fs.pathExists(rulesFile)) {
      await fs.copy(rulesFile, '.aider/rules.md');
      console.log(chalk.green('  ✅ Aider integration installed'));
    } else {
      // Create basic aider rules
      const rules = `# Vibe Kit Rules\n\nReference: .vibe-kit/standards/*.md\n`;
      await fs.writeFile('.aider/rules.md', rules);
      console.log(chalk.green('  ✅ Aider integration installed'));
    }
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
    
    console.log(chalk.green('  ✅ VS Code integration installed'));
    console.log(chalk.yellow('  💡 Tip: Use @ mentions in Copilot Chat to include Vibe Kit context files'));
  }

  async installCLIHelpers() {
    // Create universal CONTEXT.md file
    const context = `
# Vibe Kit Project Standards

This file contains your project's standards. Reference this file when using CLI AI tools.

## Standards
- Code Style: .vibe-kit/standards/code-style.md
- Testing: .vibe-kit/standards/testing.md
- Architecture: .vibe-kit/standards/architecture.md
- AI Guidelines: .vibe-kit/standards/ai-guidelines.md

## Templates
- Component: .vibe-kit/templates/component.tsx
- Test: .vibe-kit/templates/test.tsx

## Usage with CLI tools

### With Aider:
aider "create a button component"

### With Claude:
claude "read .vibe-kit/CONTEXT.md and create a button component"

### With vibe-kit wrapper:
vibe-kit ai "create a button component"
`;
    
    await fs.writeFile('.vibe-kit/CONTEXT.md', context);

    // Create CLI wrapper script
    const cliScript = `#!/bin/bash
# Vibe Kit AI CLI wrapper
# Usage: .vibe-kit/scripts/ai-cli.sh "your prompt"

CONTEXT_FILE=".vibe-kit/CONTEXT.md"
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
    
    console.log(chalk.green('  ✅ CLI helpers installed'));
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

  showSuccessMessage(gitHooksEnabled) {
    console.log('');
    console.log(chalk.green('🎉 Vibe Kit v1.0.0 successfully installed!'));
    console.log('');
    console.log(chalk.blue('📖 Next steps:'));
    console.log('1. Read .vibe-kit/standards/README.md to understand the standards');
    console.log('2. Customize .vibe-kit/config.yml for your project');
    console.log('3. Start using AI commands with @.vibe-kit/ references');
    console.log(chalk.yellow('4. 🔍 Run @.vibe-kit/commands/analyze.md to customize standards for your project'));
    
    if (gitHooksEnabled) {
      console.log('5. Git hooks are active - quality checks will run automatically');
    } else {
      console.log('5. To install Git hooks later: vibe-kit update');
    }
    
    console.log('');
    console.log(chalk.yellow('💡 Try: "Create a Button component following vibe-kit standards"'));
    console.log('');
    console.log(chalk.blue('🔗 Documentation: https://github.com/nolrm/vibe-kit'));
    console.log(chalk.magenta('🎵 Get the right vibe for your code!'));
  }
}

async function install(options) {
  const installer = new InstallCommand();
  await installer.install(options);
}

module.exports = install;
