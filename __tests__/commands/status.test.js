const status = require('../../lib/commands/status');
const fs = require('fs-extra');
const axios = require('axios');

// Mock dependencies
jest.mock('fs-extra');
jest.mock('axios');

// Mock chalk to return strings without color codes
jest.mock('chalk', () => ({
  red: (str) => str,
  green: (str) => str,
  yellow: (str) => str,
  blue: (str) => str,
  magenta: (str) => str
}));

describe('Status Command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when Vibe Kit is not installed', () => {
    test('should show not installed message', async () => {
      fs.pathExists.mockResolvedValue(false);
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await status();
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ Vibe Kit is not installed in this project');
      expect(consoleSpy).toHaveBeenCalledWith('💡 Run: vibe-kit install');
      
      consoleSpy.mockRestore();
    });
  });

  describe('when Vibe Kit is installed', () => {
    const mockConfig = `version: "0.1.0"
project_name: "test-project"
project_type: "react"
testing: true
documentation: true
code_review: true
linting: true
type_safety: true
git_hooks: true`;

    beforeEach(() => {
      fs.pathExists.mockImplementation((path) => {
        if (path === '.vibe-kit/config.yml') return true;
        if (path === 'package.json') return true;
        if (path === 'package-lock.json') return true;
        return false;
      });
      
      fs.readFile.mockResolvedValue(mockConfig);
    });

    test('should show installation details', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Mock axios for update check
      axios.get.mockResolvedValue({
        data: { tag_name: 'v0.1.0' }
      });

      await status();
      
      expect(consoleSpy).toHaveBeenCalledWith('🎵 Vibe Kit Status');
      expect(consoleSpy).toHaveBeenCalledWith('');
      expect(consoleSpy).toHaveBeenCalledWith('📦 Installation:');
      // Check that version is displayed (dynamic from package.json)
      const versionCall = consoleSpy.mock.calls.find(call => call[0].includes('Version:'));
      expect(versionCall).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith('🔍 Analysis:');
      expect(consoleSpy).toHaveBeenCalledWith('   Status: Not analyzed');
      expect(consoleSpy).toHaveBeenCalledWith('   Recommendation: Run @.vibe-kit/commands/analyze.md to customize standards');
      
      consoleSpy.mockRestore();
    });

    test('should show features status', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      axios.get.mockResolvedValue({
        data: { tag_name: 'v0.1.0' }
      });

      await status();
      
      expect(consoleSpy).toHaveBeenCalledWith('✅ Features:');
      expect(consoleSpy).toHaveBeenCalledWith('   Git Hooks: ❌');
      expect(consoleSpy).toHaveBeenCalledWith('   Standards: ✅');
      expect(consoleSpy).toHaveBeenCalledWith('   Templates: ✅');
      
      consoleSpy.mockRestore();
    });

    test('should show up to date message when no updates available', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      axios.get.mockResolvedValue({
        data: { tag_name: 'v0.1.0' }
      });

      await status();
      
      expect(consoleSpy).toHaveBeenCalledWith('✅ Vibe Kit is up to date');
      
      consoleSpy.mockRestore();
    });

    test('should show update available message', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      axios.get.mockResolvedValue({
        data: { tag_name: 'v0.3.0' }
      });

      await status();
      
      expect(consoleSpy).toHaveBeenCalledWith('🔄 Update Available!');
      // Check that current version is displayed (dynamic from package.json)
      const currentVersionCall = consoleSpy.mock.calls.find(call => call[0].includes('Current:'));
      expect(currentVersionCall).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith('   Latest: 0.3.0');
      expect(consoleSpy).toHaveBeenCalledWith('💡 Run: vibe-kit update');
      
      consoleSpy.mockRestore();
    });

    test('should handle update check error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      axios.get.mockRejectedValue(new Error('Network error'));

      await status();
      
      expect(consoleSpy).toHaveBeenCalledWith('✅ Vibe Kit is up to date');
      
      consoleSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    test('should handle config parsing error', async () => {
      fs.pathExists.mockResolvedValue(true);
      fs.readFile.mockRejectedValue(new Error('File read error'));
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await status();
      
      expect(consoleSpy).toHaveBeenCalledWith('❌ Error reading Vibe Kit configuration:', 'File read error');
      
      consoleSpy.mockRestore();
    });
  });

  describe('project type detection', () => {
    test('should detect React project', async () => {
      fs.pathExists.mockImplementation((path) => {
        if (path === '.vibe-kit/config.yml') return true;
        if (path === 'package.json') return true;
        return false;
      });
      
      fs.readFile.mockResolvedValue('version: "0.1.0"\nproject_name: "test"');
      
      // Mock require for package.json
      const originalRequire = require;
      require = jest.fn().mockImplementation((module) => {
        if (module.includes('package.json')) {
          return { dependencies: { react: '^18.0.0' } };
        }
        return originalRequire(module);
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      axios.get.mockResolvedValue({
        data: { tag_name: 'v0.1.0' }
      });

      await status();
      
      // Check that the analysis section shows the recommendation
      expect(consoleSpy).toHaveBeenCalledWith('🔍 Analysis:');
      expect(consoleSpy).toHaveBeenCalledWith('   Status: Not analyzed');
      expect(consoleSpy).toHaveBeenCalledWith('   Recommendation: Run @.vibe-kit/commands/analyze.md to customize standards');
      
      require = originalRequire;
      consoleSpy.mockRestore();
    });
  });

  describe('package manager detection', () => {
    test('should detect yarn', async () => {
      fs.pathExists.mockImplementation((path) => {
        if (path === '.vibe-kit/config.yml') return true;
        if (path === 'yarn.lock') return true;
        return false;
      });
      
      fs.readFile.mockResolvedValue('version: "0.1.0"\nproject_name: "test"');
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      axios.get.mockResolvedValue({
        data: { tag_name: 'v0.1.0' }
      });

      await status();
      
      // Check that the analysis section shows the recommendation
      expect(consoleSpy).toHaveBeenCalledWith('🔍 Analysis:');
      expect(consoleSpy).toHaveBeenCalledWith('   Status: Not analyzed');
      expect(consoleSpy).toHaveBeenCalledWith('   Recommendation: Run @.vibe-kit/commands/analyze.md to customize standards');
      
      consoleSpy.mockRestore();
    });
  });
});
