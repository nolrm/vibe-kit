# Changelog

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
- Git hooks now install to `.git/hooks/` (native) instead of `.husky/`
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
