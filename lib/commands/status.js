const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

class StatusCommand {
  constructor() {
    this.configPath = '.vibe-kit/config.yml';
  }

  async status() {
    if (!await fs.pathExists(this.configPath)) {
      console.log(chalk.red('❌ Vibe Kit is not installed in this project'));
      console.log(chalk.yellow('💡 Run: vibe-kit install'));
      return;
    }

    try {
      const config = await this.parseConfig();
      const projectType = this.detectProjectType();
      const packageManager = this.detectPackageManager();

      console.log(chalk.green('✅ Vibe Kit is installed in this project'));
      console.log('');
      console.log(chalk.blue('📋 Installation Details:'));
      console.log(`   Version: ${config.version}`);
      console.log(`   Project: ${config.project_name}`);
      console.log(`   Type: ${config.project_type}`);
      console.log(`   Package Manager: ${packageManager}`);
      console.log('');
      
      console.log(chalk.blue('🔧 Features:'));
      console.log(`   Testing: ${config.features.testing ? '✅' : '❌'}`);
      console.log(`   Documentation: ${config.features.documentation ? '✅' : '❌'}`);
      console.log(`   Code Review: ${config.features.code_review ? '✅' : '❌'}`);
      console.log(`   Linting: ${config.features.linting ? '✅' : '❌'}`);
      console.log(`   Type Safety: ${config.features.type_safety ? '✅' : '❌'}`);
      console.log(`   Git Hooks: ${config.features.git_hooks ? '✅' : '❌'}`);
      console.log('');

      // Check for updates
      const updateInfo = await this.checkForUpdates(config.version);
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
