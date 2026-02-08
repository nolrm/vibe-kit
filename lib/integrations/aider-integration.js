const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const BaseIntegration = require('./base-integration');

class AiderIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'aider';
    this.displayName = 'Aider';
    this.bridgeFiles = ['CONVENTIONS.md'];
    this.generatedFiles = ['.aider/rules.md', '.aiderignore'];
    this.platformDir = '.aider';
  }

  async generateFiles() {
    // Bridge file: CONVENTIONS.md (auto-loaded by Aider)
    const bridgeContent = `# Project Conventions (Vibe Kit)

This project uses [Vibe Kit](https://github.com/nolrm/vibe-kit) for AI development standards.

${this.getStandardsBlock()}

## Key Rules

- Follow coding conventions in \`.vibe-kit/standards/code-style.md\`
- Use numbered test cases as defined in \`.vibe-kit/standards/testing.md\`
- Check \`.vibe-kit/standards/glossary.md\` for project-specific terminology
- Reference \`.vibe-kit/templates/\` for code generation patterns`;

    await this.writeBridgeFile('CONVENTIONS.md', bridgeContent);

    // .aider/rules.md — backward compat rules file
    const rulesPath = path.join(__dirname, '../../integrations/aider.rules.md');
    if (await fs.pathExists(rulesPath)) {
      await fs.copy(rulesPath, '.aider/rules.md');
    } else {
      const rules = `# Vibe Kit Rules

## Standards Reference

- @.vibe-kit/standards/code-style.md — Coding conventions
- @.vibe-kit/standards/testing.md — Testing patterns (numbered test cases required)
- @.vibe-kit/standards/architecture.md — Architecture patterns
- @.vibe-kit/standards/ai-guidelines.md — AI behavior rules
- @.vibe-kit/standards/glossary.md — Project terminology

## Templates

- @.vibe-kit/templates/component.tsx — Component template
- @.vibe-kit/templates/test.tsx — Test template
- @.vibe-kit/templates/hook.ts — Custom hook template
- @.vibe-kit/templates/api.ts — API service template

## Always Include

1. Follow project coding standards
2. Use numbered test cases
3. Include TypeScript types
4. Follow established patterns
5. Check glossary for domain terms
`;
      await fs.writeFile('.aider/rules.md', rules);
    }

    // .aiderignore — exclude vibe-kit internals from edits
    const aiderignore = `.vibe-kit/hooks/
.vibe-kit/types/
.vibe-kit/scripts/
.vibe-kit/policies/
.vibe-kit/instructions/meta/
`;
    // Only create if doesn't exist (don't overwrite user customizations)
    if (!await fs.pathExists('.aiderignore')) {
      await fs.writeFile('.aiderignore', aiderignore);
    }
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  Aider Usage:'));
    console.log('    CONVENTIONS.md is auto-loaded by Aider');
    console.log('    .aider/rules.md provides additional context');
    console.log('    Just run: aider "create a button component"');
    console.log('');
    console.log(chalk.dim('  Files created:'));
    console.log(chalk.dim('    CONVENTIONS.md (bridge - auto-loaded)'));
    console.log(chalk.dim('    .aider/rules.md (rules)'));
    console.log(chalk.dim('    .aiderignore (exclude internals)'));
  }
}

module.exports = AiderIntegration;
