# ContextKit

> Context Engineering for AI Development

Give your AI assistants (Cursor, Claude, Copilot, Codex, Gemini, Aider, Continue, Windsurf) structured context through markdown files. ContextKit creates a knowledge base that ensures AI generates code matching your exact patterns, style, and architecture—no more hallucinated code or mismatched conventions.

ContextKit is a CLI tool that provides **context-engineering** capabilities by creating `.contextkit/` directories with project standards, guidelines, and patterns that AI assistants read automatically.

**[Read the full documentation](https://contextkit-docs.vercel.app/)**

## Why ContextKit?

**The problem:** LLMs are great at syntax, not at *your* conventions. Generic AI output requires manual fixes for style, structure, and architecture.

**The solution:** ContextKit provides your AI with:
- **Glossary** of project terminology and business terms (e.g., `checkout`, `customer`, `order`)
- **Standards** for code style, testing patterns, and architecture
- **Templates** with canonical component shapes

Update `.md` files as your project evolves; the AI follows.

## Multi-Platform Support

Works with: **Cursor** • **Claude Code** • **GitHub Copilot** • **Codex CLI** • **Gemini CLI** • **Aider** • **Continue** • **Windsurf**

Each platform gets auto-loaded bridge files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.windsurfrules`, etc.) so your AI tools read project standards automatically.

---

## Quick Start (60s)

**Requirements:** Node.js 14.x+ (16.x+ recommended) and npm/yarn. Optional: Git for hooks, AI tools for usage.

```bash
# Step 1: Install globally (recommended)
npm i -g @nolrm/contextkit

# Step 2: Navigate to your project and install
cd your-project
contextkit install
```

This creates `.contextkit/` with skeleton context files (blank templates to be filled by AI):

```
.contextkit/
  standards/       # Skeleton files: code-style.md, testing.md, architecture.md, ai-guidelines.md, workflows.md
                  # Real files: glossary.md (universal), README.md (overview)
  commands/        # analyze.md (project analysis & customization)
  templates/       # skeleton template files (component, test, story, hook, api)
```

**Generate content with AI** (recommended):

```bash
ck analyze
# AI scans your codebase and generates content for the skeleton files
# or in Cursor chat:  @.contextkit/commands/analyze.md
```

⚠️ **Important:** After running `ck analyze`, manually review and edit the generated content to match your exact needs. The AI provides a starting point, but you must customize it.

---

## Multi-Team Workflow

Perfect for teams where members use different AI tools:

```bash
# First team member (any tool) - sets up the project
contextkit install

# Each team member adds their platform
ck claude      # creates CLAUDE.md + .claude/rules/
ck cursor      # creates .cursor/rules/ (scoped .mdc files)
ck copilot     # creates .github/copilot-instructions.md
ck codex       # creates AGENTS.md
ck gemini      # creates GEMINI.md + .gemini/settings.json
ck aider       # creates CONVENTIONS.md + .aider/rules.md
ck continue    # creates .continue/rules/ + config.yaml
ck windsurf    # creates .windsurfrules + .windsurf/rules/
ck vscode      # alias for copilot
```

Each platform generates bridge files that the AI tool auto-reads. If a bridge file already exists (e.g., you have a custom `CLAUDE.md`), ContextKit appends its section below your content instead of overwriting. Share your `.contextkit/standards/*.md` files with the team and everyone gets the same context.

---

## See the difference (before → after)

**Prompt**
```
"Add checkout flow for customer"
```

**What the AI does with ContextKit**
- Reads `glossary.md` → `checkout` = checkout process; `customer` = customer account
- Applies `code-style.md` → strict TS, functional components
- Follows `testing.md` → numbered test cases

**Result (diff)**
```diff
- const Checkout = () => <button>Buy</button>
+ export function CheckoutFlow({ customer }: { customer: string }) {
+   // Uses customer from glossary context
+   return <div>Checkout for {customer}</div>
+ }
```

---

## Use it in your tool

**Cursor** — rules auto-load from `.cursor/rules/`
```
@.contextkit/commands/analyze.md
```

**Claude Code** — reads `CLAUDE.md` + `.claude/rules/` automatically
```bash
claude "create checkout flow for customer"
```

**GitHub Copilot** — reads `.github/copilot-instructions.md` automatically
```
@.contextkit Create checkout flow for customer
```

**Codex CLI** — reads `AGENTS.md` automatically
```bash
codex "create checkout flow for customer"
```

**CLI** (Chat with AI)
```bash
ck ai "create checkout flow for customer"
```

---

## Key Features

- 🧠 **Context Engineering** - Structured MD files your AI reads automatically
- 🔍 **Smart Analysis** - AI generates standards content based on your codebase
- 🌍 **Project Agnostic** - Works with React, Vue, Node.js, PHP, Python, Rust, monorepos—any project type
- 🤖 **Multi-Platform** - Works with Cursor, Claude Code, Copilot, Codex, Gemini, Aider, Continue, Windsurf
- 🛡️ **Safe Install** - Backs up existing files with rollback support
- ⚡ **Zero Config** - Auto-detects package managers and AI tools
- ✅ **Policy Enforcement** - Configurable validation with `ck check`
- 📝 **Corrections Tracking** - Track AI performance issues with corrections log
- 🔄 **Workflow Orchestration** - Structured workflows with `ck run`
- 📦 **Registry System** - Share standards across teams with `ck publish/pull`
- 📊 **Observability Dashboard** - Visual metrics and compliance tracking

## Commands

```bash
# Installation & Setup
ck install     # set up .contextkit in this repo
ck claude      # add Claude Code integration (CLAUDE.md + rules)
ck cursor      # add Cursor integration (scoped .mdc rules)
ck copilot     # add GitHub Copilot integration
ck codex       # add Codex CLI integration (AGENTS.md)
ck gemini      # add Gemini CLI integration (GEMINI.md)
ck aider       # add Aider integration (CONVENTIONS.md)
ck continue    # add Continue integration
ck windsurf    # add Windsurf integration (.windsurfrules)
ck vscode      # alias for copilot

# Analysis & Updates
ck analyze     # customize standards to your project
ck update      # pull latest updates
ck status      # check install & integrations

# Validation & Compliance
ck check       # validate installation & policy compliance
ck check --strict  # treat warnings as errors

# Corrections Logging
ck note "message"  # add note to corrections log
ck note "AI issue" --category "AI Behavior" --priority HIGH

# Workflow Orchestration
ck run <workflow>  # run structured workflow
ck run create-component  # example workflow
ck run create-component --interactive  # interactive mode

# Registry & Versioning
ck publish --name @company/react-standards --version 1.0.0
ck pull @company/react-standards@1.0.0
ck pull @company/react-standards@latest --backup

# Observability
ck dashboard   # start web dashboard
ck dashboard --no-server  # CLI metrics only

# AI Usage (loads .contextkit context automatically)
ck "create a button"  # quick AI chat with context
ck ai "create a button"  # explicit AI command
```

## Links

• 🐛 [Issues](https://github.com/nolrm/contextkit/issues)
• 💬 [Discussions](https://github.com/nolrm/contextkit/discussions)

---

## License

MIT

## Author

**Marlon Maniti**  
GitHub: [@nolrm](https://github.com/nolrm)
