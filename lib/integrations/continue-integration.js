const chalk = require('chalk');
const fs = require('fs-extra');
const BaseIntegration = require('./base-integration');

class ContinueIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'continue';
    this.displayName = 'Continue';
    this.generatedFiles = [
      '.continue/rules/vibe-kit-standards.md',
      '.continue/config.yaml',
    ];
    this.bridgeFiles = [];
    this.platformDir = '.continue/rules';
  }

  async generateFiles() {
    // Rule file with frontmatter
    const standardsRule = `---
description: Vibe Kit project standards
alwaysApply: true
---

# Vibe Kit Standards

This project uses Vibe Kit for structured development standards.

## References

- \`.vibe-kit/standards/code-style.md\` — Coding conventions
- \`.vibe-kit/standards/testing.md\` — Testing patterns (numbered test cases required)
- \`.vibe-kit/standards/architecture.md\` — Architecture patterns
- \`.vibe-kit/standards/ai-guidelines.md\` — AI behavior rules
- \`.vibe-kit/standards/glossary.md\` — Project terminology

## Commands

- \`.vibe-kit/commands/analyze.md\` — Analyze and customize standards
- \`.vibe-kit/commands/create-component.md\` — Create components
- \`.vibe-kit/commands/create-feature.md\` — Create features
- \`.vibe-kit/commands/run-tests.md\` — Run tests
- \`.vibe-kit/commands/quality-check.md\` — Quality checks
`;
    await this.writeGeneratedFile('.continue/rules/vibe-kit-standards.md', standardsRule);

    // config.yaml (new YAML format)
    const configYaml = `# Continue Configuration (Vibe Kit)
# See: https://docs.continue.dev/reference

name: Vibe Kit Standards

rules:
  - rules/vibe-kit-standards.md

context:
  - provider: file
    params:
      files:
        - .vibe-kit/standards/code-style.md
        - .vibe-kit/standards/testing.md
        - .vibe-kit/standards/architecture.md
        - .vibe-kit/standards/ai-guidelines.md
        - .vibe-kit/standards/glossary.md
        - .vibe-kit/product/mission-lite.md
`;

    // Only write config.yaml if neither config.yaml nor config.json exists
    if (!await fs.pathExists('.continue/config.yaml') && !await fs.pathExists('.continue/config.json')) {
      await this.writeGeneratedFile('.continue/config.yaml', configYaml);
    } else if (await fs.pathExists('.continue/config.yaml')) {
      // Update existing yaml
      await this.writeGeneratedFile('.continue/config.yaml', configYaml);
    }
    // If config.json exists, leave it alone (user may have custom config)
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  Continue Usage:'));
    console.log('    Rules auto-load from .continue/rules/');
    console.log('    Continue will include Vibe Kit context automatically');
    console.log('');
    console.log(chalk.dim('  Files created:'));
    console.log(chalk.dim('    .continue/rules/vibe-kit-standards.md (always apply)'));
    console.log(chalk.dim('    .continue/config.yaml (configuration)'));
  }
}

module.exports = ContinueIntegration;
