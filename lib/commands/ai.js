const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const { execSync } = require('child_process');

class AICommand {
  async run(prompt, options = {}) {
    if (!prompt) {
      console.log(chalk.red('❌ Please provide a prompt'));
      console.log(chalk.blue('   Usage: vibe-kit ai "your prompt here"'));
      return;
    }

    // Check if vibe-kit is installed
    if (!await fs.pathExists('.vibe-kit/context.md')) {
      console.log(chalk.red('❌ Vibe Kit not initialized.'));
      console.log(chalk.yellow('   Run: vibe-kit install'));
      return;
    }

    // Get AI tool preference
    const aiTool = options.ai || process.env.AI_TOOL || 'display';

    const spinner = ora('Loading Vibe Kit context...').start();

    try {
      // Load context
      const context = await fs.readFile('.vibe-kit/context.md', 'utf-8');
      const standards = await this.loadStandards();

      spinner.succeed('Context loaded\n');

      // Prepare full prompt
      const fullPrompt = `${context}\n\n## Project Standards\n\n${standards}\n\n## User Request\n\n${prompt}`;

      // Execute with AI tool
      await this.executeWithAI(fullPrompt, aiTool, prompt);

    } catch (error) {
      spinner.fail('Failed to load context');
      console.log(chalk.red(error.message));
    }
  }

  async loadStandards() {
    const standards = {
      codeStyle: '',
      testing: '',
      architecture: '',
      guidelines: ''
    };

    try {
      if (await fs.pathExists('.vibe-kit/standards/code-style.md')) {
        standards.codeStyle = await fs.readFile('.vibe-kit/standards/code-style.md', 'utf-8');
      }
      if (await fs.pathExists('.vibe-kit/standards/testing.md')) {
        standards.testing = await fs.readFile('.vibe-kit/standards/testing.md', 'utf-8');
      }
      if (await fs.pathExists('.vibe-kit/standards/architecture.md')) {
        standards.architecture = await fs.readFile('.vibe-kit/standards/architecture.md', 'utf-8');
      }
      if (await fs.pathExists('.vibe-kit/standards/ai-guidelines.md')) {
        standards.guidelines = await fs.readFile('.vibe-kit/standards/ai-guidelines.md', 'utf-8');
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Some standards files not found'));
    }

    return `Code Style: ${standards.codeStyle.substring(0, 500)}...\n\nTesting: ${standards.testing.substring(0, 500)}...\n\nArchitecture: ${standards.architecture.substring(0, 500)}...\n\nGuidelines: ${standards.guidelines.substring(0, 500)}...`;
  }

  async executeWithAI(fullPrompt, aiTool, userPrompt) {
    console.log(chalk.blue(`🤖 Using AI tool: ${aiTool}\n`));

    switch(aiTool) {
      case 'aider':
        await this.executeWithAider(userPrompt);
        break;
      case 'claude':
        await this.executeWithClaude(userPrompt, fullPrompt);
        break;
      case 'gemini':
        await this.executeWithGemini(userPrompt, fullPrompt);
        break;
      case 'display':
      default:
        this.displayPrompt(fullPrompt, aiTool);
        break;
    }
  }

  async executeWithAider(prompt) {
    console.log(chalk.green('🚀 Starting Aider...\n'));
    console.log(chalk.blue('💡 Aider will use .aider/rules.md for context\n'));
    console.log(chalk.yellow(`Prompt: ${prompt}\n`));
    console.log('─'.repeat(60));
    try {
      execSync(`echo "${prompt}" | aider`, { stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.red(`Aider error: ${error.message}`));
      console.log(chalk.yellow('💡 Make sure Aider is installed and in your PATH'));
    }
  }

  async executeWithClaude(prompt, context) {
    console.log(chalk.green('🚀 Starting Claude CLI...\n'));
    console.log('─'.repeat(60));
    try {
      execSync(`echo "${context}\n\nUser: ${prompt}" | claude`, { stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.red(`Claude error: ${error.message}`));
      console.log(chalk.yellow('💡 Make sure Claude CLI is installed'));
    }
  }

  async executeWithGemini(prompt, context) {
    console.log(chalk.green('🚀 Starting Gemini CLI...\n'));
    console.log('─'.repeat(60));
    try {
      execSync(`echo "${context}\n\nUser: ${prompt}" | gemini`, { stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.red(`Gemini error: ${error.message}`));
      console.log(chalk.yellow('💡 Make sure Gemini CLI is installed'));
    }
  }

  displayPrompt(fullPrompt, aiTool) {
    console.log(chalk.yellow('\n📝 Full Prompt (display mode):\n'));
    console.log('─'.repeat(60));
    console.log(fullPrompt);
    console.log('─'.repeat(60));

    console.log(chalk.blue('\n💡 To execute with AI:'));
    console.log('   Set AI_TOOL environment variable:');
    console.log('   export AI_TOOL=aider && vibe-kit ai "your prompt"');
    console.log('   export AI_TOOL=claude && vibe-kit ai "your prompt"');
    console.log('   export AI_TOOL=gemini && vibe-kit ai "your prompt"\n');
  }
}

async function ai(prompt, options) {
  const cmd = new AICommand();
  await cmd.run(prompt, options);
}

module.exports = ai;
