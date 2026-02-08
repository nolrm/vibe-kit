const { execSync } = require('child_process');
const path = require('path');
const packageJson = require('../../package.json');

describe('CLI Integration Tests', () => {
  const cliPath = path.join(__dirname, '../../bin/vibe-kit.js');

  describe('version command', () => {
    test('should show version', () => {
      const result = execSync(`node "${cliPath}" --version`, { encoding: 'utf8' });
      expect(result.trim()).toBe(packageJson.version);
    });

    test('should show version with -v flag', () => {
      const result = execSync(`node "${cliPath}" -v`, { encoding: 'utf8' });
      expect(result.trim()).toBe(packageJson.version);
    });
  });

  describe('help command', () => {
    test('should show help', () => {
      const result = execSync(`node "${cliPath}" --help`, { encoding: 'utf8' });
      expect(result).toContain('Get the right vibe for your code');
      expect(result).toContain('Commands:');
      expect(result).toContain('install');
      expect(result).toContain('status');
      expect(result).toContain('update');
    });

    test('should show platform commands in help', () => {
      const result = execSync(`node "${cliPath}" --help`, { encoding: 'utf8' });
      expect(result).toContain('windsurf');
      expect(result).toContain('codex');
      expect(result).toContain('copilot');
      expect(result).toContain('claude');
      expect(result).toContain('cursor');
      expect(result).toContain('gemini');
      expect(result).toContain('aider');
    });

    test('should show help for install command', () => {
      const result = execSync(`node "${cliPath}" install --help`, { encoding: 'utf8' });
      expect(result).toContain('Install Vibe Kit in current project');
      expect(result).toContain('--no-hooks');
      expect(result).toContain('--non-interactive');
    });
  });

  describe('status command', () => {
    test('should run status command', () => {
      const result = execSync(`node "${cliPath}" status`, { encoding: 'utf8' });
      expect(result).toContain('Vibe Kit is not installed');
    });
  });

  describe('error handling', () => {
    test('should handle unknown command as AI prompt', () => {
      // Unknown commands are now treated as prompts, not errors
      const result = execSync(`node "${cliPath}" unknown-command`, { encoding: 'utf8' });
      expect(result).toContain('Vibe Kit not initialized');
    });
  });
});
