#!/bin/bash
# type-check.sh - Type checking script for ContextKit

set -e

echo "🔒 Running ContextKit type check..."

# Check if TypeScript is available
if ! command -v tsc &> /dev/null; then
    echo "❌ TypeScript not found. Install with: npm install -g typescript"
    exit 1
fi

# Run type check
echo "📝 Checking TypeScript types..."
tsc --noEmit --project .contextkit/types/strict.tsconfig.json

echo "✅ Type check passed!"
