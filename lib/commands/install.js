const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const DownloadManager = require('../utils/download');
const ProjectDetector = require('../utils/project-detector');
const GitHooksManager = require('../utils/git-hooks');
const StatusManager = require('../utils/status-manager');
const ToolDetector = require('../utils/tool-detector');

class InstallCommand {
  constructor() {
    this.downloadManager = new DownloadManager();
    this.projectDetector = new ProjectDetector();
    this.gitHooksManager = new GitHooksManager();
    this.statusManager = new StatusManager();
    this.toolDetector = new ToolDetector();
    this.repoUrl = 'https://raw.githubusercontent.com/nolrm/vibe-kit/main';
  }

  async install(options = {}) {
    const requestedPlatform = options.platform;
    const isPlatformSpecific = !!requestedPlatform;
    
    // Handle platform-specific installation
    if (isPlatformSpecific) {
      const isInstalled = await this.isAlreadyInstalled();
      
      if (!isInstalled) {
        console.log(chalk.red('❌ .vibe-kit is not installed'));
        console.log(chalk.yellow('💡 Run: vibe-kit install'));
        console.log(chalk.dim('   This installs the base .vibe-kit directory'));
        console.log(chalk.dim('   Then you can run: vibe-kit ' + requestedPlatform));
        return;
      }
      
      // .vibe-kit exists, just add the platform integration
      console.log(chalk.green('✓ .vibe-kit already exists'));
      console.log(chalk.blue(`🔧 Adding ${requestedPlatform} integration...`));
      console.log('');
      await this.installPlatformIntegration(requestedPlatform);
      return;
    }
    
    // Full installation
    console.log(chalk.magenta('🎵 Installing Vibe Kit...'));
    console.log('');
    
    // Detect project type
    const projectType = this.projectDetector.detectProjectType();
    const packageManager = this.projectDetector.detectPackageManager();
    
    console.log(chalk.green(`🧩 Detected project: ${projectType}`));
    console.log(chalk.green(`📦 Package manager: ${packageManager}`));

    // Detect AI tools
    const detectedTools = await this.toolDetector.detectAll();
    const summary = this.toolDetector.getSummary();
    
    if (summary && summary.count > 0) {
      const tools = [...summary.editors, ...summary.cli].join(', ');
      console.log(chalk.green(`🧠 AI tools detected: ${tools}`));
    } else {
      console.log(chalk.yellow('⚠️  No AI tools detected'));
      console.log(chalk.blue('💡 Universal context files will still be installed'));
    }
    console.log('');

    // Check if already installed
    if (await this.isAlreadyInstalled()) {
      const { shouldContinue } = await this.promptReinstall();
      if (!shouldContinue) {
        console.log(chalk.yellow('⏭️  Installation cancelled'));
        return;
      }
    }

    // Create directory structure
    await this.createDirectoryStructure();

    // Download files
    await this.downloadFiles(projectType, options, detectedTools);

    // Ask about Git hooks
    let installHooks = true;
    if (!options.nonInteractive && !options.noHooks) {
      installHooks = await this.promptGitHooks();
    }

    // Install Git hooks if requested
    if (installHooks) {
      await this.gitHooksManager.installHooks(packageManager);
    }

    // Create configuration
    await this.createConfiguration(projectType, installHooks);

    // Create status tracking
    await this.createStatusFile(projectType, packageManager, installHooks);

    // Success message
    this.showSuccessMessage(installHooks, detectedTools, projectType, packageManager);
  }

  async installPlatformIntegration(platform) {
    try {
      const { getIntegration } = require('../integrations');
      const integration = getIntegration(platform);

      if (!integration) {
        console.log(chalk.red(`❌ Unknown platform: ${platform}`));
        console.log(chalk.yellow('💡 Available: claude, cursor, copilot, codex, gemini, aider, continue, windsurf'));
        return;
      }

      await integration.install();

      console.log('');
      console.log(chalk.green(`🎉 ${integration.displayName} integration installed!`));

      integration.showUsage();

    } catch (error) {
      console.log(chalk.red(`❌ Failed to install ${platform} integration`));
      console.log(chalk.yellow(error.message));
    }
  }

  showPlatformUsage(platform) {
    const { getIntegration } = require('../integrations');
    const integration = getIntegration(platform);
    if (integration) {
      integration.showUsage();
    }
  }

  async isAlreadyInstalled() {
    return await fs.pathExists('.vibe-kit/config.yml');
  }

