const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const DownloadManager = require('../utils/download');
const ProjectDetector = require('../utils/project-detector');
const GitHooksManager = require('../utils/git-hooks');

class InstallCommand {
  constructor() {
    this.downloadManager = new DownloadManager();
    this.projectDetector = new ProjectDetector();
    this.gitHooksManager = new GitHooksManager();
    this.repoUrl = 'https://raw.githubusercontent.com/nolrm/vibe-kit/main';
  }

  async install(options = {}) {
    console.log(chalk.magenta('🎵 Installing Vibe Kit...'));
    
    // Detect project type
    const projectType = this.projectDetector.detectProjectType();
    const packageManager = this.projectDetector.detectPackageManager();
    
    console.log(chalk.blue(`🔍 Detected project type: ${projectType}`));
    console.log(chalk.blue(`📦 Detected package manager: ${packageManager}`));

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
    await this.downloadFiles(projectType);

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
      '.vibe-kit/scripts'
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
    }

    // Create .cursor/rules directory safely
    await fs.ensureDir('.cursor/rules');

    spinner.succeed('Directory structure created');
  }

  async downloadFiles(projectType) {
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
        `${this.repoUrl}/scripts/update.sh`,
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
        quality_check: '@.vibe-kit/commands/quality-check.md'
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
`
    );
  }

  showSuccessMessage(gitHooksEnabled) {
    console.log('');
    console.log(chalk.green('🎉 Vibe Kit v1.0.0 successfully installed!'));
    console.log('');
    console.log(chalk.blue('📖 Next steps:'));
    console.log('1. Read .vibe-kit/standards/README.md to understand the standards');
    console.log('2. Customize .vibe-kit/config.yml for your project');
    console.log('3. Start using AI commands with @.vibe-kit/ references');
    
    if (gitHooksEnabled) {
      console.log('4. Git hooks are active - quality checks will run automatically');
    } else {
      console.log('4. To install Git hooks later: vibe-kit update');
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
