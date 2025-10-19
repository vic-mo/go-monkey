#!/bin/bash

set -e

echo "Building Monkey WASM..."

# Find Go binary
if ! command -v go &> /dev/null; then
    echo "Error: Go is not installed or not in PATH"
    exit 1
fi

# Build WASM binary
GOOS=js GOARCH=wasm go build -o web/public/monkey.wasm ./wasm/main.go

# Copy Go's WASM exec helper JavaScript
GOROOT_PATH=$(go env GOROOT)
# Try new location first (Go 1.21+), fall back to old location
if [ -f "$GOROOT_PATH/lib/wasm/wasm_exec.js" ]; then
    cp "$GOROOT_PATH/lib/wasm/wasm_exec.js" web/public/
else
    cp "$GOROOT_PATH/misc/wasm/wasm_exec.js" web/public/
fi

# Get file sizes
WASM_SIZE=$(du -h web/public/monkey.wasm | cut -f1)
echo "✓ WASM built successfully"
echo "  Output: web/public/monkey.wasm"
echo "  Size: $WASM_SIZE"

# Optional: compress with gzip for comparison
if command -v gzip &> /dev/null; then
    gzip -f -k web/public/monkey.wasm
    GZIP_SIZE=$(du -h web/public/monkey.wasm.gz | cut -f1)
    echo "  Gzipped: $GZIP_SIZE"
fi

echo ""
echo "Next steps:"
echo "  cd web"
echo "  npm install"
echo "  npm run dev"