  async promptReinstall() {
    const { shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: 'Vibe Kit is already installed. Do you want to reinstall?',
        default: false
      }
    ]);
    return { shouldContinue };
  }

  async promptGitHooks() {
    // Check for non-interactive mode
    if (process.env.CI === 'true' || process.env.NON_INTERACTIVE === 'true') {
      console.log(chalk.yellow('🤖 Non-interactive mode detected, skipping Git hooks'));
      return false;
    }

    if (!await fs.pathExists('package.json')) {
      console.log(chalk.yellow('⚠️  Skipping Git hooks setup (no package.json found)'));
      return false;
    }

    console.log('');
    console.log('──────────────────────────────────────────────');
    console.log(chalk.blue('⚙️  Git Hooks Setup'));
    console.log('──────────────────────────────────────────────');
    console.log('Vibe Kit can install **pre-commit** and **pre-push** hooks');
    console.log('to automatically run tests, linting, and type checks before commits.');
    console.log('');
    console.log('');

    const { installHooks } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installHooks',
        message: 'Do you want to enable Git hooks?',
        default: false
      }
    ]);

    if (installHooks) {
      console.log(chalk.green('✅ Git hooks enabled'));
    } else {
      console.log(chalk.yellow('⏭️  Skipping Git hooks for now'));
      console.log(chalk.blue('💡 You can enable them anytime with: `vk update --hooks`'));
    }
    console.log('');

    return installHooks;
  }

  async createDirectoryStructure() {
    console.log(chalk.blue('📁 Creating structure...'));
    
    const directories = [
      '.vibe-kit/standards',
      '.vibe-kit/standards/code-style', // Granular code style files
      '.vibe-kit/product', // Product context (mission, roadmap, decisions)
      '.vibe-kit/instructions', // Workflow instructions
      '.vibe-kit/instructions/meta', // Meta instructions (pre-flight/post-flight)
      '.vibe-kit/instructions/core', // Core workflow instructions
      '.vibe-kit/hooks',
      '.vibe-kit/types',
      '.vibe-kit/commands',
      '.vibe-kit/templates',
      '.vibe-kit/scripts',
      '.vibe-kit/integrations',
      '.vibe-kit/policies' // Policy enforcement configs
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
    }

    // Platform directories are now created lazily by each integration's install()

    console.log(chalk.green('✅ .vibe-kit/ directory created'));
    console.log(chalk.green('✅ Standards, templates, and commands installed'));
    console.log('');
  }

  async createSkeletonStandards() {
    const skeletonFiles = {
      'standards/code-style.md': `# Code Style

<!-- Content will be generated by running: vk analyze -->

Your code style standards will be automatically generated based on your codebase patterns, conventions, and existing code.

Run \`vk analyze\` to generate this content.

## Conditional Loading

This file can be split into granular files for better organization:
- \`code-style/css-style.md\` - CSS-specific standards
- \`code-style/typescript-style.md\` - TypeScript-specific standards
- \`code-style/javascript-style.md\` - JavaScript-specific standards
- \`code-style/html-style.md\` - HTML-specific standards

Use conditional loading tags:
\`\`\`markdown
<!-- when:css -->
### CSS Conventions
[CSS-specific content]

<!-- when:typescript -->
### TypeScript Conventions
[TypeScript-specific content]
\`\`\`
`,
      
      'standards/testing.md': `# Testing Standards

<!-- Content will be generated by running: vk analyze -->

Your testing standards will be automatically generated based on your existing test patterns and testing framework.

Run \`vk analyze\` to generate this content.

## ⭐ REQUIRED: Numbered Test Cases

**All test cases MUST use numbered descriptions for easy tracking and debugging:**

\`\`\`typescript
describe("ComponentName", () => {
  it("1. renders basic component", () => {
    // test implementation
  });

  it("2. handles user interactions", () => {
    // test implementation
  });

  it("3. displays correct content", () => {
    // test implementation
  });
});
\`\`\`

**Benefits:**
- Easy identification of failing tests
- Simple reference in discussions and bug reports
- Consistent organization across all test files
- Quick debugging and maintenance
`,
      
      'standards/architecture.md': `# Architecture

<!-- Content will be generated by running: vk analyze -->

Your architecture patterns will be documented based on your project structure and organization.

Run \`vk analyze\` to generate this content.`,
      
      'standards/ai-guidelines.md': `# AI Guidelines

<!-- Content will be generated by running: vk analyze -->

Guidelines for AI assistance will be defined based on your project's needs and patterns.

Run \`vk analyze\` to generate this content.`,
      
      'standards/workflows.md': `# Workflows

<!-- Content will be generated by running: vk analyze -->

Development workflows and processes will be documented based on your project's practices.

Run \`vk analyze\` to generate this content.`
    };

    // Create granular code-style skeleton files
    const granularCodeStyleFiles = {
      'standards/code-style/css-style.md': `# CSS Style Guide

<!-- Content will be generated by running: vk analyze -->

CSS-specific coding standards will be generated based on your project's styling patterns.

Run \`vk analyze\` to generate this content.

## Conditional Loading

This file is loaded when CSS-related tasks are detected:
\`\`\`markdown
<!-- when:css -->
[CSS-specific content]
\`\`\`
`,

      'standards/code-style/typescript-style.md': `# TypeScript Style Guide

<!-- Content will be generated by running: vk analyze -->

TypeScript-specific coding standards will be generated based on your project's TypeScript patterns.

Run \`vk analyze\` to generate this content.

## Conditional Loading

This file is loaded when TypeScript-related tasks are detected:
\`\`\`markdown
<!-- when:typescript -->
[TypeScript-specific content]
\`\`\`
`,

      'standards/code-style/javascript-style.md': `# JavaScript Style Guide

<!-- Content will be generated by running: vk analyze -->

JavaScript-specific coding standards will be generated based on your project's JavaScript patterns.

Run \`vk analyze\` to generate this content.

## Conditional Loading

This file is loaded when JavaScript-related tasks are detected:
\`\`\`markdown
<!-- when:javascript -->
[JavaScript-specific content]
\`\`\`
`,

      'standards/code-style/html-style.md': `# HTML Style Guide

<!-- Content will be generated by running: vk analyze -->

HTML-specific coding standards will be generated based on your project's HTML patterns.

Run \`vk analyze\` to generate this content.

## Conditional Loading

This file is loaded when HTML-related tasks are detected:
\`\`\`markdown
<!-- when:html -->
[HTML-specific content]
\`\`\`
`
    };

    for (const [relativePath, content] of Object.entries(skeletonFiles)) {
      await fs.writeFile(`.vibe-kit/${relativePath}`, content);
    }

    for (const [relativePath, content] of Object.entries(granularCodeStyleFiles)) {
      await fs.writeFile(`.vibe-kit/${relativePath}`, content);
    }
  }

  async downloadFiles(projectType, options = {}, detectedTools = {}) {
    try {
      // Create skeleton standards files (will be customized by analyze)
      console.log(chalk.blue('📝 Creating skeleton standards files...'));
      await this.createSkeletonStandards();
      
      console.log(chalk.green('✅ Skeleton files created'));
      console.log(chalk.yellow('💡 Run: vk analyze to generate content based on your codebase'));
      console.log('');
      
      // Download base files
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/README.md`,
        '.vibe-kit/standards/README.md'
      );
      
      // Download the actual glossary (keep it as-is, universal across all projects)
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/standards/glossary.md`,
        '.vibe-kit/standards/glossary.md'
      );

      // Download commands
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/create-feature.md`,
        '.vibe-kit/commands/create-feature.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/create-component.md`,
        '.vibe-kit/commands/create-component.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/run-tests.md`,
        '.vibe-kit/commands/run-tests.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/add-documentation.md`,
        '.vibe-kit/commands/add-documentation.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/quality-check.md`,
        '.vibe-kit/commands/quality-check.md'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/commands/analyze.md`,
        '.vibe-kit/commands/analyze.md'
      );

      // Download hooks
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/hooks/pre-commit.sh`,
        '.vibe-kit/hooks/pre-commit.sh'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/hooks/pre-push.sh`,
        '.vibe-kit/hooks/pre-push.sh'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/hooks/commit-msg.sh`,
        '.vibe-kit/hooks/commit-msg.sh'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/hooks/setup-hooks.sh`,
        '.vibe-kit/hooks/setup-hooks.sh'
      );

      // Download types
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/types/strict.tsconfig.json`,
        '.vibe-kit/types/strict.tsconfig.json'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/types/global.d.ts`,
        '.vibe-kit/types/global.d.ts'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/types/type-check.sh`,
        '.vibe-kit/types/type-check.sh'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/types/typescript-strict.json`,
        '.vibe-kit/types/typescript-strict.json'
      );

      // Download templates
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/component.tsx`,
        '.vibe-kit/templates/component.tsx'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/test.tsx`,
        '.vibe-kit/templates/test.tsx'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/story.tsx`,
        '.vibe-kit/templates/story.tsx'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/hook.ts`,
        '.vibe-kit/templates/hook.ts'
      );
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/templates/api.ts`,
        '.vibe-kit/templates/api.ts'
      );

      // Download scripts
      await this.downloadManager.downloadFile(
        `${this.repoUrl}/legacy/update.sh`,
        '.vibe-kit/scripts/update.sh'
      );

      // Make scripts executable
      await fs.chmod('.vibe-kit/hooks/pre-commit.sh', '755');
      await fs.chmod('.vibe-kit/hooks/pre-push.sh', '755');
      await fs.chmod('.vibe-kit/hooks/commit-msg.sh', '755');
      await fs.chmod('.vibe-kit/hooks/setup-hooks.sh', '755');
      await fs.chmod('.vibe-kit/types/type-check.sh', '755');
      await fs.chmod('.vibe-kit/scripts/update.sh', '755');
    } catch (error) {
      console.log(chalk.red('❌ Failed to download files'));
      throw error;
    }

    // Create new Phase 1 files (product context, corrections log, meta instructions)
    await this.createProductContext();
    await this.createCorrectionsLog();
    await this.createMetaInstructions();
    await this.createPolicyFile();

    // Install platform integrations
    await this.installPlatformIntegrations(detectedTools);
  }

  async installPlatformIntegrations(detectedTools = {}) {
    console.log(chalk.blue('🔧 Installing integrations...'));

    try {
      const { getIntegration } = require('../integrations');

      // Map detected tools to integration names
      const toolToIntegration = {
        cursor: 'cursor',
        continue: 'continue',
        aider: 'aider',
        aider_cli: 'aider',
        vscode: 'copilot',
        claude_cli: 'claude',
        gemini_cli: 'gemini',
        windsurf: 'windsurf',
      };

      const installed = new Set();
      for (const [tool, integrationName] of Object.entries(toolToIntegration)) {
        if (detectedTools[tool] && !installed.has(integrationName)) {
          const integration = getIntegration(integrationName);
          if (integration) {
            await integration.install();
            installed.add(integrationName);
            console.log(chalk.green(`  ✅ ${integration.displayName}`));
          }
        }
      }

      // Always install CLI helpers
      await this.installCLIHelpers();

      console.log(chalk.green('✅ Platform integrations complete'));
      console.log('');
    } catch (error) {
      console.log(chalk.red('❌ Failed to install platform integrations'));
      console.log(chalk.yellow(error.message));
    }
  }

  // Platform integration methods have been moved to lib/integrations/

  async installCLIHelpers() {
    // Create universal context.md file that references ALL standards
    // CLI tools can read this single file to understand what context is available
    const context = `# Vibe Kit - Context Entry Point

**Single file to reference for ALL context:** \`.vibe-kit/context.md\`

This file tells you what context files are available. Cursor/VS Code auto-load all files.
For CLI tools, this is your quick reference of what standards exist.

## Quick Usage

\`\`\`bash
# Claude, Gemini, Codex
claude "read .vibe-kit/context.md to see available standards, then create a button"
\`\`\`

## Available Context Files

### Standards
- \`.vibe-kit/standards/README.md\` - Standards overview
- \`.vibe-kit/standards/glossary.md\` - **Project terms & shortcuts**
- \`.vibe-kit/standards/code-style.md\` - Coding conventions
- \`.vibe-kit/standards/code-style/css-style.md\` - CSS-specific standards
- \`.vibe-kit/standards/code-style/typescript-style.md\` - TypeScript-specific standards
- \`.vibe-kit/standards/testing.md\` - Test patterns
- \`.vibe-kit/standards/architecture.md\` - Architecture decisions
- \`.vibe-kit/standards/ai-guidelines.md\` - AI behavior rules
- \`.vibe-kit/standards/workflows.md\` - Development workflows

### Product Context
- \`.vibe-kit/product/mission.md\` - Product vision and purpose
- \`.vibe-kit/product/mission-lite.md\` - Condensed mission for AI context
- \`.vibe-kit/product/roadmap.md\` - Development phases and features
- \`.vibe-kit/product/decisions.md\` - Architecture Decision Records (ADRs)
- \`.vibe-kit/product/context.md\` - Domain-specific context

### Commands
- \`.vibe-kit/commands/analyze.md\` - Analyze & customize standards
- \`.vibe-kit/commands/create-component.md\` - Create component
- \`.vibe-kit/commands/create-feature.md\` - Create feature
- \`.vibe-kit/commands/run-tests.md\` - Run tests
- \`.vibe-kit/commands/quality-check.md\` - Quality checks
- \`.vibe-kit/commands/add-documentation.md\` - Add documentation

### Instructions
- \`.vibe-kit/instructions/meta/pre-flight.md\` - Pre-flight checks
- \`.vibe-kit/instructions/meta/post-flight.md\` - Post-flight verification
- \`.vibe-kit/instructions/core/auto-corrections-log.md\` - Auto-logging instructions

### Templates
- \`.vibe-kit/templates/component.tsx\`
- \`.vibe-kit/templates/test.tsx\`
- \`.vibe-kit/templates/story.tsx\`
- \`.vibe-kit/templates/hook.ts\`
- \`.vibe-kit/templates/api.ts\`

### Tracking
- \`.vibe-kit/corrections.md\` - AI performance corrections log

## Conditional Loading

Vibe Kit supports conditional loading based on task context:

\`\`\`markdown
<!-- when:react -->
### React Conventions
Components use PascalCase and named exports.

<!-- when:css -->
### CSS Conventions
Use SCSS modules with BEM naming.

<!-- context-check:general-formatting -->
IF this section already in context:
  SKIP: Re-reading
ELSE:
  READ: The following formatting rules
\`\`\`

## How to Use

**In Cursor/VS Code:** Everything auto-loads! Just work normally.

**In CLI tools (Claude, Gemini, Codex):**
\`\`\`bash
# Reference specific files you need:
claude "read .vibe-kit/standards/glossary.md and create a @btn for @customer login"

# Or reference multiple files:
claude "read .vibe-kit/standards/README.md .vibe-kit/standards/glossary.md and create a button"

# Include product context:
claude "read .vibe-kit/product/mission-lite.md .vibe-kit/standards/code-style.md and create a feature"
\`\`\`
`;
    
    await fs.writeFile('.vibe-kit/context.md', context);
    await fs.writeFile('.vibe-kit/CONTEXT.md', context); // Keep uppercase for backward compatibility

    // Create CLI wrapper script
    const cliScript = `#!/bin/bash
# Vibe Kit AI CLI wrapper
# Usage: .vibe-kit/scripts/ai-cli.sh "your prompt"

CONTEXT_FILE=".vibe-kit/context.md"
AI_TOOL="\${AI_TOOL:-aider}"
PROMPT="\$@"

if [ ! -f "$CONTEXT_FILE" ]; then
  echo "❌ Vibe Kit not initialized. Run: vibe-kit install"
  exit 1
fi

CONTEXT=\$(cat "$CONTEXT_FILE")

case "$AI_TOOL" in
  "aider")
    echo "$PROMPT" | aider
    ;;
  "claude")
    echo "$CONTEXT

User: $PROMPT" | claude
    ;;
  *)
    echo "$CONTEXT

User: $PROMPT"
    ;;
esac
`;

    await fs.writeFile('.vibe-kit/scripts/ai-cli.sh', cliScript);
    await fs.chmod('.vibe-kit/scripts/ai-cli.sh', '755');
    
    console.log(chalk.green('✅ CLI helpers installed'));
  }

  async createConfiguration(projectType, gitHooksEnabled) {
    const projectName = path.basename(process.cwd());
    
    const config = {
      version: '1.0.0',
      project_name: projectName,
      project_type: projectType,
      features: {
        testing: true,
        documentation: true,
        code_review: true,
        linting: true,
        type_safety: true,
        git_hooks: gitHooksEnabled
      },
      paths: {
        components: 'src/components',
        tests: 'src/__tests__',
        stories: 'src/stories',
        docs: 'docs'
      },
      commands: {
        create_component: '@.vibe-kit/commands/create-component.md',
        create_feature: '@.vibe-kit/commands/create-feature.md',
        run_tests: '@.vibe-kit/commands/run-tests.md',
        add_docs: '@.vibe-kit/commands/add-documentation.md',
        quality_check: '@.vibe-kit/commands/quality-check.md',
        analyze: '@.vibe-kit/commands/analyze.md'
      }
    };

    const now = new Date().toISOString();
    const isMonorepo = await fs.pathExists('packages') || await fs.pathExists('apps') || 
                       (await fs.pathExists('package.json') && 
                        (await fs.readJson('package.json').catch(() => ({}))).workspaces);
    
    await fs.writeFile('.vibe-kit/config.yml', 
      `# Vibe Kit Configuration
vk: 1
version: "${config.version}"
updated: "${now.split('T')[0]}"
project_name: "${config.project_name}"
project_type: "${config.project_type}"
profile: "${config.project_type}" # react, vue, node, nextjs, etc.
is_monorepo: ${isMonorepo}

# Analysis scope (for monorepos)
# Set during 'vk analyze' - tracks which packages were analyzed
analysis_scope: null  # frontend, backend, both, or current
analyzed_packages: []  # List of package paths that were analyzed

# Required standards (enforcement)
required:
  - standards/code-style.md
  - standards/testing.md

# Optional standards (warn if missing)
optional:
  - standards/architecture.md
  - standards/workflows.md
  - standards/ai-guidelines.md
  - product/mission.md

# Conditional loading rules
conditionals:
  - when: react
    load: [standards/code-style.md, standards/testing.md]
  - when: css
    load: [standards/code-style/css-style.md]
  - when: typescript
    load: [standards/code-style/typescript-style.md]

# Features
features:
  testing: ${config.features.testing}
  documentation: ${config.features.documentation}
  code_review: ${config.features.code_review}
  linting: ${config.features.linting}
  type_safety: ${config.features.type_safety}
  git_hooks: ${config.features.git_hooks}

# Paths (customize for your project)
paths:
  components: "${config.paths.components}"
  tests: "${config.paths.tests}"
  stories: "${config.paths.stories}"
  docs: "${config.paths.docs}"

# Commands
commands:
  create_component: "${config.commands.create_component}"
  create_feature: "${config.commands.create_feature}"
  run_tests: "${config.commands.run_tests}"
  add_docs: "${config.commands.add_docs}"
  quality_check: "${config.commands.quality_check}"
  analyze: "${config.commands.analyze}"

# Metadata for tracking
metadata:
  generated_by: vibe-kit@${require('../../package.json').version}
  generated_at: "${now}"
  last_analyzed: null
`
    );
  }

  async createStatusFile(projectType, packageManager, gitHooksEnabled) {
    try {
      const status = this.statusManager.getDefaultStatus();
      status.project_type = projectType;
      status.package_manager = packageManager;
      status.features.git_hooks = gitHooksEnabled;
      
      await this.statusManager.saveStatus(status);
      console.log(chalk.green('✅ Status tracking initialized'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Warning: Could not create status file'), error.message);
    }
  }

  async createProductContext() {
    console.log(chalk.blue('📦 Creating product context files...'));
    
    const missionContent = `# Product Mission

<!-- Content will be generated by running: vk analyze or manually fill this in -->

## Pitch

[PRODUCT_NAME] is a [PRODUCT_TYPE] that helps [TARGET_USERS] [SOLVE_PROBLEM] by providing [KEY_VALUE_PROPOSITION].

## Users

### Primary Customers

- [CUSTOMER_SEGMENT_1]: [DESCRIPTION]
- [CUSTOMER_SEGMENT_2]: [DESCRIPTION]

### User Personas

**[USER_TYPE]** ([AGE_RANGE])
- **Role:** [JOB_TITLE]
- **Context:** [BUSINESS_CONTEXT]
- **Pain Points:** [PAIN_POINT_1], [PAIN_POINT_2]
- **Goals:** [GOAL_1], [GOAL_2]

## The Problem

### [PROBLEM_TITLE]

[PROBLEM_DESCRIPTION]. [QUANTIFIABLE_IMPACT].

**Our Solution:** [SOLUTION_DESCRIPTION]

## Differentiators

### [DIFFERENTIATOR_TITLE]

Unlike [COMPETITOR_OR_ALTERNATIVE], we provide [SPECIFIC_ADVANTAGE]. This results in [MEASURABLE_BENEFIT].

## Key Features

### Core Features

- **[FEATURE_NAME]:** [USER_BENEFIT_DESCRIPTION]

### Collaboration Features

- **[FEATURE_NAME]:** [USER_BENEFIT_DESCRIPTION]
`;

    const missionLiteContent = `# Product Mission (Lite)

<!-- Condensed mission for efficient AI context usage -->

[ELEVATOR_PITCH_FROM_MISSION_MD]

[1-3_SENTENCES_SUMMARIZING_VALUE_TARGET_USERS_AND_PRIMARY_DIFFERENTIATOR]

<!-- This file should be kept concise for AI context efficiency -->
`;

    const roadmapContent = `# Product Roadmap

## Current Phase: [PHASE_NAME]

### Completed Features ✅

- **[FEATURE]:** [DESCRIPTION]

### In Progress 🚧

- **[FEATURE]:** [DESCRIPTION]

### Upcoming Features 📋

- **[FEATURE]:** [DESCRIPTION]

## Technical Debt & Improvements

### High Priority 🔴

- **[ITEM]:** [DESCRIPTION]

### Medium Priority 🟡

- **[ITEM]:** [DESCRIPTION]

### Low Priority 🟢

- **[ITEM]:** [DESCRIPTION]

## Success Metrics

### Code Quality

- **Test Coverage:** Target [X]%+
- **TypeScript Coverage:** [X]% for new code
- **Linting Errors:** Zero in CI

### Performance

- **Page Load Time:** < [X] seconds
- **Bundle Size:** < [X]KB
- **Build Time:** < [X] minutes

## Future Vision

### [QUARTER/YEAR]: [THEME]

- [FEATURE_OR_GOAL]
`;

    const decisionsContent = `# Technical Decisions

<!-- Architecture Decision Records (ADRs) -->

## Architecture Decisions

### [DECISION_NAME] ([DATE])

**Decision:** [DESCRIPTION]

**Rationale:**
- [REASON_1]
- [REASON_2]

**Alternatives Considered:** [ALTERNATIVE_1], [ALTERNATIVE_2]

**Status:** ✅ Implemented | 🚧 In Progress | 📋 Planned

## Technology Decisions

### [TECHNOLOGY_CHOICE] ([DATE])

**Decision:** [DESCRIPTION]

**Rationale:**
- [REASON_1]
- [REASON_2]

**Alternatives Considered:** [ALTERNATIVE_1], [ALTERNATIVE_2]

**Status:** ✅ Implemented | 🚧 In Progress | 📋 Planned

## Code Quality Decisions

### [QUALITY_DECISION] ([DATE])

**Decision:** [DESCRIPTION]

**Rationale:**
- [REASON_1]
- [REASON_2]

**Status:** ✅ Implemented | 🚧 In Progress | 📋 Planned

## Future Decisions to Make

### [FUTURE_DECISION] ([TIMELINE])

**Decision:** [DESCRIPTION]

**Options:**
- [OPTION_1]
- [OPTION_2]

**Factors:** [CONSIDERATION_1], [CONSIDERATION_2]
`;

    const contextContent = `# Product Context

<!-- Domain-specific context for AI understanding -->

## Domain Terminology

- **[TERM]:** [DEFINITION]
- **[TERM]:** [DEFINITION]

## Business Rules

- **[RULE]:** [DESCRIPTION]
- **[RULE]:** [DESCRIPTION]

## Key Integrations

- **[INTEGRATION]:** [DESCRIPTION]
- **[INTEGRATION]:** [DESCRIPTION]

## Important Constraints

- **[CONSTRAINT]:** [DESCRIPTION]
- **[CONSTRAINT]:** [DESCRIPTION]
`;

    await fs.writeFile('.vibe-kit/product/mission.md', missionContent);
    await fs.writeFile('.vibe-kit/product/mission-lite.md', missionLiteContent);
    await fs.writeFile('.vibe-kit/product/roadmap.md', roadmapContent);
    await fs.writeFile('.vibe-kit/product/decisions.md', decisionsContent);
    await fs.writeFile('.vibe-kit/product/context.md', contextContent);
    
    console.log(chalk.green('✅ Product context files created'));
  }

  async createCorrectionsLog() {
    console.log(chalk.blue('📝 Creating corrections log system...'));
    
    const correctionsContent = `# Vibe Kit Corrections Log

## Description

This log tracks corrections and improvements to **Vibe Kit performance** based on real development experience. It captures patterns, preferences, and issues with the AI assistant's behavior to continuously refine the Vibe Kit configuration and improve development efficiency.

## Usage Instructions

### For Developers

- **Read before starting** - Check recent sessions for known Vibe Kit issues or preferences
- **Report Vibe Kit issues** - When the AI makes mistakes, doesn't follow standards, or behaves inefficiently, note them here
- **Track Vibe Kit patterns** - Look for recurring AI behavior issues that indicate rule updates are needed

### For AI Assistant

- **Update in real-time** - Add Vibe Kit performance corrections and preferences as they're discovered
- **Track frequency** - Note how often Vibe Kit issues occur to identify trending problems
- **Categorize properly** - Use HIGH/MEDIUM/LOW priority levels for Vibe Kit improvements

### Categories

- **Rule Updates**: Fixes to existing Vibe Kit rules and standards
- **AI Behavior**: Issues with AI assistant behavior, efficiency, or decision-making
- **Preferences**: Developer preferences for AI assistant behavior and output
- **Trend Indicators**: Patterns in AI performance that need attention (🔥 hot issues, 📈 growing patterns, ⚠️ alerts)

## Quick Stats

- **Total Sessions**: 0
- **Rule Updates**: 0
- **New Preferences**: 0
- **Trending Issues**: 0

## Recent Sessions

<!-- Add session entries here as you work -->

### YYYY-MM-DD - [Task/Feature Name]

**Changes**: [X files, Y test cases]

#### Rule Updates

- [Current Rule] → [Fixed Rule] [PRIORITY] [Frequency: Xx this week]

#### AI Behavior

- [Category] | [Issue] [PRIORITY] [Context: ...]

#### Preferences

- [Category] | [Preference] [PRIORITY] [Context: User request/Pattern observed]

#### Trend Indicators

- 🔥 [Issue]: X occurrences in Y days
- 📈 [Pattern]: X new preferences this week
- ⚠️ [Alert]: [Description]

## Cumulative Improvements

### High Priority

- [No high priority items yet]

### Medium Priority

- [No medium priority items yet]

### Low Priority

- [No low priority items yet]

## Session Template

### YYYY-MM-DD - [Task/Feature Name]

**Changes**: [X files, Y test cases]

#### Rule Updates

- [Current Rule] → [Fixed Rule] [PRIORITY] [Frequency: Xx this week]

#### AI Behavior

- [Category] | [Issue] [PRIORITY] [Context: ...]

#### Preferences

- [Category] | [Preference] [PRIORITY] [Context: User request/Pattern observed]

#### Trend Indicators

- 🔥 [Issue]: X occurrences in Y days
- 📈 [Pattern]: X new preferences this week
- ⚠️ [Alert]: [Description]

---

_This log tracks corrections and improvements to Vibe Kit rules based on real development experience._
`;

    const autoCorrectionsContent = `---
description: Automatic Corrections Log Updates for Vibe Kit Performance Tracking
globs:
alwaysApply: true
version: 1.0
encoding: UTF-8
---

# Automatic Corrections Log Updates

## Overview

Automatically track and log Vibe Kit performance issues during development sessions to continuously improve AI assistant effectiveness.

## Automatic Triggers

### During Development Sessions

**Standards Violations** - Automatically log when:

- AI doesn't follow Vibe Kit testing standards initially
- AI doesn't apply coding standards without prompting
- AI misses established patterns or conventions

**Inefficient Behavior** - Automatically log when:

- AI requires multiple iterations for simple tasks
- AI needs user guidance on basic concepts
- AI makes repeated mistakes in the same session

**Positive Behaviors** - Automatically log when:

- AI proactively applies Vibe Kit standards
- AI correctly identifies issues or patterns
- AI solves problems efficiently on first attempt

### Update Process

1. **Session Review**: At the end of each development session, review for Vibe Kit performance patterns
2. **Automatic Logging**: Update \`.vibe-kit/corrections.md\` without prompting
3. **Categorization**: Classify issues as Rule Updates, AI Behavior, or Preferences
4. **Trend Tracking**: Note frequency and patterns for continuous improvement

### Implementation

- **No User Prompt Required**: This happens automatically as part of the workflow
- **Real-time Updates**: Log issues as they're discovered during development
- **Pattern Recognition**: Track recurring issues to identify systemic problems
- **Positive Reinforcement**: Document good behaviors to reinforce them

## Example Automatic Updates

### Standards Violation

\`\`\`
- Testing | AI didn't follow Vibe Kit testing standards initially [HIGH]
  [Context: Had to correct AI to use numbered test cases]
\`\`\`

### Inefficient Behavior

\`\`\`
- TypeScript | AI needed multiple iterations to fix type errors [MEDIUM]
  [Context: Required guidance on enum types and const assertions]
\`\`\`

### Positive Behavior

\`\`\`
- Testing | AI correctly identified potential bug during testing [LOW]
  [Context: Good behavior - documented finding]
\`\`\`

## Benefits

- **Continuous Improvement**: Automatically identify and fix Vibe Kit performance issues
- **No Manual Overhead**: Eliminates need for user prompts to track issues
- **Pattern Recognition**: Build up data on recurring problems
- **Standards Enforcement**: Ensure Vibe Kit standards are consistently applied
`;

    await fs.writeFile('.vibe-kit/corrections.md', correctionsContent);
    await fs.writeFile('.vibe-kit/instructions/core/auto-corrections-log.md', autoCorrectionsContent);
    
    console.log(chalk.green('✅ Corrections log system created'));
  }

  async createMetaInstructions() {
    console.log(chalk.blue('📋 Creating meta instructions...'));
    
    const preFlightContent = `---
description: Common Pre-Flight Steps for Vibe Kit Instructions
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Pre-Flight Rules

- IMPORTANT: For any step that specifies a subagent in the subagent="" XML attribute you MUST use the specified subagent to perform the instructions for that step.

- Process XML blocks sequentially

- Read and execute every numbered step in the process_flow EXACTLY as the instructions specify.

- If you need clarification on any details of your current task, stop and ask the user specific numbered questions and then continue once you have all of the information you need.

- Use exact templates as provided
`;

    const postFlightContent = `---
description: Common Post-Flight Steps for Vibe Kit Instructions
globs:
alwaysApply: false
version: 1.0
encoding: UTF-8
---

# Post-Flight Rules

After completing all steps in a process_flow, always review your work and verify:

- Every numbered step has read, executed, and delivered according to its instructions.

- All steps that specified a subagent should be used, did in fact delegate those tasks to the specified subagent. IF they did not, see why the subagent was not used and report your findings to the user.

- IF you notice a step wasn't executed according to it's instructions, report your findings and explain which part of the instructions were misread or skipped and why.

## Automatic Corrections Log Updates

After completing any development session, automatically update the corrections log if any of the following occurred:

### Vibe Kit Performance Issues

- **Standards Violations**: If you didn't follow Vibe Kit standards initially (testing, coding, etc.)
- **Inefficient Behavior**: If you required multiple iterations for simple tasks
- **Missing Context**: If you needed user guidance on established patterns
- **Rule Gaps**: If you discovered gaps in Vibe Kit rules or instructions

### Positive Behaviors

- **Good Practices**: If you correctly identified issues or followed best practices
- **Efficient Solutions**: If you solved problems quickly and effectively
- **Standards Compliance**: If you proactively applied Vibe Kit standards

### Update Process

1. **Identify Issues**: Review the session for Vibe Kit performance patterns
2. **Categorize**: Classify as Rule Updates, AI Behavior, or Preferences
3. **Update Log**: Add entries to \`.vibe-kit/corrections.md\` automatically
4. **No Prompt Required**: This should happen as part of the natural workflow

### Example Triggers

- ✅ User had to correct you on testing standards → Add to corrections log
- ✅ You needed multiple attempts to fix TypeScript errors → Add to corrections log
- ✅ You correctly identified a code issue → Add positive behavior note
- ✅ You followed Vibe Kit standards from the start → Add positive behavior note
`;

    await fs.writeFile('.vibe-kit/instructions/meta/pre-flight.md', preFlightContent);
    await fs.writeFile('.vibe-kit/instructions/meta/post-flight.md', postFlightContent);
    
    console.log(chalk.green('✅ Meta instructions created'));
  }

  async createPolicyFile() {
    console.log(chalk.blue('⚖️  Creating policy file...'));
    
    const policyContent = `# Vibe Kit Policy Configuration

## Enforcement Levels

- **off**: No enforcement (informational only)
- **warn**: Show warnings but don't block
- **block**: Block commits/actions if policy violated

## Policy Rules

enforcement:
  testing:
    numbered_cases: warn  # off | warn | block
    coverage_threshold: 80  # warn if below
  code_style:
    typescript_strict: warn
    naming_conventions: warn
  standards:
    freshness_days: 90  # warn if older
    required_files: block
`;

    await fs.writeFile('.vibe-kit/policies/policy.yml', policyContent);
    
    console.log(chalk.green('✅ Policy file created'));
  }

  showSuccessMessage(gitHooksEnabled, detectedTools = {}, projectType = '', packageManager = '') {
    console.log('');
    console.log(chalk.green('🎉 Vibe Kit v1.0.0 successfully installed!'));
    console.log('');

    // Show which platform integrations were configured
    const { getIntegration } = require('../integrations');
    const toolToIntegration = {
      cursor: 'cursor',
      continue: 'continue',
      aider: 'aider',
      aider_cli: 'aider',
      vscode: 'copilot',
      claude_cli: 'claude',
      gemini_cli: 'gemini',
      windsurf: 'windsurf',
    };
    const installedPlatforms = new Set();
    for (const [tool, name] of Object.entries(toolToIntegration)) {
      if (detectedTools[tool]) installedPlatforms.add(name);
    }
    if (installedPlatforms.size > 0) {
      console.log(chalk.blue('🔌 Platform integrations:'));
      for (const name of installedPlatforms) {
        const integration = getIntegration(name);
        if (integration) {
          const files = [...integration.bridgeFiles, ...integration.generatedFiles];
          console.log(`   ${integration.displayName}: ${files.join(', ')}`);
        }
      }
      console.log('');
    }

    // Quick Reference
    console.log(''.padEnd(48, '─'));
    console.log(chalk.bold('📖 Quick Reference'));
    console.log(''.padEnd(48, '─'));
    console.log(`vk status    → Check installation & integrations`);
    console.log(`vk ai <cmd>  → Use AI with project context`);
    console.log(`vk <platform> → Add platform (claude, cursor, copilot, codex, gemini, aider, continue, windsurf)`);
    console.log('');
    console.log(`Docs → ${chalk.blue('https://vibe-kit-docs.vercel.app')}`);
    console.log(`Issues → ${chalk.blue('https://github.com/nolrm/vibe-kit/issues')}`);
    console.log('');

    // Next Step Section
    console.log(''.padEnd(48, '─'));
    console.log(chalk.bold('🚀 NEXT STEP — GENERATE STANDARDS'));
    console.log(''.padEnd(48, '─'));

    if (detectedTools.cursor) {
      console.log(chalk.bold('In Cursor Chat:'));
      console.log(`   @.vibe-kit/commands/analyze.md`);
      console.log('');
      console.log('Or via CLI:');
      console.log(chalk.yellow('👉'), `vk analyze`);
    } else {
      console.log(chalk.yellow('👉'), `vk analyze`);
    }

    console.log('');
    console.log('This will:');
    console.log('  • Scan your codebase and detect patterns');
    console.log('  • Generate content for `.vibe-kit/standards/*.md` based on YOUR code');
    console.log('  • Extract domain terms and project conventions');
    console.log('  • Document your actual architecture and patterns');
    console.log('');
    console.log(chalk.blue('💡 The standards files are currently empty/skeleton'));
    console.log(chalk.blue('   Run analyze to populate them with YOUR project details'));
    console.log('');

    // After Analyze Section
    console.log(''.padEnd(48, '─'));
    console.log(chalk.bold('💡 After Analyze — Try This'));
    console.log(''.padEnd(48, '─'));

    // Platform-specific examples
    if (detectedTools.cursor) {
      console.log(chalk.bold('In Cursor Chat'));
      console.log(`@.vibe-kit/commands/create-component.md`);
      console.log(chalk.dim('"Create a Button component for customer checkout"'));
      console.log('');
    }

    console.log(chalk.bold('In CLI'));
    console.log(`vk ai "create a Button component for customer checkout"`);
    console.log('');

    if (detectedTools.claude_cli || detectedTools.gemini_cli) {
      const toolName = detectedTools.claude_cli ? 'Claude' : 'Gemini';
      console.log(chalk.bold(`In ${toolName} CLI`));
      console.log(`read .vibe-kit/commands/analyze.md and execute`);
      console.log('');
    }

    console.log(chalk.magenta('✨ Done! Your AI now understands your project.'));
    console.log('');
  }
}

async function install(options) {
  const installer = new InstallCommand();
  await installer.install(options);
}

module.exports = install;
