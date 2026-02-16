const fs = require('fs-extra');
const chalk = require('chalk');

class GitHooksManager {
  constructor() {
    this.hooksDir = '.git/hooks';
  }

  async installHooks(packageManager, hookChoices = { prePush: true, commitMsg: true }) {
    console.log(chalk.yellow('🪝 Setting up Git hooks...'));

    // Check if this is a git repo
    if (!fs.existsSync('.git')) {
      console.log(chalk.yellow('⚠️  Not a git repository, skipping Git hooks setup'));
      return;
    }

    try {
      // Clean up legacy Husky directory if present
      await this.cleanupLegacyHusky();

      // Add hooks
      await this.addHooks(hookChoices);

      console.log(chalk.green('✅ Git hooks setup complete'));

    } catch (error) {
      console.log(chalk.red('❌ Git hooks setup failed:'), error.message);
      throw error;
    }
  }

  async addHooks(hookChoices = { prePush: true, commitMsg: true }) {
    // Backup existing hooks
    await this.backupExistingHooks();

    // Remove legacy pre-commit hook if it exists (replaced by pre-push)
    const legacyPreCommitHook = `${this.hooksDir}/pre-commit`;
    if (fs.existsSync(legacyPreCommitHook)) {
      const content = await fs.readFile(legacyPreCommitHook, 'utf8');
      if (content.includes('.contextkit/') || content.includes('.vibe-kit/')) {
        await fs.remove(legacyPreCommitHook);
        console.log(chalk.yellow('🧹 Removed legacy pre-commit hook (replaced by pre-push)'));
      }
    }

    // Add selected hooks
    if (hookChoices.prePush) {
      await this.addNativeHook('pre-push', '.contextkit/hooks/pre-push.sh');
    }
    if (hookChoices.commitMsg) {
      await this.addNativeHook('commit-msg', '.contextkit/hooks/commit-msg.sh');
    }
  }

  async addNativeHook(hookName, scriptPath) {
    const hookPath = `${this.hooksDir}/${hookName}`;

    // Ensure .git/hooks directory exists
    await fs.ensureDir(this.hooksDir);

    // Write hook directly — no Husky, just a shebang + delegation
    const hookContent = `#!/usr/bin/env sh
# ContextKit managed hook — do not edit
${scriptPath} "$@"
`;

    await fs.writeFile(hookPath, hookContent);
    await fs.chmod(hookPath, '755');

    console.log(chalk.green(`✅ Created hook: ${hookName}`));
  }

  async cleanupLegacyHusky() {
    if (!fs.existsSync('.husky')) return;

    // Check if the .husky dir contains ContextKit/Vibe Kit markers
    const huskyHooks = ['pre-push', 'commit-msg', 'pre-commit'];
    let hasContextKitHooks = false;

    for (const hook of huskyHooks) {
      const hookPath = `.husky/${hook}`;
      if (fs.existsSync(hookPath)) {
        const content = await fs.readFile(hookPath, 'utf8');
        if (content.includes('.contextkit/') || content.includes('.vibe-kit/')) {
          hasContextKitHooks = true;
          break;
        }
      }
    }

    if (hasContextKitHooks) {
      await fs.remove('.husky');
      console.log(chalk.yellow('🧹 Removed legacy .husky/ directory (now using native .git/hooks/)'));
      console.log(chalk.dim('   💡 You can also run: npm uninstall husky'));
    }
  }

  async backupExistingHooks() {
    const hooks = ['pre-push', 'commit-msg'];

    for (const hook of hooks) {
      const hookPath = `${this.hooksDir}/${hook}`;
      if (fs.existsSync(hookPath)) {
        // Don't back up our own hooks
        const content = await fs.readFile(hookPath, 'utf8');
        if (content.includes('ContextKit managed hook')) continue;

        const backupPath = `${hookPath}.backup`;
        await fs.copy(hookPath, backupPath);
        console.log(chalk.yellow(`📦 Backed up existing hook: ${hook}`));
      }
    }
  }

  async uninstallHooks() {
    console.log(chalk.yellow('🪝 Removing Git hooks...'));

    const hooks = ['pre-push', 'commit-msg'];

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
