const chalk = require('chalk');
const fs = require('fs-extra');
const BaseIntegration = require('./base-integration');

class GeminiIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'gemini';
    this.displayName = 'Google Gemini CLI';
    this.bridgeFiles = ['GEMINI.md'];
    this.generatedFiles = ['.gemini/settings.json'];
    this.platformDir = '.gemini';
  }

  async generateFiles() {
    // Bridge file: GEMINI.md (auto-loaded by Gemini CLI)
    const bridgeContent = `# Project Standards (Vibe Kit)

This project uses [Vibe Kit](https://github.com/nolrm/vibe-kit) for AI development standards.

${this.getStandardsBlock()}

## Corrections Log

- \`.vibe-kit/corrections.md\` — Track AI performance improvements

## Quick Reference

Before writing code, check the relevant standards files above. Always follow the project's established patterns and conventions.`;

    await this.writeBridgeFile('GEMINI.md', bridgeContent);

    // Gemini settings
    const settings = {
      "description": "Vibe Kit - Context Engineering",
      "contextFiles": [
        ".vibe-kit/standards/code-style.md",
        ".vibe-kit/standards/testing.md",
        ".vibe-kit/standards/architecture.md",
        ".vibe-kit/standards/ai-guidelines.md",
        ".vibe-kit/standards/glossary.md",
        ".vibe-kit/product/mission-lite.md"
      ]
    };

    await this.writeGeneratedFile('.gemini/settings.json', JSON.stringify(settings, null, 2) + '\n');
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  Gemini CLI Usage:'));
    console.log('    GEMINI.md is auto-loaded by Gemini CLI');
    console.log('    Just run: gemini "create a button component"');
    console.log('    Standards are automatically included via GEMINI.md');
    console.log('');
    console.log(chalk.dim('  Files created:'));
    console.log(chalk.dim('    GEMINI.md (bridge - auto-loaded)'));
    console.log(chalk.dim('    .gemini/settings.json (configuration)'));
  }
}

module.exports = GeminiIntegration;
