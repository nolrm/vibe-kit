# Getting Started

## Installation

### Quick Install

```bash
curl -sSL https://raw.githubusercontent.com/nolrm/vibe-kit/main/install-fallback.sh | bash
```

### Manual Install

```bash
git clone https://github.com/nolrm/vibe-kit.git
cd vibe-kit
bash install.sh
```

## Configuration

### Project Setup

1. Run the installation script
2. **Run project analysis** (recommended): `@.vibe-kit/commands/analyze.md`
3. Customize `.vibe-kit/config.yml`
4. Review standards in `.vibe-kit/standards/`
5. Start using AI commands

### Customization

- Modify standards files for your project
- Add project-specific templates
- Configure quality checks
- Set up Git hooks

## Usage

### AI Commands

- `@.vibe-kit/commands/analyze.md` - **Analyze and customize standards for your project**
- `@.vibe-kit/commands/create-component.md` - Create new component
- `@.vibe-kit/commands/create-feature.md` - Create new feature
- `@.vibe-kit/commands/run-tests.md` - Run test suite
- `@.vibe-kit/commands/quality-check.md` - Quality check
- `@.vibe-kit/commands/add-documentation.md` - Add documentation

### Standards Reference

- `@.vibe-kit/standards/README.md` - Complete development standards
- `@.vibe-kit/standards/code-style.md` - Code style guide
- `@.vibe-kit/standards/testing.md` - Testing patterns
- `@.vibe-kit/standards/architecture.md` - Architecture patterns
- `@.vibe-kit/standards/ai-guidelines.md` - AI development guidelines

### Templates

- `.vibe-kit/templates/component.tsx` - React component template
- `.vibe-kit/templates/test.tsx` - Test file template
- `.vibe-kit/templates/story.tsx` - Storybook story template
- `.vibe-kit/templates/hook.ts` - Custom hook template
- `.vibe-kit/templates/api.ts` - API service template

## Examples

### Project Analysis (First Time Setup)

```
@.vibe-kit/commands/analyze.md
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
