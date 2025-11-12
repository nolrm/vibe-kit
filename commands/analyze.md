# Analyze Project for Vibe Kit Customization

🎵 **Vibe Kit Project Analysis**

I'll analyze your project and customize the Vibe Kit standards to match your specific setup.

## What I'll Do:

### 🔍 **Project Analysis**
- **Scan project structure** and identify framework/technology stack
- **Analyze package.json** dependencies and scripts
- **Detect existing configurations** (ESLint, Prettier, TypeScript, etc.)
- **Identify code patterns** and conventions already in use
- **Check testing setup** and tools
- **Review deployment configuration** and CI/CD setup
- **Analyze documentation patterns** and existing standards

### 🎯 **Customization Areas**
- **Code Style Guidelines** - Tailored to your framework and tools
- **Testing Patterns** - Based on your testing setup
- **Architecture Standards** - Specific to your project type
- **Component Conventions** - Matching your existing patterns
- **Import/Export Standards** - Following your current style
- **Error Handling Patterns** - Based on your current approach
- **Performance Guidelines** - Framework-specific optimizations
- **Security Standards** - Based on your project requirements

### 📝 **Files I'll Update**

**For single-package projects:**
- `.vibe-kit/standards/code-style.md` - Customized coding standards
- `.vibe-kit/standards/testing.md` - Project-specific testing guidelines
- `.vibe-kit/standards/architecture.md` - Framework-specific architecture patterns
- `.vibe-kit/standards/README.md` - Updated overview with your project details

**For monorepos (when analyzing both frontend + backend):**
- `.vibe-kit/standards/frontend/code-style.md` - Frontend coding standards
- `.vibe-kit/standards/frontend/testing.md` - Frontend testing guidelines
- `.vibe-kit/standards/backend/code-style.md` - Backend coding standards
- `.vibe-kit/standards/backend/testing.md` - Backend testing guidelines
- Shared standards in `.vibe-kit/standards/` for common patterns

## Analysis Process:

1. **📁 Project Structure Scan**
   - Framework detection (React, Vue, Angular, Next.js, etc.)
   - Build tool identification (Vite, Webpack, Rollup, etc.)
   - Package manager detection (npm, yarn, pnpm)
   - Monorepo vs single-package structure
   - **Monorepo detection**: Automatically detects Turborepo, Nx, Lerna, and workspace structures
   - **Package classification**: Identifies frontend vs backend packages
   - **Scope selection**: For monorepos, you'll be prompted to analyze frontend, backend, or both
   - Directory organization patterns

2. **📦 Dependencies Analysis**
   - UI libraries (Material-UI, Tailwind, Chakra, Ant Design, etc.)
   - State management (Redux, Zustand, Context, MobX, etc.)
   - Testing frameworks (Jest, Vitest, Cypress, Playwright, etc.)
   - Styling solutions (CSS Modules, Styled Components, Emotion, etc.)
   - Utility libraries (Lodash, Ramda, date-fns, etc.)
   - API clients (Axios, Fetch, SWR, React Query, etc.)

3. **⚙️ Configuration Review**
   - ESLint rules and configuration
   - Prettier settings and formatting rules
   - TypeScript configuration and strictness
   - Build and bundling configuration
   - Environment variables and secrets management
   - Docker and containerization setup

4. **🎨 Code Pattern Detection**
   - Import/export patterns and module structure
   - Component structure and composition patterns
   - File organization and naming conventions
   - Function and variable naming styles
   - Error handling and validation patterns
   - API integration patterns
   - State management patterns

5. **🧪 Testing & Quality Analysis**
   - Testing strategy and coverage approach
   - Mock and stub patterns
   - Test file organization
   - E2E vs unit testing balance
   - Code quality tools and metrics
   - Performance monitoring setup

6. **🚀 Deployment & DevOps**
   - CI/CD pipeline configuration
   - Environment management
   - Build and deployment strategies
   - Monitoring and logging setup
   - Security scanning and compliance

7. **📚 Documentation Patterns**
   - README structure and content
   - API documentation approach
   - Code commenting standards
   - Changelog and versioning practices
   - Contributing guidelines

## Ready to Start?

I'll analyze your project and provide customized recommendations. The analysis will be intelligent and respect your existing patterns while suggesting improvements based on best practices.

**Let me know when you're ready to begin the analysis!** 🚀

---

## ⚠️ After Generation - IMPORTANT: Manual Review Required!

After generating content for your skeleton files, **YOU MUST:**

### 🔍 Step 1: Review Generated Content
Review each generated file in `.vibe-kit/standards/`:
- ✅ Check that content matches your project
- ✅ Verify frameworks and tools are correct
- ✅ Ensure patterns align with your codebase
- ⚠️  AI-generated content is a starting point, NOT final

### ✏️ Step 2: Edit & Customize
- **Add missing details** specific to your project
- **Remove irrelevant content** that doesn't apply
- **Adjust formatting** to match your preferences
- **Add project-specific rules** not captured by AI

### 🎯 Step 3: Fine-tune to Perfection
The AI provides a foundation, but:
- YOU know your project's nuances best
- YOU understand your team's conventions
- YOU are the expert on what fits

### 📝 Step 4: Commit to Your Repo
Once reviewed and customized:
- ✅ Commit these files to your repository
- ✅ They're now PART OF YOUR PROJECT
- ✅ Keep them updated as you grow

### 📋 Files to Review:
- `code-style.md` - Verify coding conventions
- `testing.md` - Check test patterns match your approach
- `architecture.md` - Ensure structure matches reality
- `ai-guidelines.md` - Add project-specific AI rules
- `workflows.md` - Adjust to your team processes

### 🌱 Living Documentation
These standards should evolve with your project:
- Update when patterns change
- Modify when adopting new tools
- Refine based on team decisions
- Never let them become stale

**Remember:** Generated content is a starting point. Your manual review and editing is what makes it truly valuable.
