#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { install, update, status } = require('../lib');
const analyze = require('../lib/commands/analyze');
const ai = require('../lib/commands/ai');
const packageJson = require('../package.json');

// Set up the CLI
program
  .name('vibe-kit')
  .description('Get the right vibe for your code - Complete AI development toolkit')
  .version(packageJson.version, '-v, --version', 'Show version number');

// Install command
program
  .command('install')
  .description('Install Vibe Kit in current project')
  .option('--no-hooks', 'Skip Git hooks installation')
  .option('--non-interactive', 'Skip interactive prompts')
  .action(async (options) => {
    try {
      await install(options);
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Check installation status')
  .action(async () => {
    try {
      await status();
    } catch (error) {
      console.error(chalk.red('❌ Status check failed:'), error.message);
      process.exit(1);
    }
  });

// Update command
program
  .command('update')
  .description('Update to latest version')
  .option('--force', 'Force update even if no changes')
  .action(async (options) => {
    try {
      await update(options);
    } catch (error) {
      console.error(chalk.red('❌ Update failed:'), error.message);
      process.exit(1);
    }
  });

// Analyze command
program
  .command('analyze')
  .description('Analyze project and customize Vibe Kit standards')
  .option('--ai <tool>', 'AI tool to use (aider, claude, gemini)')
  .action(async (options) => {
    try {
      await analyze(options);
    } catch (error) {
      console.error(chalk.red('❌ Analysis failed:'), error.message);
      process.exit(1);
    }
  });

// AI command with "ai" keyword
program
  .command('ai <prompt>')
  .description('Chat with AI using Vibe Kit context')
  .option('--ai <tool>', 'AI tool to use (aider, claude, gemini)')
  .action(async (prompt, options) => {
    try {
      await ai(prompt, options);
    } catch (error) {
      console.error(chalk.red('❌ AI chat failed:'), error.message);
      process.exit(1);
    }
  });

// Platform-specific install commands
program
  .command('cursor')
  .description('Install Cursor integration only')
  .option('--non-interactive', 'Skip interactive prompts')
  .action(async (options) => {
    try {
      await install({ platform: 'cursor', ...options });
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('continue')
  .description('Install Continue integration only')
  .option('--non-interactive', 'Skip interactive prompts')
  .action(async (options) => {
    try {
      await install({ platform: 'continue', ...options });
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('aider')
  .description('Install Aider integration only')
  .option('--non-interactive', 'Skip interactive prompts')
  .action(async (options) => {
    try {
      await install({ platform: 'aider', ...options });
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('vscode')
  .description('Install VS Code integration only')
  .option('--non-interactive', 'Skip interactive prompts')
  .action(async (options) => {
    try {
      await install({ platform: 'vscode', ...options });
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('claude')
  .description('Install Claude CLI integration only')
  .option('--non-interactive', 'Skip interactive prompts')
  .action(async (options) => {
    try {
      await install({ platform: 'claude', ...options });
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('gemini')
  .description('Install Gemini CLI integration only')
  .option('--non-interactive', 'Skip interactive prompts')
  .action(async (options) => {
    try {
      await install({ platform: 'gemini', ...options });
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  });

// Catch-all for unknown commands (treats them as prompts)
// This MUST be registered AFTER all commands but BEFORE parse()
program.on('command:*', function(args) {
  // The command wasn't found, treat it as a prompt
  const prompt = args.join(' ');
  
  if (prompt) {
    try {
      ai(prompt, {}).catch(error => {
        console.error(chalk.red('❌ AI chat failed:'), error.message);
        process.exit(1);
      });
    } catch (error) {
      console.error(chalk.red('❌ AI chat failed:'), error.message);
      process.exit(1);
    }
  }
});

// Parse command line arguments
program.parse();
