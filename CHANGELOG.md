# Changelog

## [0.9.4] - 2026-02-16

### Added
- **Slash Commands** for Claude Code (`.claude/commands/`) and Cursor (`.cursor/prompts/`)
  - `/analyze` — scan codebase and generate standards content
  - `/review` — code review with checklist
  - `/fix` — diagnose and fix bugs
  - `/refactor` — refactor code with safety checks
  - `/test` — generate comprehensive tests
  - `/doc` — add documentation
- Both platforms delegate to universal `.contextkit/commands/` files
- New command files: `review.md`, `fix.md`, `refactor.md`

### Changed
- Git hooks now use `git config core.hooksPath .contextkit/hooks` instead of writing to `.git/hooks/`
- Auto-injects `prepare` script into `package.json` so hooks work for all devs after `npm install`
- Hook files renamed from `.sh` extension to match git conventions (`pre-push`, `commit-msg`)
- All existing commands rewritten to be framework-agnostic (no React assumptions)
- Legacy `.git/hooks/` ContextKit wrappers automatically cleaned up

### Fixed
- Gradle quality gate now checks for `gradlew` and verifies `check` task exists
- Go and Maven gates skip when no source files exist

## [0.9.0] - 2026-02-16

### Added
- **Quality Gates**: Pre-push hooks now auto-detect your project framework and run the right checks automatically
  - Node.js: TypeScript, ESLint, Prettier, build, test (auto-detects npm/yarn/pnpm/bun)
  - Python: ruff/flake8, mypy, black/ruff format, pytest
  - Rust: cargo check, clippy, cargo test
  - Go: go vet, golangci-lint, go test
  - PHP: PHPStan, PHPUnit
  - Ruby: RuboCop, RSpec/rake test
  - Java: Maven verify / Gradle check
  - Generic: informational message for unrecognized projects
- All gates skip gracefully when tools aren't installed
- Integration test suite for framework detection and hook installation

### Changed
- Git hooks now use native approach instead of Husky
- Hooks work in any git repo — no longer requires package.json or Node.js
- `ck install` hooks prompt now checks for `.git/` instead of `package.json`
- Install prompt updated with "Quality Gates" branding

### Removed
- Husky dependency — no longer installed or required
- `installHusky()`, `checkHuskyInstalled()`, `initializeHusky()`, `checkCommandExists()` methods from GitHooksManager

### Fixed
- Pre-push script grep patterns now match script keys (`"test":`) instead of any occurrence of the word in package.json

### Migration
- Existing `.husky/` directories with ContextKit markers are automatically cleaned up on next `ck install`
- Users can manually run `npm uninstall husky` to remove the dependency
