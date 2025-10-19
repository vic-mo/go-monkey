# Monkey Playground

A WebAssembly-powered browser-based playground for the Monkey programming language.

## Features

- 🚀 **Pure WASM** - Runs entirely in the browser, no server needed
- 🎨 **Monaco Editor** - VS Code's editor with full syntax highlighting
- ⚡ **Fast** - Instant code execution with no network latency
- 🎯 **Smart** - Auto-completion, syntax highlighting, error markers
- 💾 **Stateful** - Maintains variables and functions between executions
- 📦 **Offline-ready** - Works without internet connection

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Go 1.21+ (for building WASM)

### Installation

```bash
# Install dependencies
npm install

# Build WASM module
npm run build:wasm

# Start development server
npm run dev
```

The playground will be available at `http://localhost:3000`

### Building for Production

```bash
# Build everything (WASM + frontend)
npm run build:all

# Preview production build
npm run preview
```

The `dist/` folder can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## Project Structure

```
web/
├── public/              # Static assets
│   ├── monkey.wasm      # Compiled WASM binary (generated)
│   └── wasm_exec.js     # Go WASM runtime (generated)
├── src/
│   ├── components/      # React components
│   │   ├── Editor.jsx
│   │   ├── Output.jsx
│   │   └── Toolbar.jsx
│   ├── monaco/          # Monaco language definitions
│   │   └── monkey-language.js
│   ├── wasm/            # WASM loader
│   │   └── loader.js
│   ├── App.jsx          # Main app component
│   ├── App.css          # Styles
│   └── main.jsx         # Entry point
├── package.json
└── vite.config.js
```

## Usage

### Running Code

- Click the **Run** button or press `Cmd/Ctrl + Enter`
- Use **Reset** to clear interpreter state (variables, functions)

### Example Code

```monkey
// Fibonacci function
let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

fibonacci(10)  // Returns: 55

// Arrays
let arr = [1, 2, 3, 4, 5];
puts("Length:", len(arr));
puts("First:", first(arr));
puts("Last:", last(arr));

// Hash maps
let person = {"name": "Alice", "age": 30};
person["name"]  // Returns: "Alice"
```

## Built-in Functions

- `puts(...)` - Print values to output
- `len(array|string)` - Get length
- `first(array)` - Get first element
- `last(array)` - Get last element
- `rest(array)` - Get array without first element
- `push(array, element)` - Add element to array

## Development

### WASM Module

The WASM module is in `../wasm/main.go`. After making changes:

```bash
npm run build:wasm
```

### Frontend

Vite provides hot module reloading. Just save your changes and the browser will update automatically.

## Deployment

### Static Hosting

Deploy the `dist/` folder to:
- **Netlify**: Drag & drop or connect to Git
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Copy to `gh-pages` branch
- **Cloudflare Pages**: Connect to repository

### Headers Required

For WASM to work, you need these headers:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Most modern static hosts set these automatically for WASM files.

## Troubleshooting

### WASM not loading

1. Check browser console for errors
2. Ensure `monkey.wasm` and `wasm_exec.js` are in `public/`
3. Rebuild WASM: `npm run build:wasm`

### Go command not found

Add Go to your PATH:
```bash
# For macOS/Linux, add to ~/.zshrc or ~/.bashrc
export PATH=$PATH:/usr/local/go/bin
```

## License

Same as the Monkey interpreter
