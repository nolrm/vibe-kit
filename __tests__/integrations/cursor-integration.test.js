const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const CursorIntegration = require('../../lib/integrations/cursor-integration');

describe('CursorIntegration', () => {
  let tempDir;
  let originalCwd;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vibe-kit-cursor-'));
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(tempDir);
  });

  test('1. creates scoped .mdc rule files', async () => {
    const integration = new CursorIntegration();
    await integration.install();

    expect(await fs.pathExists('.cursor/rules/vibe-kit-standards.mdc')).toBe(true);
    expect(await fs.pathExists('.cursor/rules/vibe-kit-testing.mdc')).toBe(true);
    expect(await fs.pathExists('.cursor/rules/vibe-kit-components.mdc')).toBe(true);
    expect(await fs.pathExists('.cursor/rules/vibe-kit-api.mdc')).toBe(true);
  });

  test('2. standards rule has alwaysApply true', async () => {
    const integration = new CursorIntegration();
    await integration.install();

    const content = await fs.readFile('.cursor/rules/vibe-kit-standards.mdc', 'utf-8');
    expect(content).toContain('alwaysApply: true');
    expect(content).toContain('@.vibe-kit/standards/code-style.md');
  });

  test('3. testing rule has test file globs', async () => {
    const integration = new CursorIntegration();
    await integration.install();

    const content = await fs.readFile('.cursor/rules/vibe-kit-testing.mdc', 'utf-8');
    expect(content).toContain('*.test.*');
    expect(content).toContain('*.spec.*');
    expect(content).toContain('alwaysApply: false');
  });

  test('4. components rule scoped to components directory', async () => {
    const integration = new CursorIntegration();
    await integration.install();

    const content = await fs.readFile('.cursor/rules/vibe-kit-components.mdc', 'utf-8');
    expect(content).toContain('**/components/**');
  });

  test('5. removes legacy monolithic vibe-kit.mdc', async () => {
    // Create legacy file
    await fs.ensureDir('.cursor/rules');
    await fs.writeFile('.cursor/rules/vibe-kit.mdc', '# Legacy content');

    const integration = new CursorIntegration();
    await integration.install();

    expect(await fs.pathExists('.cursor/rules/vibe-kit.mdc')).toBe(false);
    expect(await fs.pathExists('.cursor/rules/vibe-kit-standards.mdc')).toBe(true);
  });

  test('6. validate returns valid after install', async () => {
    const integration = new CursorIntegration();
    await integration.install();

    const result = await integration.validate();
    expect(result.valid).toBe(true);
  });
});
