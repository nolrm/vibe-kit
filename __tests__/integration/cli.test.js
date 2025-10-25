const { execSync } = require('child_process');
const path = require('path');

describe('CLI Integration Tests', () => {
  const cliPath = path.join(__dirname, '../../bin/vibe-kit.js');

  describe('version command', () => {
    test('should show version', () => {
      const result = execSync(`node "${cliPath}" --version`, { encoding: 'utf8' });
      expect(result.trim()).toBe('0.1.0');
    });

    test('should show version with -v flag', () => {
      const result = execSync(`node "${cliPath}" -v`, { encoding: 'utf8' });
      expect(result.trim()).toBe('0.1.0');
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
    test('should handle unknown command', () => {
      expect(() => {
        execSync(`node "${cliPath}" unknown-command`, { encoding: 'utf8' });
      }).toThrow();
    });
  });
});
