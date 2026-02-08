const chalk = require('chalk');
const BaseIntegration = require('./base-integration');

class ClaudeIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'claude';
    this.displayName = 'Claude Code';
    this.bridgeFiles = ['CLAUDE.md'];
    this.generatedFiles = [
      '.claude/rules/vibe-kit-standards.md',
      '.claude/rules/vibe-kit-testing.md',
      '.claude/rules/vibe-kit-code-style.md',
      '.claude/commands/analyze.md',
    ];
    this.platformDir = '.claude/rules';
  }

  async install() {
    await super.install();
    // Also ensure commands dir
    const fs = require('fs-extra');
    await fs.ensureDir('.claude/commands');
  }

  async generateFiles() {
    // Bridge file: CLAUDE.md (auto-loaded every session)
    const bridgeContent = `# Project Standards (Vibe Kit)

This project uses [Vibe Kit](https://github.com/nolrm/vibe-kit) for AI development standards.

${this.getStandardsBlock()}

## Corrections Log

- \`.vibe-kit/corrections.md\` — Track AI performance improvements

## Quick Reference

Before writing code, check the relevant standards files above. Always follow the project's established patterns and conventions.`;

    await this.writeBridgeFile('CLAUDE.md', bridgeContent);

    // Rule: always-apply standards pointer
    const standardsRule = `---
description: Vibe Kit project standards - always loaded
alwaysApply: true
---

# Vibe Kit Standards

This project uses Vibe Kit for structured development standards.

Always reference the following before generating code:
- \`.vibe-kit/standards/code-style.md\` for coding conventions
- \`.vibe-kit/standards/architecture.md\` for architecture patterns
- \`.vibe-kit/standards/ai-guidelines.md\` for AI behavior rules
- \`.vibe-kit/standards/glossary.md\` for project terminology
- \`.vibe-kit/product/mission-lite.md\` for product context
`;
    await this.writeGeneratedFile('.claude/rules/vibe-kit-standards.md', standardsRule);

    // Rule: testing standards (scoped to test files)
    const testingRule = `---
description: Vibe Kit testing standards for test files
globs:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/__tests__/**"
---

# Testing Standards

When writing or modifying tests, follow:
- \`.vibe-kit/standards/testing.md\` for test patterns and requirements
- All test cases MUST use numbered descriptions (e.g., \`it("1. renders correctly")\`)
- Reference \`.vibe-kit/templates/test.tsx\` for test template patterns
`;
    await this.writeGeneratedFile('.claude/rules/vibe-kit-testing.md', testingRule);

    // Rule: code style (scoped to source files)
    const codeStyleRule = `---
description: Vibe Kit code style for source files
globs:
  - "src/**"
  - "lib/**"
  - "app/**"
  - "packages/**"
---

# Code Style

When writing or modifying source code, follow:
- \`.vibe-kit/standards/code-style.md\` for coding conventions
- \`.vibe-kit/templates/component.tsx\` for component patterns
- \`.vibe-kit/templates/hook.ts\` for custom hook patterns
- \`.vibe-kit/templates/api.ts\` for API service patterns
`;
    await this.writeGeneratedFile('.claude/rules/vibe-kit-code-style.md', codeStyleRule);

    // Command: analyze
    const analyzeCommand = `# Analyze Project

Read \`.vibe-kit/commands/analyze.md\` and execute the analysis workflow for this project.

Scan the codebase structure, detect frameworks and patterns, then generate customized standards files in \`.vibe-kit/standards/\`.
`;
    await this.writeGeneratedFile('.claude/commands/analyze.md', analyzeCommand);
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  Claude Code Usage:'));
    console.log('    CLAUDE.md is auto-loaded every session');
    console.log('    .claude/rules/ are loaded based on file context');
    console.log('    Use /analyze slash command for project analysis');
    console.log('');
    console.log(chalk.dim('  Files created:'));
    console.log(chalk.dim('    CLAUDE.md (bridge - auto-loaded)'));
    console.log(chalk.dim('    .claude/rules/vibe-kit-standards.md (always apply)'));
    console.log(chalk.dim('    .claude/rules/vibe-kit-testing.md (test files)'));
    console.log(chalk.dim('    .claude/rules/vibe-kit-code-style.md (source files)'));
    console.log(chalk.dim('    .claude/commands/analyze.md (slash command)'));
  }
}

module.exports = ClaudeIntegration;
