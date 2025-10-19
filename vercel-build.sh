#!/bin/bash

set -e

# Save current directory
PROJECT_DIR=$PWD

echo "Installing Go for WASM build..."

# Install Go 1.21.5 (lightweight and compatible)
GO_VERSION="1.21.5"
GO_TARBALL="go${GO_VERSION}.linux-amd64.tar.gz"
GO_URL="https://go.dev/dl/${GO_TARBALL}"

# Download and extract Go to /tmp
cd /tmp
curl -sL ${GO_URL} -o ${GO_TARBALL}
tar -xzf ${GO_TARBALL}
export PATH="/tmp/go/bin:$PATH"
export GOROOT="/tmp/go"

# Verify Go installation
go version

# Navigate back to project
cd "$PROJECT_DIR"

# Build WASM
echo "Building WASM..."
chmod +x build-wasm.sh
./build-wasm.sh

# Build frontend
echo "Building frontend..."
cd web
npm run build
