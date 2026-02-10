# ContextKit - AI Configuration

This is **ContextKit**, a context-engineering toolkit for AI-assisted development.

## What is ContextKit?
ContextKit provides structured markdown files that give AI assistants context about your project's patterns, style, and architecture. It ensures AI generates code matching your conventions.

## Key Features
- **Context Engineering**: Structured MD files that AI reads automatically
- **Multi-Platform**: Works with Cursor, Claude, Aider, VS Code Copilot, Continue.dev
- **Smart Analysis**: Auto-detects project patterns and customizes standards
- **Safe Install**: Backs up existing files with rollback support

## Installation
```bash
npm install -g @nolrm/contextkit
vk install
```

## How It Works
1. Creates `.contextkit/` directory with standards and templates
2. Provides context files (`code-style.md`, `testing.md`, `architecture.md`)
3. AI tools load these files automatically when you chat
4. Your AI always knows your project patterns and conventions

## Supported AI Tools
- Cursor AI (auto-loads via `.cursor/rules/`)
- VS Code Copilot (use `@.contextkit` mentions)
- Claude CLI
- Aider
- Continue.dev
- Gemini CLI

## Repository
https://github.com/nolrm/contextkit

## Documentation
https://github.com/nolrm/contextkit/tree/main/contextkit-docs

## Keywords
contextkit, context-engineering, ai-context, ai-development, cursor, claude, aider, code-quality, project-standards

