const chalk = require('chalk');
const BaseIntegration = require('./base-integration');

class ClaudeIntegration extends BaseIntegration {
  constructor() {
    super();
    this.name = 'claude';
    this.displayName = 'Claude Code';
    this.bridgeFiles = ['CLAUDE.md'];
    this.generatedFiles = [
      '.claude/rules/contextkit-standards.md',
      '.claude/rules/contextkit-testing.md',
      '.claude/rules/contextkit-code-style.md',
      '.claude/commands/analyze.md',
      '.claude/commands/review.md',
      '.claude/commands/fix.md',
      '.claude/commands/refactor.md',
      '.claude/commands/test.md',
      '.claude/commands/doc.md',
      '.claude/commands/squad.md',
      '.claude/commands/squad-architect.md',
      '.claude/commands/squad-dev.md',
      '.claude/commands/squad-test.md',
      '.claude/commands/squad-review.md',
    ];
    this.platformDir = '.claude/rules';
  }

  async install() {
    await super.install();
    const fs = require('fs-extra');
    await fs.ensureDir('.claude/commands');
    await this.removeLegacyFiles();
  }

  async removeLegacyFiles() {
    const fs = require('fs-extra');
    const legacyFiles = [
      '.claude/rules/vibe-kit-standards.md',
      '.claude/rules/vibe-kit-testing.md',
      '.claude/rules/vibe-kit-code-style.md',
    ];
    for (const file of legacyFiles) {
      if (await fs.pathExists(file)) {
        await fs.remove(file);
      }
    }
  }

