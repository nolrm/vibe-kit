const chalk = require('chalk');
const fs = require('fs-extra');
const BaseIntegration = require('./base-integration');

class CopilotIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'copilot';
    this.displayName = 'GitHub Copilot';
    this.bridgeFiles = ['.github/copilot-instructions.md'];
    this.generatedFiles = [];
    this.platformDir = '.github';
  }

  async generateFiles() {
    // Bridge file: .github/copilot-instructions.md (auto-loaded by Copilot Chat)
    const bridgeContent = `# Copilot Instructions (Vibe Kit)

This project uses [Vibe Kit](https://github.com/nolrm/vibe-kit) for AI development standards.

${this.getStandardsBlock()}

## Key Rules

- Follow coding conventions in \`.vibe-kit/standards/code-style.md\`
- Use numbered test cases as defined in \`.vibe-kit/standards/testing.md\`
- Check \`.vibe-kit/standards/glossary.md\` for project-specific terminology
- Reference \`.vibe-kit/templates/\` for code generation patterns`;

    await this.writeBridgeFile('.github/copilot-instructions.md', bridgeContent);

    // Merge VS Code settings for copilot
    await this.mergeVSCodeSettings();
  }

  async mergeVSCodeSettings() {
    const settingsPath = '.vscode/settings.json';
    let settings = {};

    await fs.ensureDir('.vscode');

    if (await fs.pathExists(settingsPath)) {
      try {
        settings = await fs.readJson(settingsPath);
      } catch {
        settings = {};
      }
    }

    // Add copilot instruction reference
    settings['github.copilot.chat.codeGeneration.instructions'] = [
      { file: '.github/copilot-instructions.md' }
    ];
    settings['vibeKit.standardsPath'] = '.vibe-kit/standards';
    settings['vibeKit.templatesPath'] = '.vibe-kit/templates';

    await fs.writeJson(settingsPath, settings, { spaces: 2 });
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  GitHub Copilot Usage:'));
    console.log('    .github/copilot-instructions.md is auto-loaded by Copilot Chat');
    console.log('    In Copilot Chat: @.vibe-kit Create a button component');
    console.log('    Or: @.vibe-kit/standards Create a login form');
    console.log('');
    console.log(chalk.dim('  Files created:'));
    console.log(chalk.dim('    .github/copilot-instructions.md (auto-loaded)'));
    console.log(chalk.dim('    .vscode/settings.json (updated with copilot config)'));
  }
}

module.exports = CopilotIntegration;
