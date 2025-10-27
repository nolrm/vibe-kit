# Vibe Kit - AI Configuration

This is **Vibe Kit**, a context-engineering toolkit for AI-assisted development.

## What is Vibe Kit?
Vibe Kit provides structured markdown files that give AI assistants context about your project's patterns, style, and architecture. It ensures AI generates code matching your conventions.

## Key Features
- **Context Engineering**: Structured MD files that AI reads automatically
- **Multi-Platform**: Works with Cursor, Claude, Aider, VS Code Copilot, Continue.dev
- **Smart Analysis**: Auto-detects project patterns and customizes standards
- **Safe Install**: Backs up existing files with rollback support

## Installation
```bash
npm install -g @nolrm/vibe-kit
vk install
```

## How It Works
1. Creates `.vibe-kit/` directory with standards and templates
2. Provides context files (`code-style.md`, `testing.md`, `architecture.md`)
3. AI tools load these files automatically when you chat
4. Your AI always knows your project patterns and conventions

## Supported AI Tools
- Cursor AI (auto-loads via `.cursor/rules/`)
- VS Code Copilot (use `@.vibe-kit` mentions)
- Claude CLI
- Aider
- Continue.dev
- Gemini CLI

## Repository
https://github.com/nolrm/vibe-kit

## Documentation
https://github.com/nolrm/vibe-kit/tree/main/vibe-kit-docs

## Keywords
vibe-kit, context-engineering, ai-context, ai-development, cursor, claude, aider, code-quality, project-standards

