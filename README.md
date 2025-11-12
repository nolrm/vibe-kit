# Vibe Kit

> Context Engineering for AI Development

Give your AI assistants (Cursor, Claude, VS Code Copilot, Aider) structured context through markdown files. Vibe Kit creates a knowledge base that ensures AI generates code matching your exact patterns, style, and architecture—no more hallucinated code or mismatched conventions.

Vibe Kit is a CLI tool that provides **context-engineering** capabilities by creating `.vibe-kit/` directories with project standards, guidelines, and patterns that AI assistants read automatically.

## Why Vibe Kit?

**The problem:** LLMs are great at syntax, not at *your* conventions. Generic AI output requires manual fixes for style, structure, and architecture.

**The solution:** Vibe Kit provides your AI with:
- **Glossary** of project terminology and business terms (e.g., `checkout`, `customer`, `order`)
- **Standards** for code style, testing patterns, and architecture
- **Templates** with canonical component shapes

Update `.md` files as your project evolves; the AI follows.

## Multi-Platform Support

Works with: **Cursor** (auto) • **VS Code** (`@.vibe-kit`) • **Claude CLI** • **Codex CLI** • **Aider** • **Continue** • **Gemini CLI**

---

## Quick Start (60s)

**Requirements:** Node.js 14.x+ (16.x+ recommended) and npm/yarn. Optional: Git for hooks, AI tools for usage.

```bash
# Step 1: Install globally (recommended)
npm i -g @nolrm/vibe-kit

# Step 2: Navigate to your project and install
cd your-project
vibe-kit install
```

This creates `.vibe-kit/` with skeleton context files (blank templates to be filled by AI):

```
.vibe-kit/
  standards/       # Skeleton files: code-style.md, testing.md, architecture.md, ai-guidelines.md, workflows.md
                  # Real files: glossary.md (universal), README.md (overview)
  commands/        # analyze.md (project analysis & customization)
  templates/       # example component template
```

**Generate content with AI** (recommended):

```bash
vk analyze
# AI scans your codebase and generates content for the skeleton files
# or in Cursor chat:  @.vibe-kit/commands/analyze.md
```

⚠️ **Important:** After running `vk analyze`, manually review and edit the generated content to match your exact needs. The AI provides a starting point, but you must customize it.

---

## Multi-Team Workflow

Perfect for teams where members use different AI tools:

```bash
# First team member (any tool) - sets up the project
vibe-kit install

# Cursor users add their integration
vibe-kit cursor    # or: vk cursor

# Claude users add their integration  
vibe-kit claude    # or: vk claude

# Codex users add their integration
vibe-kit codex     # or: vk codex

# VS Code users add their integration
vibe-kit vscode    # or: vk vscode
```

Each platform integration is added to `.vibe-kit/` without overwriting existing files. Share your analyzed `.vibe-kit/standards/*.md` files with the team and everyone gets the same context.

---

## See the difference (before → after)

**Prompt**
```
"Add checkout flow for customer"
```

**What the AI does with Vibe Kit**
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

**Cursor** (AI chat)
```
@.vibe-kit/commands/analyze.md
```

**VS Code** (Copilot Chat)
```
@.vibe-kit Create checkout flow for customer
```

**CLI** (Chat with AI)
```bash
vk ai "create checkout flow for customer"
```

**Claude / Gemini / Codex / Aider** (Direct context)
```
read .vibe-kit/commands/analyze.md and execute
```

---

## Key Features

- 🧠 **Context Engineering** - Structured MD files your AI reads automatically
- 🔍 **Smart Analysis** - AI generates standards content based on your codebase
- 🌍 **Project Agnostic** - Works with React, Vue, Node.js, PHP, Python, Rust, monorepos—any project type
- 🤖 **Multi-Platform** - Works with Cursor, Claude CLI, Codex CLI, Aider, Continue, VS Code, Gemini
- 🛡️ **Safe Install** - Backs up existing files with rollback support
- ⚡ **Zero Config** - Auto-detects package managers and AI tools
- ✅ **Policy Enforcement** - Configurable validation with `vk check`
- 📝 **Corrections Tracking** - Track AI performance issues with corrections log
- 🔄 **Workflow Orchestration** - Structured workflows with `vk run`
- 📦 **Registry System** - Share standards across teams with `vk publish/pull`
- 📊 **Observability Dashboard** - Visual metrics and compliance tracking

## Commands

```bash
# Installation & Setup
vk install     # set up .vibe-kit in this repo
vk cursor      # add Cursor integration
vk continue    # add Continue integration
vk aider       # add Aider integration
vk vscode      # add VS Code integration
vk claude      # add Claude CLI integration
vk codex       # add Codex CLI integration
vk gemini      # add Gemini CLI integration

# Analysis & Updates
vk analyze     # customize standards to your project  
vk update      # pull latest updates
vk status      # check install & integrations

# Validation & Compliance
vk check       # validate installation & policy compliance
vk check --strict  # treat warnings as errors

# Corrections Logging
vk note "message"  # add note to corrections log
vk note "AI issue" --category "AI Behavior" --priority HIGH

# Workflow Orchestration
vk run <workflow>  # run structured workflow
vk run create-component  # example workflow
vk run create-component --interactive  # interactive mode

# Registry & Versioning
vk publish --name @company/react-standards --version 1.0.0
vk pull @company/react-standards@1.0.0
vk pull @company/react-standards@latest --backup

# Observability
vk dashboard   # start web dashboard
vk dashboard --no-server  # CLI metrics only

# AI Usage (loads .vibe-kit context automatically)
vk "create a button"  # quick AI chat with context
vk ai "create a button"  # explicit AI command
```

See [full documentation](https://vibe-kit-docs.vercel.app/) for detailed guides.

---

## Links

• 📚 [Full Documentation](https://vibe-kit-docs.vercel.app/)
• 🐛 [Issues](https://github.com/nolrm/vibe-kit/issues)
• 💬 [Discussions](https://github.com/nolrm/vibe-kit/discussions)

---

## License

MIT

## Author

**Marlon Maniti**  
GitHub: [@nolrm](https://github.com/nolrm)
