const chalk = require('chalk');
const BaseIntegration = require('./base-integration');

class CodexIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'codex';
    this.displayName = 'OpenAI Codex CLI';
    this.bridgeFiles = ['AGENTS.md'];
    this.generatedFiles = [];
    this.platformDir = '';
  }

  async generateFiles() {
    // Bridge file: AGENTS.md (auto-loaded by Codex CLI)
    const bridgeContent = `# Project Standards (ContextKit)

This project uses [ContextKit](https://github.com/nolrm/contextkit) for AI development standards.

${this.getStandardsBlock()}

## Corrections Log

- \`.contextkit/corrections.md\` — Track AI performance improvements

## Quick Reference

Before writing code, check the relevant standards files above. Always follow the project's established patterns and conventions.`;

    await this.writeBridgeFile('AGENTS.md', bridgeContent);
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  Codex CLI Usage:'));
    console.log('    AGENTS.md is auto-loaded by Codex CLI');
    console.log('    Just run: codex "create a button component"');
    console.log('    Standards are automatically included via AGENTS.md');
    console.log('');
    console.log(chalk.dim('  Files created:'));
    console.log(chalk.dim('    AGENTS.md (bridge - auto-loaded)'));
  }
}

module.exports = CodexIntegration;
