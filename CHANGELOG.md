# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2026-02-14

### Changed

- Templates are now framework-agnostic skeleton `.md` files instead of React/TypeScript-specific `.tsx`/`.ts` files
  - `templates/component.md` (was `component.tsx`)
  - `templates/test.md` (was `test.tsx`)
  - `templates/story.md` (was `story.tsx`)
  - `templates/hook.md` (was `hook.ts`)
  - `templates/api.md` (was `api.ts`)
- Templates are now created locally as skeleton files during `ck install` (no longer downloaded from remote)
- `ck update` no longer overwrites template files (they are user-owned content)
- Updated all integration bridge files to reference `.md` templates

### Removed

- React/TypeScript-specific template files (`component.tsx`, `test.tsx`, `story.tsx`, `hook.ts`, `api.ts`)

## [0.7.4] - 2025-06-15

### Changed

- Renamed project from Vibe Kit to ContextKit
- CLI aliases: `contextkit`, `ck` (new); `vibe-kit`, `vk` (deprecated with warning)
- Project directory: `.contextkit/` (was `.vibe-kit/`)
- Auto-migration from `.vibe-kit/` to `.contextkit/` on install
- Simplified git hooks to pre-push only

## [0.7.0] - 2025-06-01

### Added

- Modular platform integration system with `BaseIntegration` class
- Bridge files with smart marker-based conflict handling
- Platform-specific rule files for Claude, Cursor, Copilot, Windsurf, Aider, Codex, Gemini, Continue
- Auto-detection of AI tools during install

### Changed

- Migrated from monolithic integration files to per-platform modules

## [0.6.0] - 2025-05-15

### Added

- Enterprise features and monorepo support
- Codex CLI integration
- Skeleton-based standards generation for universal project support
- Platform-specific installs (`ck <platform>`)
- AI shortcut command (`ck ai`)

## [0.5.0] - 2025-05-01

### Added

- Initial public release as Vibe Kit
- CLI tool with install, update, status, check, analyze commands
- Standards, templates, commands, and hooks system
- Cursor, Claude, Aider, and Copilot integrations
- Project type detection (React, Vue, Next.js, Angular, Node.js, Python, Rust)

[0.8.0]: https://github.com/nolrm/contextkit/compare/v0.7.4...v0.8.0
[0.7.4]: https://github.com/nolrm/contextkit/compare/v0.7.0...v0.7.4
[0.7.0]: https://github.com/nolrm/contextkit/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/nolrm/contextkit/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/nolrm/contextkit/releases/tag/v0.5.0
