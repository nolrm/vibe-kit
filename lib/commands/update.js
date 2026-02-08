const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

const DownloadManager = require('../utils/download');
const ProjectDetector = require('../utils/project-detector');
const GitHooksManager = require('../utils/git-hooks');

class UpdateCommand {
  constructor() {
    this.downloadManager = new DownloadManager();
    this.projectDetector = new ProjectDetector();
    this.gitHooksManager = new GitHooksManager();
    this.repoUrl = 'https://raw.githubusercontent.com/nolrm/vibe-kit/main';
  }

  async update(options = {}) {
    console.log(chalk.magenta('🔄 Updating Vibe Kit...'));

    // Check if Vibe Kit is installed
    if (!await fs.pathExists('.vibe-kit/config.yml')) {
      console.log(chalk.red('❌ No Vibe Kit installation found in current directory'));
      console.log(chalk.yellow('💡 Run: vibe-kit install'));
      return;
    }

    // Check for updates
    const updateInfo = await this.checkForUpdates();
    if (!updateInfo.hasUpdate && !options.force) {
      console.log(chalk.green('✅ Vibe Kit is already up to date!'));
      return;
    }

    if (updateInfo.hasUpdate) {
      console.log(chalk.blue(`📦 Updating from ${updateInfo.currentVersion} to ${updateInfo.latestVersion}`));
    }

    // Create backup
    const backupPath = await this.createBackup();

    try {
      // Detect current configuration
      const config = await this.parseConfig();
      const projectType = this.projectDetector.detectProjectType();
      const packageManager = this.projectDetector.detectPackageManager();

      // Download latest files
      await this.downloadFiles(projectType);

      // Restore user configuration
      await this.restoreUserConfig(config);

      // Update Git hooks if they were enabled
      if (config.features?.git_hooks) {
        await this.gitHooksManager.installHooks(packageManager);
      }

      // Refresh installed platform integrations
      await this.refreshIntegrations();

      // Update version in config
      await this.updateConfigVersion(updateInfo.latestVersion || '1.0.0');

      console.log(chalk.green('✅ Vibe Kit updated successfully!'));

    } catch (error) {
      console.log(chalk.red('❌ Update failed, restoring from backup...'));
      await this.restoreFromBackup(backupPath);
      throw error;
    } finally {
      // Clean up backup
      if (await fs.pathExists(backupPath)) {
        await fs.remove(backupPath);
      }
    }
  }

  async checkForUpdates() {
    try {
      const axios = require('axios');
      const response = await axios.get('https://api.github.com/repos/nolrm/vibe-kit/releases/latest', {
        timeout: 5000
      });
      
      const latestVersion = response.data.tag_name.replace('v', '');
      const currentVersion = await this.getCurrentVersion();
      const hasUpdate = this.isNewerVersion(latestVersion, currentVersion);
      
      return {
        hasUpdate,
        currentVersion,
        latestVersion
      };
    } catch (error) {
      return {
        hasUpdate: true, // Assume update available if we can't check
        currentVersion: await this.getCurrentVersion(),
        latestVersion: 'latest',
        error: error.message
      };
    }
  }

  async getCurrentVersion() {
    try {
      const config = await this.parseConfig();
      return config.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  isNewerVersion(latest, current) {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);
    
    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
      const latestPart = latestParts[i] || 0;
      const currentPart = currentParts[i] || 0;
      
      if (latestPart > currentPart) return true;
      if (latestPart < currentPart) return false;
    }
    
    return false;
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `.vibe-kit-backup-${timestamp}`;
    
    await fs.copy('.vibe-kit', backupPath);
    return backupPath;
  }

  async restoreFromBackup(backupPath) {
    await fs.remove('.vibe-kit');
    await fs.copy(backupPath, '.vibe-kit');
  }

