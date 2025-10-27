const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

class AnalyzeCommand {
  constructor() {
    this.repoUrl = 'https://raw.githubusercontent.com/nolrm/vibe-kit/main';
  }

  async run(options = {}) {
    console.log(chalk.magenta('🔍 Vibe Kit Project Analysis\n'));

    // Check if vibe-kit is installed
    if (!await fs.pathExists('.vibe-kit/commands/analyze.md')) {
      console.log(chalk.red('❌ Vibe Kit not found.'));
      console.log(chalk.yellow('   Run: vibe-kit install'));
      return;
    }

    const spinner = ora('Loading project context...').start();

    try {
      // Load project context
      const context = await this.loadProjectContext();
      
      // Load analyze.md instructions
      const analyzeInstructions = await fs.readFile('.vibe-kit/commands/analyze.md', 'utf-8');

      spinner.succeed('Context loaded successfully\n');

      // Display instructions
      console.log(chalk.yellow('📋 Analysis Instructions:\n'));
      console.log('─'.repeat(60));
      console.log(analyzeInstructions);
      console.log('─'.repeat(60));
      
      console.log(chalk.blue('\n📊 Current Project Context:\n'));
      console.log('─'.repeat(60));
      console.log(JSON.stringify(context, null, 2));
      console.log('─'.repeat(60));

      // Show usage instructions
      this.showUsageInstructions(options);

    } catch (error) {
      spinner.fail('Failed to load context');
      console.log(chalk.red(error.message));
    }
  }

  async loadProjectContext() {
    const context = {};

    // Load package.json
    if (await fs.pathExists('package.json')) {
      context.package = await fs.readJson('package.json');
    }

    // Load tsconfig.json
    if (await fs.pathExists('tsconfig.json')) {
      context.tsconfig = await fs.readJson('tsconfig.json');
    }

    // Detect project structure
    context.structure = await this.detectProjectStructure();

    // Detect installed AI tools
    context.detectedTools = await this.detectAITools();

    return context;
  }

  async detectProjectStructure() {
    const structure = {
      hasSrc: await fs.pathExists('src'),
      hasApp: await fs.pathExists('src/app'),
      hasComponents: await fs.pathExists('src/components'),
      isMonorepo: await fs.pathExists('packages') || await fs.pathExists('apps'),
      frameworks: await this.detectFrameworks(),
      buildTools: await this.detectBuildTools(),
    };

    structure.type = structure.isMonorepo ? 'monorepo' : 'single-package';

    return structure;
  }

  async detectFrameworks() {
    const frameworks = [];

    if (await fs.pathExists('src/components')) {
      frameworks.push('React');
    }
    if (await fs.pathExists('src/pages')) {
      frameworks.push('Next.js');
    }
    if (await fs.pathExists('src/views')) {
      frameworks.push('Vue');
    }
    if (await fs.pathExists('angular.json')) {
      frameworks.push('Angular');
    }

    return frameworks;
  }

  async detectBuildTools() {
    const tools = [];

    if (await fs.pathExists('vite.config.js') || await fs.pathExists('vite.config.ts')) {
      tools.push('Vite');
    }
    if (await fs.pathExists('webpack.config.js') || await fs.pathExists('webpack.config.ts')) {
      tools.push('Webpack');
    }
    if (await fs.pathExists('rollup.config.js') || await fs.pathExists('rollup.config.ts')) {
      tools.push('Rollup');
    }

    return tools;
  }

  async detectAITools() {
    const ToolDetector = require('../utils/tool-detector');
    const detector = new ToolDetector();
    const tools = await detector.detectAll();
    const summary = detector.getSummary();

    return {
      detected: summary.all,
      editors: summary.editors,
      cli: summary.cli,
      count: summary.count
    };
  }

  showUsageInstructions(options) {
    console.log(chalk.blue('\n💡 To execute analysis with AI:\n'));
    
    console.log(chalk.yellow('1. Using vibe-kit AI chat:'));
    console.log('   vibe-kit ai "read .vibe-kit/commands/analyze.md and execute analysis"\n');

    console.log(chalk.yellow('2. Using Aider (if installed):'));
    console.log('   aider');
    console.log('   Then paste the analysis instructions above\n');

    console.log(chalk.yellow('3. Using Claude CLI (if installed):'));
    console.log('   claude "read .vibe-kit/commands/analyze.md and execute analysis"\n');

      console.log(chalk.blue('📝 Next: Use the AI tool of your choice to execute the analysis'));
      console.log(chalk.blue('✨ The AI will generate content for your skeleton .vibe-kit/standards/*.md files'));
      console.log('');
      console.log(chalk.yellow('📋 What AI will generate:'));
      console.log('   • code-style.md - Extract formatting & conventions from your code');
      console.log('   • testing.md - Document your test patterns and framework');
      console.log('   • architecture.md - Map your folder structure and patterns');
      console.log('   • ai-guidelines.md - Create AI usage guidelines for your project');
      console.log('   • glossary.md - Extract domain terms from your codebase');
      console.log('   • workflows.md - Document your development processes');
      console.log('');
      console.log(chalk.yellow('⚠️  After generation completes:'));
      console.log(chalk.yellow('   1. Review generated files in .vibe-kit/standards/'));
      console.log(chalk.yellow('   2. Edit and refine to match YOUR exact needs'));
      console.log(chalk.yellow('   3. Commit them to your repo (they\'re part of your project now)'));
  }
}

async function analyze(options) {
  const cmd = new AnalyzeCommand();
  await cmd.run(options);
}

module.exports = analyze;
