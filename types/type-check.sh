#!/bin/bash
# type-check.sh - Type checking script for Vibe Kit

set -e

echo "🔒 Running Vibe Kit type check..."

# Check if TypeScript is available
if ! command -v tsc &> /dev/null; then
    echo "❌ TypeScript not found. Install with: npm install -g typescript"
    exit 1
fi

# Run type check
echo "📝 Checking TypeScript types..."
tsc --noEmit --project .vibe-kit/types/strict.tsconfig.json

echo "✅ Type check passed!"
