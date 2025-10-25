#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { install, update, status } = require('../lib');

// Set up the CLI
program
  .name('vibe-kit')
  .description('Get the right vibe for your code - Complete AI development toolkit')
  .version('0.1.0', '-v, --version', 'Show version number');

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

// Parse command line arguments
program.parse();
