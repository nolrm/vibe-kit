const { execSync } = require('child_process');
const fs = require('fs-extra');
const chalk = require('chalk');

class GitHooksManager {
  constructor() {
    this.hooksDir = '.husky';
  }

  async installHooks(packageManager) {
    console.log(chalk.yellow('🪝 Setting up Git hooks...'));

    // Check if Node.js is available
    if (!this.checkCommandExists('node')) {
      console.log(chalk.yellow('⚠️  Node.js not found, skipping Git hooks setup'));
      return;
    }

    try {
      // Install Husky based on package manager
      await this.installHusky(packageManager);

      // Initialize Husky
      await this.initializeHusky(packageManager);

      // Add hooks
      await this.addHooks(packageManager);

      console.log(chalk.green('✅ Git hooks setup complete'));

    } catch (error) {
      console.log(chalk.red('❌ Git hooks setup failed:'), error.message);
      throw error;
    }
  }

  async installHusky(packageManager) {
    const huskyInstalled = await this.checkHuskyInstalled(packageManager);
    
    if (!huskyInstalled) {
      console.log(`Installing Husky with ${packageManager}...`);
      
      switch (packageManager) {
        case 'yarn':
          execSync('yarn add --dev husky', { stdio: 'inherit' });
          break;
        case 'pnpm':
          execSync('pnpm add --save-dev husky', { stdio: 'inherit' });
          break;
        case 'npm':
        default:
          execSync('npm install --save-dev husky', { stdio: 'inherit' });
          break;
      }
    }
  }

  async checkHuskyInstalled(packageManager) {
    try {
      switch (packageManager) {
        case 'yarn':
          execSync('yarn list husky', { stdio: 'pipe' });
          return true;
        case 'pnpm':
          execSync('pnpm list husky', { stdio: 'pipe' });
          return true;
        case 'npm':
        default:
          execSync('npm list husky', { stdio: 'pipe' });
          return true;
      }
    } catch (error) {
      return false;
    }
  }

  async initializeHusky(packageManager) {
    switch (packageManager) {
      case 'yarn':
        execSync('yarn husky install', { stdio: 'inherit' });
        break;
      case 'pnpm':
        execSync('pnpm exec husky install', { stdio: 'inherit' });
        break;
      case 'npm':
      default:
        execSync('npx husky install', { stdio: 'inherit' });
        break;
    }
  }

  async addHooks(packageManager) {
    // Backup existing hooks
    await this.backupExistingHooks();

    // Add new hooks
    const hooks = [
      { name: 'pre-commit', script: '.vibe-kit/hooks/pre-commit.sh' },
      { name: 'pre-push', script: '.vibe-kit/hooks/pre-push.sh' },
      { name: 'commit-msg', script: '.vibe-kit/hooks/commit-msg.sh' }
    ];

    for (const hook of hooks) {
      await this.addHook(packageManager, hook.name, hook.script);
    }
  }

  async addHook(packageManager, hookName, scriptPath) {
    const hookPath = `${this.hooksDir}/${hookName}`;
    
    switch (packageManager) {
      case 'yarn':
        execSync(`yarn husky add ${hookPath} "${scriptPath}"`, { stdio: 'inherit' });
        break;
      case 'pnpm':
        execSync(`pnpm exec husky add ${hookPath} "${scriptPath}"`, { stdio: 'inherit' });
        break;
      case 'npm':
      default:
        execSync(`npx husky add ${hookPath} "${scriptPath}"`, { stdio: 'inherit' });
        break;
    }
  }

  async backupExistingHooks() {
    const hooks = ['pre-commit', 'pre-push', 'commit-msg'];
    
    for (const hook of hooks) {
      const hookPath = `${this.hooksDir}/${hook}`;
      if (fs.existsSync(hookPath)) {
        const backupPath = `${hookPath}.backup`;
        await fs.copy(hookPath, backupPath);
        console.log(chalk.yellow(`📦 Backed up existing hook: ${hook}`));
      }
    }
  }

  checkCommandExists(command) {
    try {
      execSync(`which ${command}`, { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async uninstallHooks() {
    console.log(chalk.yellow('🪝 Removing Git hooks...'));
    
    const hooks = ['pre-commit', 'pre-push', 'commit-msg'];
    
    for (const hook of hooks) {
      const hookPath = `${this.hooksDir}/${hook}`;
      const backupPath = `${hookPath}.backup`;
      
      if (fs.existsSync(backupPath)) {
        await fs.move(backupPath, hookPath);
        console.log(chalk.green(`✅ Restored original hook: ${hook}`));
      } else if (fs.existsSync(hookPath)) {
        await fs.remove(hookPath);
        console.log(chalk.green(`✅ Removed hook: ${hook}`));
      }
    }
  }
}

module.exports = GitHooksManager;