  async parseConfig() {
    const configContent = await fs.readFile('.vibe-kit/config.yml', 'utf8');
    const config = {};
    
    // Simple YAML parsing for our config format
    const lines = configContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('version:')) {
        config.version = trimmed.split('version:')[1].trim().replace(/"/g, '');
      } else if (trimmed.startsWith('project_name:')) {
        config.project_name = trimmed.split('project_name:')[1].trim().replace(/"/g, '');
      } else if (trimmed.startsWith('project_type:')) {
        config.project_type = trimmed.split('project_type:')[1].trim().replace(/"/g, '');
      } else if (trimmed.startsWith('testing:')) {
        config.features = config.features || {};
        config.features.testing = trimmed.split('testing:')[1].trim() === 'true';
      } else if (trimmed.startsWith('documentation:')) {
        config.features = config.features || {};
        config.features.documentation = trimmed.split('documentation:')[1].trim() === 'true';
      } else if (trimmed.startsWith('code_review:')) {
        config.features = config.features || {};
        config.features.code_review = trimmed.split('code_review:')[1].trim() === 'true';
      } else if (trimmed.startsWith('linting:')) {
        config.features = config.features || {};
        config.features.linting = trimmed.split('linting:')[1].trim() === 'true';
      } else if (trimmed.startsWith('type_safety:')) {
        config.features = config.features || {};
        config.features.type_safety = trimmed.split('type_safety:')[1].trim() === 'true';
      } else if (trimmed.startsWith('git_hooks:')) {
        config.features = config.features || {};
        config.features.git_hooks = trimmed.split('git_hooks:')[1].trim() === 'true';
      }
    }

    return config;
  }

  async downloadFiles(projectType) {
    const spinner = ora('Downloading latest files...').start();

    try {
      // Download only the real files (not skeleton files - those come from install)
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/README.md`,
        '.vibe-kit/standards/README.md'
      );
      
      // Keep glossary updated (universal file)
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

      spinner.succeed('Files updated successfully');
    } catch (error) {
      spinner.fail('Failed to download files');
      throw error;
    }
  }

  async restoreUserConfig(config) {
    // Restore user's project-specific configuration
    const configContent = `# Vibe Kit Configuration
version: "${config.version}"
project_name: "${config.project_name}"
project_type: "${config.project_type}"

# Features
features:
  testing: ${config.features?.testing || true}
  documentation: ${config.features?.documentation || true}
  code_review: ${config.features?.code_review || true}
  linting: ${config.features?.linting || true}
  type_safety: ${config.features?.type_safety || true}
  git_hooks: ${config.features?.git_hooks || false}

# Paths (customize for your project)
paths:
  components: "${config.paths?.components || 'src/components'}"
  tests: "${config.paths?.tests || 'src/__tests__'}"
  stories: "${config.paths?.stories || 'src/stories'}"
  docs: "${config.paths?.docs || 'docs'}"

# Commands
commands:
  create_component: "${config.commands?.create_component || '@.vibe-kit/commands/create-component.md'}"
  create_feature: "${config.commands?.create_feature || '@.vibe-kit/commands/create-feature.md'}"
  run_tests: "${config.commands?.run_tests || '@.vibe-kit/commands/run-tests.md'}"
  add_docs: "${config.commands?.add_docs || '@.vibe-kit/commands/add-documentation.md'}"
  quality_check: "${config.commands?.quality_check || '@.vibe-kit/commands/quality-check.md'}"
  analyze: "${config.commands?.analyze || '@.vibe-kit/commands/analyze.md'}"
`;

    await fs.writeFile('.vibe-kit/config.yml', configContent);
  }

  async refreshIntegrations() {
    const { getAllIntegrationNames, getIntegration } = require('../integrations');

    let refreshed = 0;
    for (const name of getAllIntegrationNames()) {
      const integration = getIntegration(name);
      const result = await integration.validate();

      // Only refresh integrations that already have files installed
      if (result.present.length > 0) {
        try {
          await integration.install();
          refreshed++;
        } catch {
          // Skip failed refreshes silently
        }
      }
    }

    if (refreshed > 0) {
      console.log(chalk.green(`  ✅ Refreshed ${refreshed} platform integration(s)`));
    }
  }

  async updateConfigVersion(version) {
    const configContent = await fs.readFile('.vibe-kit/config.yml', 'utf8');
    const updatedContent = configContent.replace(
      /version: "[^"]*"/,
      `version: "${version}"`
    );
    await fs.writeFile('.vibe-kit/config.yml', updatedContent);
  }
}

async function update(options) {
  const updater = new UpdateCommand();
  await updater.update(options);
}

module.exports = update;
