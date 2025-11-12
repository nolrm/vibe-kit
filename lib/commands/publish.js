const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

class PublishCommand {
  constructor() {
    this.registryPath = path.join(process.env.HOME || process.env.USERPROFILE, '.vibe-kit-registry');
  }

  async run(options = {}) {
    console.log(chalk.magenta('📦 Publishing Vibe Kit Configuration\n'));

    // Check if .vibe-kit exists
    if (!await fs.pathExists('.vibe-kit/config.yml')) {
      console.log(chalk.red('❌ Vibe Kit not installed in this directory'));
      console.log(chalk.yellow('   Run: vibe-kit install'));
      return;
    }

    // Get package name and version
    const name = options.name || await this.promptName();
    const version = options.version || await this.promptVersion();
    
    if (!name || !version) {
      console.log(chalk.red('❌ Package name and version are required'));
      return;
    }

    // Validate version format
    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      console.log(chalk.red('❌ Invalid version format. Use semantic versioning (e.g., 1.0.0)'));
      return;
    }

    // Create registry structure
    await this.ensureRegistry();

    // Create package directory
    const packageDir = path.join(this.registryPath, name.replace('@', '').replace('/', '-'), version);
    await fs.ensureDir(packageDir);

    // Copy .vibe-kit files (exclude some)
    const excludePatterns = [
      'corrections.md',
      'status.json',
      'node_modules',
      '.git'
    ];

    await this.copyVibeKitFiles('.vibe-kit', packageDir, excludePatterns);

    // Create package.json for the published package
    const config = await this.loadConfig();
    const packageJson = {
      name: name,
      version: version,
      description: `Vibe Kit configuration for ${config.project_name || 'project'}`,
      vibeKit: {
        vk: config.vk || 1,
        profile: config.profile,
        generated_at: new Date().toISOString(),
        published_at: new Date().toISOString()
      },
      files: [
        '**/*.md',
        '**/*.yml',
        '**/*.yaml',
        '**/*.ts',
        '**/*.tsx',
        '**/*.sh'
      ]
    };

    await fs.writeJson(path.join(packageDir, 'package.json'), packageJson, { spaces: 2 });

    // Create README
    const readme = `# ${name} v${version}

Vibe Kit configuration package.

## Installation

\`\`\`bash
vibe-kit pull ${name}@${version}
\`\`\`

## Contents

This package includes:
- Standards files
- Templates
- Commands
- Product context
- Policies

## Version

${version} - Published ${new Date().toISOString().split('T')[0]}
`;

    await fs.writeFile(path.join(packageDir, 'README.md'), readme);

    console.log(chalk.green(`\n✅ Published ${name}@${version}`));
    console.log(chalk.dim(`   Location: ${packageDir}`));
    console.log(chalk.blue(`\n💡 To use: vibe-kit pull ${name}@${version}`));
  }

  async promptName() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question(chalk.yellow('Package name (e.g., @company/react-standards): '), (name) => {
        readline.close();
        resolve(name.trim() || null);
      });
    });
  }

  async promptVersion() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question(chalk.yellow('Version (e.g., 1.0.0): '), (version) => {
        readline.close();
        resolve(version.trim() || null);
      });
    });
  }

  async ensureRegistry() {
    await fs.ensureDir(this.registryPath);
    console.log(chalk.dim(`Registry location: ${this.registryPath}`));
  }

  async copyVibeKitFiles(sourceDir, targetDir, excludePatterns) {
    const files = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file.name);
      const targetPath = path.join(targetDir, file.name);

      // Check if should exclude
      const shouldExclude = excludePatterns.some(pattern => 
        file.name.includes(pattern) || sourcePath.includes(pattern)
      );

      if (shouldExclude) {
        continue;
      }

      if (file.isDirectory()) {
        await fs.ensureDir(targetPath);
        await this.copyVibeKitFiles(sourcePath, targetPath, excludePatterns);
      } else {
        await fs.copy(sourcePath, targetPath);
      }
    }
  }

  async loadConfig() {
    try {
      const configContent = await fs.readFile('.vibe-kit/config.yml', 'utf-8');
      return yaml.load(configContent);
    } catch (error) {
      return {};
    }
  }
}

async function publish(options) {
  const cmd = new PublishCommand();
  await cmd.run(options);
}

module.exports = publish;

