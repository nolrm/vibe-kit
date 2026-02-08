const chalk = require('chalk');
const BaseIntegration = require('./base-integration');

class WindsurfIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'windsurf';
    this.displayName = 'Windsurf';
    this.bridgeFiles = ['.windsurfrules'];
    this.generatedFiles = ['.windsurf/rules/vibe-kit-standards.md'];
    this.platformDir = '.windsurf/rules';
  }

  async generateFiles() {
    // Bridge file: .windsurfrules (auto-loaded by Windsurf)
    const bridgeContent = `# Project Standards (Vibe Kit)

This project uses [Vibe Kit](https://github.com/nolrm/vibe-kit) for AI development standards.

${this.getStandardsBlock()}

## Key Rules

- Follow coding conventions in \`.vibe-kit/standards/code-style.md\`
- Use numbered test cases as defined in \`.vibe-kit/standards/testing.md\`
- Check \`.vibe-kit/standards/glossary.md\` for project-specific terminology
- Reference \`.vibe-kit/templates/\` for code generation patterns`;

    await this.writeBridgeFile('.windsurfrules', bridgeContent);

    // Modular rules file
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
- \`.vibe-kit/product/mission-lite.md\` — Product context

## Templates

- \`.vibe-kit/templates/component.tsx\` — Component template
- \`.vibe-kit/templates/test.tsx\` — Test template
- \`.vibe-kit/templates/hook.ts\` — Custom hook template
- \`.vibe-kit/templates/api.ts\` — API service template

## Commands

- \`.vibe-kit/commands/analyze.md\` — Analyze and customize standards
- \`.vibe-kit/commands/create-component.md\` — Create components
- \`.vibe-kit/commands/create-feature.md\` — Create features
`;
    await this.writeGeneratedFile('.windsurf/rules/vibe-kit-standards.md', standardsRule);
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  Windsurf Usage:'));
    console.log('    .windsurfrules is auto-loaded by Windsurf');
    console.log('    .windsurf/rules/ provides additional context');
    console.log('');
    console.log(chalk.dim('  Files created:'));
    console.log(chalk.dim('    .windsurfrules (bridge - auto-loaded)'));
    console.log(chalk.dim('    .windsurf/rules/vibe-kit-standards.md (rules)'));
  }
}

module.exports = WindsurfIntegration;
