const chalk = require('chalk');
const fs = require('fs-extra');
const BaseIntegration = require('./base-integration');

class CursorIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'cursor';
    this.displayName = 'Cursor';
    this.generatedFiles = [
      '.cursor/rules/vibe-kit-standards.mdc',
      '.cursor/rules/vibe-kit-testing.mdc',
      '.cursor/rules/vibe-kit-components.mdc',
      '.cursor/rules/vibe-kit-api.mdc',
    ];
    this.bridgeFiles = [];
    this.platformDir = '.cursor/rules';
  }

  async install() {
    await super.install();
    // Remove old monolithic rule file if present
    await this.removeLegacyFiles();
  }

  async removeLegacyFiles() {
    const legacyFile = '.cursor/rules/vibe-kit.mdc';
    if (await fs.pathExists(legacyFile)) {
      await fs.remove(legacyFile);
      console.log(chalk.yellow('  Removed legacy .cursor/rules/vibe-kit.mdc'));
    }
  }

  async generateFiles() {
    // Standards rule (always apply)
    const standardsRule = `---
description: Vibe Kit project standards
globs: "**/*.{ts,tsx,js,jsx,py,rs,go}"
alwaysApply: true
---

# Vibe Kit Standards

This project uses Vibe Kit for structured development standards.

## References

- @.vibe-kit/standards/code-style.md — Coding conventions
- @.vibe-kit/standards/architecture.md — Architecture patterns
- @.vibe-kit/standards/ai-guidelines.md — AI behavior rules
- @.vibe-kit/standards/glossary.md — Project terminology
- @.vibe-kit/product/mission-lite.md — Product context

## Workflow

1. Check standards before generating code
2. Follow project patterns and conventions
3. Include proper testing (numbered test cases)
4. Ensure type safety
5. Run quality checks
`;
    await this.writeGeneratedFile('.cursor/rules/vibe-kit-standards.mdc', standardsRule);

    // Testing rule (scoped to test files)
    const testingRule = `---
description: Vibe Kit testing standards
globs: "**/*.test.*, **/*.spec.*, **/__tests__/**"
alwaysApply: false
---

# Testing Standards

Reference: @.vibe-kit/standards/testing.md

## Required Pattern: Numbered Test Cases

All test cases MUST use numbered descriptions:

\`\`\`typescript
describe("ComponentName", () => {
  it("1. renders basic component", () => { /* ... */ });
  it("2. handles user interactions", () => { /* ... */ });
  it("3. displays correct content", () => { /* ... */ });
});
\`\`\`

## Templates

- @.vibe-kit/templates/test.tsx — Test template
`;
    await this.writeGeneratedFile('.cursor/rules/vibe-kit-testing.mdc', testingRule);

    // Components rule
    const componentsRule = `---
description: Vibe Kit component standards
globs: "**/components/**"
alwaysApply: false
---

# Component Standards

Reference: @.vibe-kit/standards/code-style.md

## Templates

- @.vibe-kit/templates/component.tsx — Component template
- @.vibe-kit/templates/story.tsx — Storybook template
- @.vibe-kit/templates/hook.ts — Custom hook template

## Commands

- @.vibe-kit/commands/create-component.md — Create component workflow
`;
    await this.writeGeneratedFile('.cursor/rules/vibe-kit-components.mdc', componentsRule);

    // API rule
    const apiRule = `---
description: Vibe Kit API and services standards
globs: "**/api/**, **/services/**"
alwaysApply: false
---

# API & Services Standards

Reference: @.vibe-kit/standards/architecture.md

## Templates

- @.vibe-kit/templates/api.ts — API service template

## Commands

- @.vibe-kit/commands/create-feature.md — Create feature workflow
`;
    await this.writeGeneratedFile('.cursor/rules/vibe-kit-api.mdc', apiRule);
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  Cursor Usage:'));
    console.log('    Rules auto-load based on file context');
    console.log('    In Cursor Chat: @.vibe-kit/commands/analyze.md');
    console.log('    Or: @.vibe-kit Create a button component');
    console.log('');
    console.log(chalk.dim('  Files created:'));
    console.log(chalk.dim('    .cursor/rules/vibe-kit-standards.mdc (always apply)'));
    console.log(chalk.dim('    .cursor/rules/vibe-kit-testing.mdc (test files)'));
    console.log(chalk.dim('    .cursor/rules/vibe-kit-components.mdc (components)'));
    console.log(chalk.dim('    .cursor/rules/vibe-kit-api.mdc (API/services)'));
  }
}

module.exports = CursorIntegration;
