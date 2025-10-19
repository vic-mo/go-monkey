# Monkey WebAssembly Playground

A browser-based playground for the Monkey programming language, powered by WebAssembly.

## Architecture

This implementation uses **Option 2: WebAssembly** from the design plan:

```
┌─────────────────────────────────────────┐
│           Browser (Frontend)            │
│  ┌───────────────────────────────────┐  │
│  │   React + Monaco Editor + Vite    │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │      WASM Loader (loader.js)      │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │    Go WASM (monkey.wasm)          │  │
│  │  - Lexer, Parser, Compiler, VM    │  │
│  │  - All logic runs client-side     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Key Components

1. **WASM Module** (`wasm/main.go`)
   - Exposes `monkeyExecute(code)` and `monkeyReset()` to JavaScript
   - Maintains interpreter state between calls
   - Captures output from `puts()` builtin

2. **Frontend** (`web/`)
   - React app with Monaco Editor
   - WASM loader handles initialization
   - Real-time syntax highlighting and error display

3. **Build System** (`build-wasm.sh`)
   - Compiles Go to WASM
   - Copies runtime helper files
   - Shows bundle sizes

## Quick Start

```bash
# 1. Build WASM module
./build-wasm.sh

# 2. Install frontend dependencies
cd web
npm install

# 3. Start dev server
npm run dev
```

Visit `http://localhost:3000` to use the playground!

## File Structure

```
go-monkey/
├── wasm/
│   └── main.go              # WASM entry point & JS bridge
├── web/
│   ├── public/
│   │   ├── monkey.wasm      # Compiled WASM (3.2MB, 920KB gzipped)
│   │   └── wasm_exec.js     # Go WASM runtime
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor.jsx   # Monaco editor wrapper
│   │   │   ├── Output.jsx   # Result/error display
│   │   │   └── Toolbar.jsx  # Run/Reset buttons
│   │   ├── monaco/
│   │   │   └── monkey-language.js  # Syntax highlighting
│   │   ├── wasm/
│   │   │   └── loader.js    # WASM initialization
│   │   ├── App.jsx          # Main app
│   │   ├── App.css          # Styles
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── build-wasm.sh            # WASM build script
└── [existing Go packages]   # lexer, parser, compiler, vm, etc.
```

## Features

### ✅ Implemented

- [x] Full Monkey language support
- [x] Monaco Editor with syntax highlighting
- [x] Auto-completion for keywords and built-ins
- [x] Real-time error display with markers
- [x] Stateful REPL (variables persist)
- [x] Custom dark theme
- [x] Keyboard shortcut (Cmd/Ctrl + Enter to run)
- [x] Loading screen with progress
- [x] Error handling and display
- [x] Reset functionality
- [x] Responsive layout

### 🚀 Possible Enhancements

- [ ] Example code snippets/gallery
- [ ] Share code via URL (encode in hash)
- [ ] Export to file
- [ ] AST visualization
- [ ] Bytecode inspector
- [ ] Step-through debugger
- [ ] Performance metrics
- [ ] Syntax error line highlighting
- [ ] Code formatting
- [ ] Themes switcher
- [ ] Mobile optimizations

## Development

### Building WASM

```bash
./build-wasm.sh
```

Output:
- `web/public/monkey.wasm` (3.2MB uncompressed, 920KB gzipped)
- `web/public/wasm_exec.js` (Go WASM runtime helper)

### Frontend Development

```bash
cd web
npm run dev      # Start dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build
```

### Making Changes

**To modify interpreter logic:**
1. Edit files in `wasm/main.go` or core packages (`lexer/`, `parser/`, etc.)
2. Run `./build-wasm.sh`
3. Reload browser (WASM will be cached, may need hard refresh)

**To modify UI:**
1. Edit files in `web/src/`
2. Vite will auto-reload with HMR

## Deployment

### Build for Production

```bash
cd web
npm run build:all  # Builds WASM + frontend
```

### Deploy

The `web/dist/` folder contains everything needed. Deploy to:

- **Netlify**: `netlify deploy --dir=dist --prod`
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Copy `dist/` to `gh-pages` branch
- **Any static host**: Upload `dist/` folder

### Required Headers

Most hosts auto-configure these, but if WASM doesn't load:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These are already configured in `vite.config.js` for local dev.

## How It Works

### JavaScript ↔ WASM Communication

**JavaScript calls Go:**
```javascript
// Execute Monkey code
const resultJSON = window.monkeyExecute(code);
const result = JSON.parse(resultJSON);
```

**Go exposes functions:**
```go
js.Global().Set("monkeyExecute", js.FuncOf(executeCode))
js.Global().Set("monkeyReset", js.FuncOf(resetState))
```

### State Management

The WASM module maintains:
- Global variables
- Symbol table
- Constants pool
- Built-in function definitions

Call `monkeyReset()` to clear state.

### Output Capture

The `puts()` built-in is overridden to write to a buffer instead of stdout:

```go
object.Builtins[i].Builtin = &object.Builtin{
    Fn: func(args ...object.Object) object.Object {
        for _, arg := range args {
            outputBuffer.WriteString(arg.Inspect())
            outputBuffer.WriteString("\n")
        }
        return nil
    },
}
```

## Performance

- **WASM Size**: 3.2MB (920KB gzipped)
- **Load Time**: ~1-2s on first visit
- **Execution**: Near-native speed
- **Cached**: Instant subsequent loads

## Browser Support

Requires browsers with WebAssembly support:
- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

## Troubleshooting

### "Go command not found"

Add Go to PATH:
```bash
export PATH=$PATH:/usr/local/go/bin
```

### WASM fails to load

1. Check browser console
2. Verify files exist: `ls web/public/monkey.wasm`
3. Rebuild: `./build-wasm.sh`

### "WASM module not ready"

Wait for initialization. Check Network tab for `monkey.wasm` download.

### Changes not reflecting

Hard refresh: `Cmd/Ctrl + Shift + R`

## Credits

Based on the Monkey language from "Writing An Interpreter In Go" and "Writing A Compiler In Go" by Thorsten Ball.

WebAssembly playground implementation using Go 1.25+ WASM support.
