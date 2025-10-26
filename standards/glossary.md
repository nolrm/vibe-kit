# Project Glossary

> **This glossary provides shortcut keywords for AI development**
> Customize these shortcuts for YOUR specific project during analysis

## Quick Reference

Use these shortcuts when prompting AI:
- **Technical terms** → For code implementation patterns
- **Business terms** → For feature requirements and domain concepts

---

# Technical Glossary

## Developer Terms

These are shortcuts for technical implementation. Customize during analysis to match your tech stack.

### Components (Customize for Your Project)

**Button** (`@btn`)
- **Component**: Primary UI button
- **Location**: `@/components/ui/Button`
- **Usage**: "Create @btn for customer login"

**Modal** (`@modal`)
- **Component**: Dialog/modal component
- **Location**: `@/components/ui/Modal`
- **Usage**: "Add @modal to admin dashboard"

**Card** (`@card`)
- **Component**: Content card wrapper
- **Location**: `@/components/ui/Card`
- **Usage**: "Display data in @card"

### Patterns

**Hook** (`@hook`)
- **Pattern**: Custom React hook
- **Usage**: "Create @hook for data fetching"
- **Template**: `.vibe-kit/templates/hook.ts`

**Service** (`@service`)
- **Pattern**: API service layer
- **Usage**: "Create @service for user API"
- **Template**: `.vibe-kit/templates/api.ts`

**Component** (`@component`)
- **Pattern**: React component
- **Usage**: "Create @component for orders"
- **Template**: `.vibe-kit/templates/component.tsx`

### Architecture

**API Gateway** (`api`)
- **Service**: Main API entry point
- **Location**: `/apps/api-gateway` or `/services/api`
- **Usage**: "Add endpoint to api"

**Auth Service** (`auth`)
- **Service**: Authentication service
- **Location**: `/apps/auth-service` or `/services/auth`
- **Usage**: "Update auth logic"

**Worker** (`worker`)
- **Service**: Background job processor
- **Location**: `/apps/worker-service` or `/services/worker`
- **Usage**: "Add worker task"

---

# Business Glossary

## Product Terms

These shortcuts map to YOUR business domain and will be automatically customized during analysis.

### Domain Entities (Auto-Discovered from Your Code)

**Customer** (`customer`)
- **Type**: End user entity
- **App**: Auto-detected from your monorepo
- **Usage**: "Add feature to customer app"

**Admin** (`admin`)
- **Type**: Admin user
- **App**: Auto-detected from your monorepo
- **Usage**: "Create admin dashboard page"

**Order** (`@order`)
- **Type**: Business transaction
- **Context**: Auto-detected from your domain models
- **Usage**: "Create @order list"

**Invoice** (`@invoice`)
- **Type**: Payment document
- **Context**: Auto-detected from your domain models
- **Usage**: "Generate @invoice PDF"

### Business Acronyms (Auto-Discovered)

**AR** (`@ar`)
- **Meaning**: Annual Return (or your project-specific meaning)
- **Context**: Auto-discovered from comments/docs
- **Usage**: "Generate @ar report"

**FY** (`@fy`)
- **Meaning**: Financial Year
- **Pattern**: FY2023, FY2024
- **Usage**: "Filter by @fy 2024"

### Business Workflows (Auto-Discovered)

**Onboarding** (`onboarding`)
- **Process**: New user registration flow
- **Apps**: Auto-detected workflow
- **Usage**: "Create onboarding flow"

**AR Filing** (`ar-filing`)
- **Process**: Annual compliance filing
- **Apps**: Auto-detected workflow
- **Usage**: "Implement ar-filing process"

---

## How to Customize This Glossary

### Option 1: Auto-Discovery (Recommended)

Run the analyze command to automatically populate this glossary with YOUR project specifics:

```
@.vibe-kit/commands/analyze.md
```

The analyze command will:
- Detect your monorepo apps and create shortcuts
- Extract business terms from your data models
- Find acronyms in your code comments and documentation
- Map your workflows from your code structure
- Generate custom entries for YOUR project

### Option 2: Manual Customization

Edit this file directly and add your project-specific shortcuts:

```markdown
### YOUR Project Terms

**Product** (`@product`)
- **Type**: Your domain entity
- **Context**: Your business meaning
- **Usage**: "List all @product with filters"
```

---

## Quick Reference Summary

### Technical Shortcuts
- `@btn` → Button component
- `@modal` → Modal component
- `@hook` → Custom hook pattern
- `@service` → API service
- `api` → API gateway app
- `auth` → Auth service

### Business Shortcuts (Auto-Customized)
- `customer` → Customer app (your specific app)
- `admin` → Admin app (your specific app)
- `@order` → Order entity (your domain)
- `@ar` → Business acronym (your context)

---

## Example Usage

### Technical Context
```
"Create @btn for customer login"
→ Creates Button component in customer app

"Add @modal to admin for user details"
→ Adds modal dialog to admin app
```

### Business Context
```
"Create customer onboarding flow"
→ Implements signup process for customer app

"Generate AR report for admin"
→ Creates annual return report in admin dashboard
```

---

## Next Steps

1. **Run Analysis**: Use `@.vibe-kit/commands/analyze.md` to auto-populate
2. **Customize**: Edit this file for project-specific entries
3. **Use**: Reference this glossary in your AI prompts
4. **Evolve**: Update as your project grows

