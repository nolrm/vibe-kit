# GitHub Actions Workflows

This directory contains automated workflows for publishing Vibe Kit to npm.

## 📦 Available Workflows

### 1. `publish.yml` - Smart Auto-Publish (Recommended)
**Triggers:** When `package.json` is modified and pushed to main branch

**Features:**
- ✅ Only publishes if version doesn't exist on npm
- ✅ Runs tests before publishing
- ✅ Creates git tags automatically
- ✅ Prevents duplicate publishes

**Usage:**
```bash
# Update version in package.json
npm version patch  # or minor, major

# Commit and push
git add package.json
git commit -m "Bump version to 0.1.1"
git push origin main
```

### 2. `auto-publish.yml` - Simple Auto-Publish
**Triggers:** Every push to main branch

**Features:**
- ✅ Checks if version exists before publishing
- ✅ Runs tests before publishing
- ✅ Simple and straightforward

**Usage:**
```bash
# Update version in package.json
npm version patch

# Commit and push
git add package.json
git commit -m "Bump version to 0.1.1"
git push origin main
```

### 3. `publish-on-tag.yml` - Manual Tag Publishing
**Triggers:** When you push a version tag (e.g., `v0.1.0`)

**Features:**
- ✅ Manual control over when to publish
- ✅ Traditional git tag approach
- ✅ Runs tests before publishing

**Usage:**
```bash
# Update version in package.json
npm version patch

# Push the tag (this triggers the workflow)
git push origin --tags
```

## 🎯 Recommended Workflow

**Use `publish.yml`** for the best experience:

1. **Update version:** `npm version patch`
2. **Commit and push:** `git add package.json && git commit -m "Bump version" && git push origin main`
3. **GitHub Actions automatically:**
   - Runs tests
   - Checks if version exists
   - Publishes to npm (if new)
   - Creates git tag

## 🔧 Configuration

Make sure you have:
- ✅ `NPM_TOKEN` secret in GitHub repository settings
- ✅ npm package published initially (`npm publish --access public`)
- ✅ Repository is public (for unlimited GitHub Actions minutes)

## 📊 Workflow Comparison

| Workflow | Trigger | Control | Complexity | Best For |
|----------|---------|---------|------------|----------|
| `publish.yml` | package.json change | Automatic | Medium | **Recommended** |
| `auto-publish.yml` | Every push | Automatic | Low | Simple projects |
| `publish-on-tag.yml` | Git tags | Manual | Low | Traditional approach |

## 🚀 Getting Started

1. **Choose your workflow** (recommend `publish.yml`)
2. **Delete the others** you don't need
3. **Test it** by updating version in package.json
4. **Enjoy automated publishing!**

## 🎵 Happy Publishing!

Your Vibe Kit will automatically deploy to npm whenever you update the version! 🚀
