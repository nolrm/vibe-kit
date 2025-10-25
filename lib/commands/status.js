const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const StatusManager = require('../utils/status-manager');

class StatusCommand {
  constructor() {
    this.configPath = '.vibe-kit/config.yml';
    this.statusManager = new StatusManager();
  }

  async status() {
    if (!await fs.pathExists(this.configPath)) {
      console.log(chalk.red('❌ Vibe Kit is not installed in this project'));
      console.log(chalk.yellow('💡 Run: vibe-kit install'));
      return;
    }

    try {
      const config = await this.parseConfig();
      const projectType = await this.detectProjectType();
      const packageManager = await this.detectPackageManager();
      const status = await this.statusManager.getStatus();
      const analyzeInfo = await this.statusManager.getAnalyzeInfo();

      console.log(chalk.green('🎵 Vibe Kit Status'));
      console.log('');
      
      console.log(chalk.blue('📦 Installation:'));
      console.log(`   Version: ${status.version}`);
      console.log(`   Installed: ${new Date(status.installed_at).toLocaleDateString()}`);
      console.log(`   Last Updated: ${new Date(status.last_updated).toLocaleDateString()}`);
      console.log('');
      
      console.log(chalk.blue('🔍 Analysis:'));
      if (analyzeInfo.isFirstTime) {
        console.log(chalk.yellow('   Status: Not analyzed'));
        console.log(chalk.blue('   Recommendation: Run @.vibe-kit/commands/analyze.md to customize standards'));
      } else {
        console.log(chalk.green(`   Status: Completed (${new Date(analyzeInfo.lastRun).toLocaleDateString()})`));
        console.log(chalk.blue(`   Project: ${analyzeInfo.projectType || 'Unknown'}`));
        console.log(chalk.blue(`   Package Manager: ${analyzeInfo.packageManager || 'Unknown'}`));
        if (analyzeInfo.customizations.length > 0) {
          console.log(chalk.blue(`   Customizations: ${analyzeInfo.customizations.length} applied`));
        }
      }
      console.log('');
      
      console.log(chalk.blue('✅ Features:'));
      console.log(`   Git Hooks: ${status.features.git_hooks ? '✅' : '❌'}`);
      console.log(`   Standards: ${status.features.standards ? '✅' : '❌'}`);
      console.log(`   Templates: ${status.features.templates ? '✅' : '❌'}`);
      console.log('');

      // Check for updates
      const updateInfo = await this.checkForUpdates(status.version);
      if (updateInfo.hasUpdate) {
        console.log(chalk.yellow('🔄 Update Available!'));
        console.log(`   Current: ${updateInfo.currentVersion}`);
        console.log(`   Latest: ${updateInfo.latestVersion}`);
        console.log(chalk.yellow('💡 Run: vibe-kit update'));
      } else {
        console.log(chalk.green('✅ Vibe Kit is up to date'));
      }

    } catch (error) {
      console.log(chalk.red('❌ Error reading Vibe Kit configuration:'), error.message);
    }
  }

  async parseConfig() {
    const configContent = await fs.readFile(this.configPath, 'utf8');
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

  async detectProjectType() {
    if (await fs.pathExists('package.json')) {
      const packageJson = require(path.join(process.cwd(), 'package.json'));
      if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
        return 'react';
      } else if (packageJson.dependencies?.vue || packageJson.devDependencies?.vue) {
        return 'vue';
      } else if (packageJson.dependencies?.['@angular/core'] || packageJson.devDependencies?.['@angular/core']) {
        return 'angular';
      } else if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
        return 'nextjs';
      } else if (packageJson.dependencies?.nuxt || packageJson.devDependencies?.nuxt) {
        return 'nuxt';
      } else if (packageJson.dependencies?.svelte || packageJson.devDependencies?.svelte) {
        return 'svelte';
      }
      return 'node';
    } else if (await fs.pathExists('requirements.txt') || await fs.pathExists('pyproject.toml')) {
      return 'python';
    } else if (await fs.pathExists('Cargo.toml')) {
      return 'rust';
    } else if (await fs.pathExists('go.mod')) {
      return 'go';
    }
    return 'generic';
  }

  async detectPackageManager() {
    if (await fs.pathExists('yarn.lock')) {
      return 'yarn';
    } else if (await fs.pathExists('pnpm-lock.yaml')) {
      return 'pnpm';
    } else if (await fs.pathExists('package-lock.json')) {
      return 'npm';
    } else if (await fs.pathExists('package.json')) {
      return 'npm';
    }
    return 'none';
  }

  async checkForUpdates(currentVersion) {
    try {
      const axios = require('axios');
      const response = await axios.get('https://api.github.com/repos/nolrm/vibe-kit/releases/latest', {
        timeout: 5000
      });
      
      const latestVersion = response.data.tag_name.replace('v', '');
      const hasUpdate = this.isNewerVersion(latestVersion, currentVersion);
      
      return {
        hasUpdate,
        currentVersion,
        latestVersion
      };
    } catch (error) {
      return {
        hasUpdate: false,
        currentVersion,
        latestVersion: 'unknown',
        error: error.message
      };
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
}

async function status() {
  const statusChecker = new StatusCommand();
  await statusChecker.status();
}

module.exports = status;
