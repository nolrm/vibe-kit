#!/bin/bash
# pre-commit.sh - Pre-commit hook for Vibe Kit

set -e

echo "🎵 Running Vibe Kit pre-commit checks..."

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

# Run tests
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "🧪 Running tests..."
    npm test -- --run
fi

echo "✅ All pre-commit checks passed!"
