# Getting Started

## What is ContextKit?

ContextKit is **Context Engineering for AI Development** - it provides structured MD files that AI assistants read as context to prevent hallucinations and generate code matching your exact patterns.

## How It Works

### 1. **Installation Creates Context Files**

```
.contextkit/
├── standards/           ← Code style, testing, architecture standards
│   ├── glossary.md      ← Project shortcuts (@btn, customer, etc.)
│   ├── code-style.md    ← Your coding conventions
│   ├── testing.md       ← Your test patterns
│   └── ai-guidelines.md ← AI behavior rules
├── product/             ← Product context (mission, roadmap, decisions)
├── instructions/        ← Workflow instructions
│   ├── meta/           ← Pre-flight/post-flight checks
│   └── core/           ← Core workflows
├── policies/           ← Policy enforcement configs
├── corrections.md      ← AI performance tracking
└── config.yml          ← Enhanced manifest schema
```

### 2. **AI Reads Files as Context**

In Cursor IDE, `.cursor/rules/contextkit.mdc` tells AI to read these files:

```markdown
- @.contextkit/standards/glossary.md       ← Project shortcuts
- @.contextkit/standards/code-style.md    ← Coding style
- @.contextkit/standards/testing.md       ← Test patterns
```

### 3. **You Use Shortcuts in Prompts**

```
Prompt: "Create @btn for customer login"
        ↓
AI reads glossary.md → "@btn" = Button component
AI reads glossary.md → "customer" = customer app
AI reads code-style.md → TypeScript strict mode
        ↓
Generated code matches YOUR patterns!
```

## Installation

### Quick Install

```bash
curl -sSL https://raw.githubusercontent.com/nolrm/contextkit/main/install-fallback.sh | bash
```

### Manual Install

```bash
git clone https://github.com/nolrm/contextkit.git
cd contextkit
bash install.sh
```

## Configuration

### Project Setup

1. Run the installation script
2. **Run project analysis** (recommended): `@.contextkit/commands/analyze.md`
3. Customize `.contextkit/config.yml`
4. Review standards in `.contextkit/standards/`
5. Start using AI commands

### Customization

- Modify standards files for your project
- Add project-specific templates
- Configure quality checks
- Set up Git hooks

## Usage

### AI Commands

- `@.contextkit/commands/analyze.md` - **Analyze and customize standards for your project**
- `@.contextkit/commands/create-component.md` - Create new component
- `@.contextkit/commands/create-feature.md` - Create new feature
- `@.contextkit/commands/run-tests.md` - Run test suite
- `@.contextkit/commands/quality-check.md` - Quality check
- `@.contextkit/commands/add-documentation.md` - Add documentation

### CLI Commands

#### Validation & Compliance
```bash
ck check              # Validate installation & policy compliance
ck check --strict     # Treat warnings as errors
ck check --verbose    # Show detailed information
```

#### Corrections Logging
```bash
ck note "AI didn't follow testing standards" --category "AI Behavior" --priority HIGH
ck note "Good behavior observed" --category "Preferences" --priority LOW
```

#### Workflow Orchestration
```bash
ck run create-component              # Run workflow
ck run create-component --interactive  # Interactive mode (pause between steps)
```

#### Registry & Versioning
```bash
# Publish your ContextKit configuration
ck publish --name @company/react-standards --version 1.0.0

# Pull shared configurations
ck pull @company/react-standards@1.0.0
ck pull @company/react-standards@latest --backup
```

#### Observability Dashboard
```bash
ck dashboard              # Start web dashboard (http://localhost:3001)
ck dashboard --port 8080  # Custom port
ck dashboard --no-server  # CLI metrics only
```

### Standards Reference

- `@.contextkit/standards/README.md` - Complete development standards
- `@.contextkit/standards/code-style.md` - Code style guide
- `@.contextkit/standards/testing.md` - Testing patterns
- `@.contextkit/standards/architecture.md` - Architecture patterns
- `@.contextkit/standards/ai-guidelines.md` - AI development guidelines

### Templates

- `.contextkit/templates/component.md` - Component/module template
- `.contextkit/templates/test.md` - Test file template
- `.contextkit/templates/story.md` - Story/demo template
- `.contextkit/templates/hook.md` - Hook/composable/helper template
- `.contextkit/templates/api.md` - API service/client template

## Examples

### Project Analysis (First Time Setup)

```
@.contextkit/commands/analyze.md
```

This will analyze your project and customize standards to match your tech stack.

### Creating a Component

```
Create a Button component with variant, size, and onClick props
```

### Adding Tests

```
Add comprehensive tests for the UserCard component
```

### Quality Check

```
Run quality checks on the current codebase
```

## Enterprise Features

### Policy Enforcement

Configure policies in `.contextkit/policies/policy.yml`:

```yaml
enforcement:
  testing:
    numbered_cases: warn  # off | warn | block
    coverage_threshold: 80
  code_style:
    typescript_strict: warn
```

Run `ck check` to validate compliance.

### Workflow Orchestration

Create structured workflows in `.contextkit/instructions/core/`:

```markdown
<process_flow>
  <step number="1" name="gather_input">
    ### Step 1: Gather Input
    [Instructions]
  </step>
</process_flow>
```

Run with: `ck run <workflow-name>`

### Registry & Sharing

Share standards across teams:

```bash
# Publish
ck publish --name @company/react-standards --version 1.0.0

# Pull
ck pull @company/react-standards@latest --backup
```

### Observability

Monitor standards health:

```bash
ck dashboard  # Web dashboard
ck dashboard --no-server  # CLI metrics
```

Dashboard shows:
- Standards freshness
- Corrections log statistics
- Policy compliance
- Product context status
