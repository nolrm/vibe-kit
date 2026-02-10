#!/bin/bash
# pre-push.sh - Pre-push hook for ContextKit

set -e

echo "🎵 Running ContextKit pre-push checks..."

# Run type checking
if [ -f "package.json" ] && grep -q "typescript" package.json; then
    echo "🔒 Running TypeScript type check..."
    npx tsc --noEmit
fi

# Run linting
if [ -f "package.json" ] && grep -q "eslint" package.json; then
    echo "🧹 Running ESLint..."
    npx eslint . --ext .ts,.tsx,.js,.jsx
fi

# Run formatting check
if [ -f "package.json" ] && grep -q "prettier" package.json; then
    echo "✨ Checking code formatting..."
    npx prettier --check .
fi

# Run build
if [ -f "package.json" ] && grep -q "build" package.json; then
    echo "🏗️  Running build..."
    npm run build
fi

# Run full test suite
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "🧪 Running full test suite..."
    npm test -- --run --coverage
fi

# Run E2E tests if available
if [ -f "package.json" ] && grep -q "e2e" package.json; then
    echo "🎭 Running E2E tests..."
    npm run e2e
fi

echo "✅ All pre-push checks passed!"
