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
      console.log(chalk.blue(`📦 Installing Husky with ${packageManager}...`));
      
      try {
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
        console.log(chalk.green(`✅ Husky installed with ${packageManager}`));
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Failed to install Husky with ${packageManager}, trying fallback...`));
        // Fallback to npm if the detected package manager fails
        if (packageManager !== 'npm') {
          try {
            execSync('npm install --save-dev husky', { stdio: 'inherit' });
            console.log(chalk.green('✅ Husky installed with npm (fallback)'));
          } catch (fallbackError) {
            console.log(chalk.red('❌ Failed to install Husky with any package manager'));
            throw new Error(`Failed to install Husky: ${fallbackError.message}`);
          }
        } else {
          throw error;
        }
      }
    } else {
      console.log(chalk.green('✅ Husky already installed'));
    }
  }

  async checkHuskyInstalled(packageManager) {
    try {
      // Check if husky is in package.json dependencies
      const packageJson = await fs.readJson('package.json').catch(() => ({}));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies
      };
      
      if (allDeps.husky) {
        return true;
      }
      
      // Fallback: try package manager specific commands
      switch (packageManager) {
        case 'yarn':
          execSync('yarn list --pattern husky', { stdio: 'pipe' });
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
    // Modern Husky doesn't need explicit initialization
    // Just ensure .husky directory exists
    await fs.ensureDir(this.hooksDir);
    
    // Create husky.sh if it doesn't exist (for compatibility)
    const huskyShPath = `${this.hooksDir}/_/husky.sh`;
    if (!await fs.pathExists(huskyShPath)) {
      await fs.ensureDir(`${this.hooksDir}/_`);
      const huskyShContent = `#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
fi
`;
      await fs.writeFile(huskyShPath, huskyShContent);
      await fs.chmod(huskyShPath, '755');
    }
    
    console.log(chalk.green('✅ Husky initialized'));
  }

  async addHooks(packageManager) {
    // Backup existing hooks
    await this.backupExistingHooks();

    // Add new hooks
    const hooks = [
      { name: 'pre-commit', script: '.contextkit/hooks/pre-commit.sh' },
      { name: 'pre-push', script: '.contextkit/hooks/pre-push.sh' },
      { name: 'commit-msg', script: '.contextkit/hooks/commit-msg.sh' }
    ];

    for (const hook of hooks) {
      await this.addHook(packageManager, hook.name, hook.script);
    }
  }

  async addHook(packageManager, hookName, scriptPath) {
    const hookPath = `${this.hooksDir}/${hookName}`;
    
    // Ensure .husky directory exists
    await fs.ensureDir(this.hooksDir);
    
    // Create hook file directly (modern Husky approach)
    const hookContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${scriptPath}
`;
    
    await fs.writeFile(hookPath, hookContent);
    await fs.chmod(hookPath, '755');
    
    console.log(chalk.green(`✅ Created hook: ${hookName}`));
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
