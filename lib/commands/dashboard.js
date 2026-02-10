const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const http = require('http');
const { execSync } = require('child_process');

class DashboardCommand {
  constructor() {
    this.port = 3001;
    this.metrics = {};
  }

  async run(options = {}) {
    console.log(chalk.magenta('📊 Starting ContextKit Dashboard\n'));

    if (!await fs.pathExists('.contextkit/config.yml')) {
      console.log(chalk.red('❌ ContextKit not installed'));
      console.log(chalk.yellow('   Run: contextkit install'));
      return;
    }

    // Collect metrics
    await this.collectMetrics();

    // Start server
    if (options.server !== false) {
      this.startServer(options.port || this.port);
    } else {
      // Just display metrics
      this.displayMetrics();
    }
  }

  async collectMetrics() {
    this.metrics = {
      standards: {},
      corrections: {},
      policy: {},
      freshness: {},
      files: {}
    };

    // Load config
    const config = await this.loadConfig();
    this.metrics.config = config;

    // Check standards files
    const standardsFiles = [
      'standards/code-style.md',
      'standards/testing.md',
      'standards/architecture.md',
      'standards/ai-guidelines.md',
      'standards/workflows.md',
      'standards/glossary.md'
    ];

    for (const file of standardsFiles) {
      const filePath = `.contextkit/${file}`;
      if (await fs.pathExists(filePath)) {
        const stats = await fs.stat(filePath);
        const daysSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        this.metrics.standards[file] = {
          exists: true,
          lastModified: stats.mtime.toISOString(),
          daysSinceUpdate: Math.floor(daysSinceUpdate),
          size: stats.size
        };
      } else {
        this.metrics.standards[file] = {
          exists: false
        };
      }
    }

    // Parse corrections log
    if (await fs.pathExists('.contextkit/corrections.md')) {
      const correctionsContent = await fs.readFile('.contextkit/corrections.md', 'utf-8');
      
      // Count sessions
      const sessionMatches = correctionsContent.matchAll(/### (\d{4}-\d{2}-\d{2})/g);
      const sessions = Array.from(sessionMatches);
      this.metrics.corrections.totalSessions = sessions.length;

      // Count rule updates
      const ruleUpdateMatches = correctionsContent.matchAll(/#### Rule Updates[\s\S]*?(?=####|###|##|$)/g);
      let ruleUpdates = 0;
      for (const match of ruleUpdateMatches) {
        const updates = match[0].match(/^-/gm);
        if (updates) ruleUpdates += updates.length;
      }
      this.metrics.corrections.ruleUpdates = ruleUpdates;

      // Count AI behavior issues
      const behaviorMatches = correctionsContent.matchAll(/\[HIGH\]/g);
      const mediumMatches = correctionsContent.matchAll(/\[MEDIUM\]/g);
      const lowMatches = correctionsContent.matchAll(/\[LOW\]/g);
      
      this.metrics.corrections.highPriority = Array.from(behaviorMatches).length;
      this.metrics.corrections.mediumPriority = Array.from(mediumMatches).length;
      this.metrics.corrections.lowPriority = Array.from(lowMatches).length;
    }

    // Load policy
    if (await fs.pathExists('.contextkit/policies/policy.yml')) {
      const policyContent = await fs.readFile('.contextkit/policies/policy.yml', 'utf-8');
      this.metrics.policy = yaml.load(policyContent);
    }

    // Check product context
    const productFiles = [
      'product/mission.md',
      'product/roadmap.md',
      'product/decisions.md',
      'product/context.md'
    ];

    for (const file of productFiles) {
      const filePath = `.contextkit/${file}`;
      this.metrics.files[file] = await fs.pathExists(filePath);
    }
  }

  async loadConfig() {
    try {
      const configContent = await fs.readFile('.contextkit/config.yml', 'utf-8');
      return yaml.load(configContent);
    } catch (error) {
      return {};
    }
  }

  displayMetrics() {
    console.log(chalk.blue('\n📊 ContextKit Metrics\n'));
    console.log('─'.repeat(60));

    // Standards freshness
    console.log(chalk.bold('\n📚 Standards Freshness:'));
    const standards = Object.entries(this.metrics.standards);
    const existing = standards.filter(([_, data]) => data.exists);
    const outdated = existing.filter(([_, data]) => data.daysSinceUpdate > 90);
    
    console.log(chalk.green(`   ${existing.length}/${standards.length} standards files exist`));
    if (outdated.length > 0) {
      console.log(chalk.yellow(`   ⚠️  ${outdated.length} files outdated (>90 days)`));
      outdated.forEach(([file, data]) => {
        console.log(chalk.dim(`      - ${file}: ${data.daysSinceUpdate} days old`));
      });
    }

    // Corrections log
    if (this.metrics.corrections.totalSessions > 0) {
      console.log(chalk.bold('\n📝 Corrections Log:'));
      console.log(chalk.cyan(`   Total Sessions: ${this.metrics.corrections.totalSessions}`));
      console.log(chalk.cyan(`   Rule Updates: ${this.metrics.corrections.ruleUpdates || 0}`));
      console.log(chalk.red(`   High Priority Issues: ${this.metrics.corrections.highPriority || 0}`));
      console.log(chalk.yellow(`   Medium Priority Issues: ${this.metrics.corrections.mediumPriority || 0}`));
      console.log(chalk.green(`   Low Priority Issues: ${this.metrics.corrections.lowPriority || 0}`));
    }

    // Product context
    console.log(chalk.bold('\n📦 Product Context:'));
    const productFiles = Object.entries(this.metrics.files);
    const existingProduct = productFiles.filter(([_, exists]) => exists);
    console.log(chalk.cyan(`   ${existingProduct.length}/${productFiles.length} product files exist`));

    // Policy
    if (this.metrics.policy.enforcement) {
      console.log(chalk.bold('\n⚖️  Policy Enforcement:'));
      const enforcement = this.metrics.policy.enforcement;
      if (enforcement.testing) {
        console.log(chalk.cyan(`   Testing: ${enforcement.testing.numbered_cases || 'not set'}`));
      }
    }

    console.log('\n' + '─'.repeat(60));
  }

  startServer(port) {
    const server = http.createServer((req, res) => {
      if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(this.generateDashboardHTML());
      } else if (req.url === '/api/metrics') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.metrics, null, 2));
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(port, () => {
      console.log(chalk.green(`\n✅ Dashboard running at http://localhost:${port}`));
      console.log(chalk.blue('   Press Ctrl+C to stop\n'));
      
      // Try to open browser
      try {
        const platform = process.platform;
        const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
        execSync(`${command} http://localhost:${port}`);
      } catch (error) {
        // Ignore if can't open browser
      }
    });
  }

  generateDashboardHTML() {
    const metrics = this.metrics;
    const standardsCount = Object.values(metrics.standards).filter(s => s.exists).length;
    const totalStandards = Object.keys(metrics.standards).length;
    const freshnessPercent = Math.round((standardsCount / totalStandards) * 100);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ContextKit Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: white;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2.5em;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .card h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        .stat {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        .progress-bar {
            width: 100%;
            height: 30px;
            background: #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .list {
            list-style: none;
        }
        .list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .list li:last-child {
            border-bottom: none;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .badge-success { background: #4caf50; color: white; }
        .badge-warning { background: #ff9800; color: white; }
        .badge-danger { background: #f44336; color: white; }
        .badge-info { background: #2196f3; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎵 ContextKit Dashboard</h1>
        
        <div class="grid">
            <div class="card">
                <h2>📚 Standards Freshness</h2>
                <div class="stat">${freshnessPercent}%</div>
                <div class="stat-label">${standardsCount} of ${totalStandards} files exist</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${freshnessPercent}%">${freshnessPercent}%</div>
                </div>
            </div>
            
            <div class="card">
                <h2>📝 Corrections Log</h2>
                <div class="stat">${metrics.corrections.totalSessions || 0}</div>
                <div class="stat-label">Total Sessions</div>
                <ul class="list">
                    <li><span class="badge badge-danger">HIGH</span> ${metrics.corrections.highPriority || 0} issues</li>
                    <li><span class="badge badge-warning">MEDIUM</span> ${metrics.corrections.mediumPriority || 0} issues</li>
                    <li><span class="badge badge-success">LOW</span> ${metrics.corrections.lowPriority || 0} issues</li>
                    <li><span class="badge badge-info">Updates</span> ${metrics.corrections.ruleUpdates || 0} rule updates</li>
                </ul>
            </div>
            
            <div class="card">
                <h2>📦 Product Context</h2>
                <ul class="list">
                    ${Object.entries(metrics.files).map(([file, exists]) => 
                        `<li>${exists ? '✅' : '❌'} ${file.split('/').pop()}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="card">
                <h2>⚖️ Policy</h2>
                ${metrics.policy.enforcement ? `
                    <ul class="list">
                        ${metrics.policy.enforcement.testing ? 
                            `<li>Testing: <span class="badge badge-info">${metrics.policy.enforcement.testing.numbered_cases || 'not set'}</span></li>` : ''}
                        ${metrics.policy.enforcement.code_style ? 
                            `<li>Code Style: <span class="badge badge-info">${metrics.policy.enforcement.code_style.typescript_strict || 'not set'}</span></li>` : ''}
                    </ul>
                ` : '<p>No policy configured</p>'}
            </div>
        </div>
        
        <div class="card">
            <h2>📊 Standards Files</h2>
            <ul class="list">
                ${Object.entries(metrics.standards).map(([file, data]) => {
                    if (!data.exists) return `<li>❌ ${file}</li>`;
                    const days = data.daysSinceUpdate || 0;
                    const badge = days > 90 ? 'badge-warning' : days > 30 ? 'badge-info' : 'badge-success';
                    return `<li>✅ ${file} <span class="badge ${badge}">${days} days old</span></li>`;
                }).join('')}
            </ul>
        </div>
    </div>
    
    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>`;
  }
}

async function dashboard(options) {
  const cmd = new DashboardCommand();
  await cmd.run(options);
}

module.exports = dashboard;

