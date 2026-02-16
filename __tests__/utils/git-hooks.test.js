const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const GitHooksManager = require('../../lib/utils/git-hooks');

let tmpDir;
let originalCwd;
let manager;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ck-hooks-'));
  originalCwd = process.cwd();
  process.chdir(tmpDir);

  // Initialize a real git repo so .git/hooks/ works
  execSync('git init', { stdio: 'pipe' });

  // Create .contextkit/hooks/ with dummy scripts
  await fs.ensureDir('.contextkit/hooks');
  await fs.writeFile('.contextkit/hooks/pre-push.sh', '#!/bin/sh\nexit 0');
  await fs.writeFile('.contextkit/hooks/commit-msg.sh', '#!/bin/sh\nexit 0');

  manager = new GitHooksManager();
});

afterEach(async () => {
  process.chdir(originalCwd);
  await fs.remove(tmpDir);
});

describe('GitHooksManager - native git hooks', () => {
  it('1. installs both hooks when both choices are true', async () => {
    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    expect(fs.existsSync('.git/hooks/pre-push')).toBe(true);
    expect(fs.existsSync('.git/hooks/commit-msg')).toBe(true);
  });

  it('2. installs only pre-push when commitMsg is false', async () => {
    // Remove default git sample hooks to avoid false positives
    await manager.installHooks('npm', { prePush: true, commitMsg: false });

    expect(fs.existsSync('.git/hooks/pre-push')).toBe(true);
    const commitMsgExists = fs.existsSync('.git/hooks/commit-msg');
    // commit-msg should not exist (only sample may exist)
    if (commitMsgExists) {
      const content = await fs.readFile('.git/hooks/commit-msg', 'utf8');
      expect(content).not.toContain('ContextKit');
    }
  });

  it('3. installs only commit-msg when prePush is false', async () => {
    await manager.installHooks('npm', { prePush: false, commitMsg: true });

    expect(fs.existsSync('.git/hooks/commit-msg')).toBe(true);
    const prePushExists = fs.existsSync('.git/hooks/pre-push');
    if (prePushExists) {
      const content = await fs.readFile('.git/hooks/pre-push', 'utf8');
      expect(content).not.toContain('ContextKit');
    }
  });

  it('4. hook files forward arguments with "$@"', async () => {
    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    const prePush = await fs.readFile('.git/hooks/pre-push', 'utf8');
    const commitMsg = await fs.readFile('.git/hooks/commit-msg', 'utf8');

    expect(prePush).toContain('.contextkit/hooks/pre-push.sh "$@"');
    expect(commitMsg).toContain('.contextkit/hooks/commit-msg.sh "$@"');
  });

  it('5. hook files are executable', async () => {
    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    const prePushStat = await fs.stat('.git/hooks/pre-push');
    const commitMsgStat = await fs.stat('.git/hooks/commit-msg');

    // Check owner execute bit (0o100)
    expect(prePushStat.mode & 0o100).toBeTruthy();
    expect(commitMsgStat.mode & 0o100).toBeTruthy();
  });

  it('6. defaults to both hooks when hookChoices is omitted', async () => {
    await manager.installHooks('npm');

    expect(fs.existsSync('.git/hooks/pre-push')).toBe(true);
    expect(fs.existsSync('.git/hooks/commit-msg')).toBe(true);
  });

  it('7. backs up existing hooks before overwriting', async () => {
    // Create pre-existing hook (not a ContextKit hook)
    await fs.writeFile('.git/hooks/pre-push', '#!/bin/sh\necho "original"');

    await manager.installHooks('npm', { prePush: true, commitMsg: false });

    expect(fs.existsSync('.git/hooks/pre-push.backup')).toBe(true);
    const backup = await fs.readFile('.git/hooks/pre-push.backup', 'utf8');
    expect(backup).toContain('original');
  });

  it('8. hook content contains ContextKit marker comment', async () => {
    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    const prePush = await fs.readFile('.git/hooks/pre-push', 'utf8');
    const commitMsg = await fs.readFile('.git/hooks/commit-msg', 'utf8');

    expect(prePush).toContain('ContextKit managed hook');
    expect(commitMsg).toContain('ContextKit managed hook');
  });

  it('9. skips if not a git repo (no .git/)', async () => {
    // Remove .git to simulate a non-git directory
    await fs.remove('.git');

    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    // No hooks should be created since there's no .git
    expect(fs.existsSync('.git/hooks/pre-push')).toBe(false);
  });

  it('10. cleans up legacy .husky/ directory', async () => {
    // Create a legacy .husky dir with ContextKit markers
    await fs.ensureDir('.husky');
    await fs.writeFile('.husky/pre-push', '#!/bin/sh\n.contextkit/hooks/pre-push.sh');

    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    // .husky should be removed
    expect(fs.existsSync('.husky')).toBe(false);
    // Native hooks should be installed
    expect(fs.existsSync('.git/hooks/pre-push')).toBe(true);
  });

  it('11. does not remove .husky/ if it has no ContextKit markers', async () => {
    // Create a .husky dir without ContextKit markers (user's own hooks)
    await fs.ensureDir('.husky');
    await fs.writeFile('.husky/pre-push', '#!/bin/sh\necho "user hook"');

    await manager.installHooks('npm', { prePush: true, commitMsg: true });

    // .husky should remain (not ours to remove)
    expect(fs.existsSync('.husky')).toBe(true);
  });
});
