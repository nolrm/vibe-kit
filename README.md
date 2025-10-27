# Vibe Kit

> Context-aware AI for development

Give your AI assistants structured context through markdown files. Vibe Kit creates a knowledge base that ensures AI generates code matching your exact patterns, style, and architecture—no more hallucinated code or mismatched conventions.

## Why Vibe Kit?

**The problem:** LLMs are great at syntax, not at *your* conventions. Generic AI output requires manual fixes for style, structure, and architecture.

**The solution:** Vibe Kit provides your AI with:
- **Glossary** of project terminology and business terms (e.g., `checkout`, `customer`, `order`)
- **Standards** for code style, testing patterns, and architecture
- **Templates** with canonical component shapes

Update `.md` files as your project evolves; the AI follows.

## Multi-Platform Support

Works with: **Cursor** (auto) • **VS Code** (`@.vibe-kit`) • **Claude CLI** • **Aider** • **Continue** • **Gemini CLI**

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

This creates `.vibe-kit/` with starter context files:

```
.vibe-kit/
  standards/       # glossary.md, code-style.md, testing.md, architecture.md, ai-guidelines.md
  commands/        # analyze.md (project analysis & customization)
  templates/       # example component template
```

**Analyze & customize** (recommended):

```bash
vk analyze
# or in Cursor chat:  @.vibe-kit/commands/analyze.md
```

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

**Claude / Gemini / Aider** (Direct context)
```
read .vibe-kit/commands/analyze.md and execute
```

---

## Key Features

- 🧠 **Context Engineering** - Structured MD files your AI reads automatically
- 🔍 **Smart Analysis** - Auto-detects your project patterns and customizes standards
- 🤖 **Multi-Platform** - Works with Cursor, Claude CLI, Aider, Continue, VS Code, Gemini
- 🛡️ **Safe Install** - Backs up existing files with rollback support
- ⚡ **Zero Config** - Auto-detects package managers and AI tools

## Commands

```bash
vk install     # set up .vibe-kit in this repo
vk analyze     # customize standards to your project  
vk update      # pull latest updates
vk status      # check install & integrations
```

See [full documentation](https://github.com/nolrm/vibe-kit/tree/main/vibe-kit-docs) for detailed guides.

---

## Links

📚 [Full Documentation](https://github.com/nolrm/vibe-kit/tree/main/vibe-kit-docs) • 🐛 [Issues](https://github.com/nolrm/vibe-kit/issues) • 💬 [Discussions](https://github.com/nolrm/vibe-kit/discussions)

---

## License

MIT

## Author

**Marlon Maniti**  
GitHub: [@nolrm](https://github.com/nolrm)
