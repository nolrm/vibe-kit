const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

class PullCommand {
  constructor() {
    this.registryPath = path.join(process.env.HOME || process.env.USERPROFILE, '.contextkit-registry');
  }

  async run(packageSpec, options = {}) {
    console.log(chalk.magenta(`📥 Pulling ContextKit Configuration: ${packageSpec}\n`));

    // Parse package spec (name@version or just name)
    const [packageName, version] = packageSpec.includes('@') 
      ? packageSpec.split('@')
      : [packageSpec, 'latest'];

    // Find package
    const packageDir = await this.findPackage(packageName, version);
    
    if (!packageDir) {
      console.log(chalk.red(`❌ Package not found: ${packageSpec}`));
      console.log(chalk.yellow('\n💡 Available packages:'));
      await this.listPackages();
      return;
    }

    // Check if .contextkit exists
    const backupDir = options.backup ? `.contextkit.backup.${Date.now()}` : null;
    
    if (await fs.pathExists('.contextkit') && !options.force) {
      if (backupDir) {
        await fs.copy('.contextkit', backupDir);
        console.log(chalk.green(`✅ Backed up existing .contextkit to ${backupDir}`));
      } else {
        const { confirm } = await this.promptOverwrite();
        if (!confirm) {
          console.log(chalk.yellow('⏭️  Cancelled'));
          return;
        }
      }
    }

    // Copy package files
    await this.copyPackageFiles(packageDir, '.contextkit', options);

    // Update config.yml with package info
    await this.updateConfig(packageName, version);

    console.log(chalk.green(`\n✅ Pulled ${packageSpec} successfully!`));
    
    if (backupDir) {
      console.log(chalk.dim(`   Backup: ${backupDir}`));
    }
  }

  async findPackage(packageName, version) {
    const packagePath = path.join(this.registryPath, packageName.replace('@', '').replace('/', '-'));
    
    if (!await fs.pathExists(packagePath)) {
      return null;
    }

    if (version === 'latest') {
      // Find latest version
      const versions = await fs.readdir(packagePath);
      const sortedVersions = versions
        .filter(v => /^\d+\.\d+\.\d+$/.test(v))
        .sort((a, b) => {
          const aParts = a.split('.').map(Number);
          const bParts = b.split('.').map(Number);
          for (let i = 0; i < 3; i++) {
            if (aParts[i] !== bParts[i]) {
              return bParts[i] - aParts[i];
            }
          }
          return 0;
        });
      
      if (sortedVersions.length > 0) {
        return path.join(packagePath, sortedVersions[0]);
      }
    } else {
      const versionPath = path.join(packagePath, version);
      if (await fs.pathExists(versionPath)) {
        return versionPath;
      }
    }

    return null;
  }

  async listPackages() {
    if (!await fs.pathExists(this.registryPath)) {
      console.log(chalk.dim('   (No packages in registry)'));
      return;
    }

    const packages = await fs.readdir(this.registryPath, { withFileTypes: true });
    
    for (const pkg of packages.filter(p => p.isDirectory())) {
      const packagePath = path.join(this.registryPath, pkg.name);
      const versions = await fs.readdir(packagePath);
      const validVersions = versions.filter(v => /^\d+\.\d+\.\d+$/.test(v));
      
      if (validVersions.length > 0) {
        const latest = validVersions.sort().reverse()[0];
        console.log(chalk.cyan(`   ${pkg.name.replace('-', '/')}@${latest}`));
      }
    }
  }

  async promptOverwrite() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question(chalk.yellow('⚠️  .contextkit already exists. Overwrite? (y/N): '), (answer) => {
        readline.close();
        resolve({ confirm: answer.toLowerCase() === 'y' });
      });
    });
  }

  async copyPackageFiles(sourceDir, targetDir, options) {
    // Read package.json if exists
    const packageJsonPath = path.join(sourceDir, 'package.json');
    let packageJson = {};
    
    if (await fs.pathExists(packageJsonPath)) {
      packageJson = await fs.readJson(packageJsonPath);
    }

    // Copy all files from package
    const files = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file.name);
      const targetPath = path.join(targetDir, file.name);

      // Skip package.json and README.md
      if (file.name === 'package.json' || file.name === 'README.md') {
        continue;
      }

      if (file.isDirectory()) {
        await fs.ensureDir(targetPath);
        await this.copyPackageFiles(sourcePath, targetPath, options);
      } else {
        await fs.copy(sourcePath, targetPath);
      }
    }
  }

  async updateConfig(packageName, version) {
    const configPath = '.contextkit/config.yml';
    
    if (!await fs.pathExists(configPath)) {
      return;
    }

    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = yaml.load(configContent);
      
      // Add package info
      if (!config.metadata) {
        config.metadata = {};
      }
      
      config.metadata.pulled_from = packageName;
      config.metadata.pulled_version = version;
      config.metadata.pulled_at = new Date().toISOString();

      await fs.writeFile(configPath, yaml.dump(config, { lineWidth: 120 }));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not update config.yml: ${error.message}`));
    }
  }
}

async function pull(packageSpec, options) {
  const cmd = new PullCommand();
  await cmd.run(packageSpec, options);
}

module.exports = pull;

