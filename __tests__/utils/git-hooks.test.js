const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const GitHooksManager = require('../../lib/utils/git-hooks');

let tmpDir;
let originalCwd;
let manager;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ck-hooks-'));
  originalCwd = process.cwd();
  process.chdir(tmpDir);

  // Create minimal package.json with husky so installHusky is a no-op
  await fs.writeJson('package.json', {
    name: 'test-project',
    devDependencies: { husky: '^9.0.0' }
  });

  manager = new GitHooksManager();
});

afterEach(async () => {
  process.chdir(originalCwd);
  await fs.remove(tmpDir);
});

describe('GitHooksManager - selective hook installation', () => {
  it('1. installs both hooks when both choices are true', async () => {
    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    expect(fs.existsSync('.husky/pre-push')).toBe(true);
    expect(fs.existsSync('.husky/commit-msg')).toBe(true);
  });

  it('2. installs only pre-push when commitMsg is false', async () => {
    await manager.installHooks('npm', { prePush: true, commitMsg: false });

    expect(fs.existsSync('.husky/pre-push')).toBe(true);
    expect(fs.existsSync('.husky/commit-msg')).toBe(false);
  });

  it('3. installs only commit-msg when prePush is false', async () => {
    await manager.installHooks('npm', { prePush: false, commitMsg: true });

    expect(fs.existsSync('.husky/pre-push')).toBe(false);
    expect(fs.existsSync('.husky/commit-msg')).toBe(true);
  });

  it('4. hook files forward arguments with "$@"', async () => {
    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    const prePush = await fs.readFile('.husky/pre-push', 'utf8');
    const commitMsg = await fs.readFile('.husky/commit-msg', 'utf8');

    expect(prePush).toContain('.contextkit/hooks/pre-push.sh "$@"');
    expect(commitMsg).toContain('.contextkit/hooks/commit-msg.sh "$@"');
  });

  it('5. hook files are executable', async () => {
    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    const prePushStat = await fs.stat('.husky/pre-push');
    const commitMsgStat = await fs.stat('.husky/commit-msg');

    // Check owner execute bit (0o100)
    expect(prePushStat.mode & 0o100).toBeTruthy();
    expect(commitMsgStat.mode & 0o100).toBeTruthy();
  });

  it('6. defaults to both hooks when hookChoices is omitted', async () => {
    await manager.installHooks('npm');

    expect(fs.existsSync('.husky/pre-push')).toBe(true);
    expect(fs.existsSync('.husky/commit-msg')).toBe(true);
  });

  it('7. backs up existing hooks before overwriting', async () => {
    // Create pre-existing hook
    await fs.ensureDir('.husky');
    await fs.writeFile('.husky/pre-push', '#!/bin/sh\necho "original"');

    await manager.installHooks('npm', { prePush: true, commitMsg: false });

    expect(fs.existsSync('.husky/pre-push.backup')).toBe(true);
    const backup = await fs.readFile('.husky/pre-push.backup', 'utf8');
    expect(backup).toContain('original');
  });
});