  async generateFiles() {
    // Bridge file: CLAUDE.md (auto-loaded every session)
    const bridgeContent = `# Project Standards (ContextKit)

This project uses [ContextKit](https://github.com/nolrm/contextkit) for AI development standards.

${this.getStandardsBlock()}

## Corrections Log

- \`.contextkit/corrections.md\` — Track AI performance improvements

## Quick Reference

Before writing code, check the relevant standards files above. Always follow the project's established patterns and conventions.`;

    await this.writeBridgeFile('CLAUDE.md', bridgeContent);

    // Rule: always-apply standards pointer
    const standardsRule = `---
description: ContextKit project standards - always loaded
alwaysApply: true
---

# ContextKit Standards

This project uses ContextKit for structured development standards.

Always reference the following before generating code:
- \`.contextkit/standards/code-style.md\` for coding conventions
- \`.contextkit/standards/architecture.md\` for architecture patterns
- \`.contextkit/standards/ai-guidelines.md\` for AI behavior rules
- \`.contextkit/standards/glossary.md\` for project terminology
- \`.contextkit/product/mission-lite.md\` for product context
`;
    await this.writeGeneratedFile('.claude/rules/contextkit-standards.md', standardsRule);

    // Rule: testing standards (scoped to test files)
    const testingRule = `---
description: ContextKit testing standards for test files
globs:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/__tests__/**"
---

# Testing Standards

When writing or modifying tests, follow:
- \`.contextkit/standards/testing.md\` for test patterns and requirements
- All test cases MUST use numbered descriptions (e.g., \`it("1. renders correctly")\`)
- Reference \`.contextkit/templates/test.md\` for test template patterns
`;
    await this.writeGeneratedFile('.claude/rules/contextkit-testing.md', testingRule);

    // Rule: code style (scoped to source files)
    const codeStyleRule = `---
description: ContextKit code style for source files
globs:
  - "src/**"
  - "lib/**"
  - "app/**"
  - "packages/**"
---

# Code Style

When writing or modifying source code, follow:
- \`.contextkit/standards/code-style.md\` for coding conventions
- \`.contextkit/templates/component.md\` for component patterns
- \`.contextkit/templates/hook.md\` for custom hook patterns
- \`.contextkit/templates/api.md\` for API service patterns
`;
    await this.writeGeneratedFile('.claude/rules/contextkit-code-style.md', codeStyleRule);

    // Slash commands — thin wrappers that delegate to .contextkit/commands/
    await this.writeGeneratedFile('.claude/commands/analyze.md', `# Analyze Project

Read \`.contextkit/commands/analyze.md\` and execute the analysis workflow for this project.

Scan the codebase structure, detect frameworks and patterns, then generate customized standards files in \`.contextkit/standards/\`.
`);

    await this.writeGeneratedFile('.claude/commands/review.md', `# Code Review

Read \`.contextkit/commands/review.md\` and execute the review workflow.

Review current changes for correctness, standards compliance, and potential issues.
`);

    await this.writeGeneratedFile('.claude/commands/fix.md', `# Fix Bug

Read \`.contextkit/commands/fix.md\` and execute the bug fix workflow.

Diagnose the root cause, implement the minimal fix, and add a regression test.
`);

    await this.writeGeneratedFile('.claude/commands/refactor.md', `# Refactor

Read \`.contextkit/commands/refactor.md\` and execute the refactoring workflow.

Improve code structure without changing behavior, keeping tests green at every step.
`);

    await this.writeGeneratedFile('.claude/commands/test.md', `# Run Tests

Read \`.contextkit/commands/run-tests.md\` and execute the testing workflow.

Generate or run tests for the specified code, covering happy paths, edge cases, and errors.
`);

    await this.writeGeneratedFile('.claude/commands/doc.md', `# Add Documentation

Read \`.contextkit/commands/add-documentation.md\` and execute the documentation workflow.

Add inline docs, README sections, and usage examples for the specified code.
`);

    // Squad slash commands
    await this.writeGeneratedFile('.claude/commands/squad.md', `# Squad — Kickoff

Read \`.contextkit/commands/squad.md\` and execute the squad kickoff workflow.

Create the handoff file and write the PO spec for the given task. Pass the user's task description as the input.
`);

    await this.writeGeneratedFile('.claude/commands/squad-architect.md', `# Squad — Architect

Read \`.contextkit/commands/squad-architect.md\` and execute the architect workflow.

Read the PO spec from the handoff file, design the technical approach, and write the implementation plan.
`);

    await this.writeGeneratedFile('.claude/commands/squad-dev.md', `# Squad — Dev

Read \`.contextkit/commands/squad-dev.md\` and execute the dev workflow.

Follow the architect's plan to implement the code changes.
`);

    await this.writeGeneratedFile('.claude/commands/squad-test.md', `# Squad — Test

Read \`.contextkit/commands/squad-test.md\` and execute the test workflow.

Write and run tests against the PO's acceptance criteria.
`);

    await this.writeGeneratedFile('.claude/commands/squad-review.md', `# Squad — Review

Read \`.contextkit/commands/squad-review.md\` and execute the review workflow.

Review the full handoff (spec, plan, implementation, tests) and write the final verdict.
`);
  }

  showUsage() {
    console.log('');
    console.log(chalk.bold('  Claude Code Usage:'));
    console.log('    CLAUDE.md is auto-loaded every session');
    console.log('    .claude/rules/ are loaded based on file context');
    console.log('');
    console.log(chalk.dim('  Slash commands:'));
    console.log(chalk.dim('    /analyze  — Analyze project and generate standards'));
    console.log(chalk.dim('    /review   — Review current changes'));
    console.log(chalk.dim('    /fix      — Diagnose and fix a bug'));
    console.log(chalk.dim('    /refactor — Refactor code structure'));
    console.log(chalk.dim('    /test     — Generate or run tests'));
    console.log(chalk.dim('    /doc      — Add documentation'));
    console.log(chalk.dim(''));
    console.log(chalk.dim('  Squad (multi-agent workflow):'));
    console.log(chalk.dim('    /squad "task"      — Kickoff: create handoff + PO spec'));
    console.log(chalk.dim('    /squad-architect   — Design the implementation plan'));
    console.log(chalk.dim('    /squad-dev         — Implement the code'));
    console.log(chalk.dim('    /squad-test        — Write and run tests'));
    console.log(chalk.dim('    /squad-review      — Review and write verdict'));
  }
}

module.exports = ClaudeIntegration;
