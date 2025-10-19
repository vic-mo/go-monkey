import { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Output from './components/Output';
import Toolbar from './components/Toolbar';
import Documentation from './components/Documentation';
import { wasmInstance } from './wasm/loader';
import './App.css';

const DEFAULT_CODE = `let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

let result = fibonacci(10);
puts("Fibonacci(10) =", result);

let arr = [1, 2, 3, 4, 5];
puts("Array:", arr);
puts("Length:", len(arr));
puts("First:", first(arr));
puts("Last:", last(arr));

result`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [wasmError, setWasmError] = useState(null);
  const [showDocs, setShowDocs] = useState(() => {
    const saved = localStorage.getItem('showDocs');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Initialize WASM on mount
  useEffect(() => {
    wasmInstance.init()
      .then(() => {
        setLoading(false);
        console.log('App ready!');
      })
      .catch(error => {
        setWasmError(error.message);
        setLoading(false);
      });
  }, []);

  const handleRun = (codeToRun = null) => {
    if (!wasmInstance.isReady()) {
      setOutput({
        success: false,
        runtimeError: 'WASM module not ready yet'
      });
      return;
    }

    setExecuting(true);
    setOutput(null);

    // Use the provided code or fall back to state
    const execCode = codeToRun !== null ? codeToRun : code;

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const result = wasmInstance.execute(execCode);
        setOutput(result);
      } catch (error) {
        setOutput({
          success: false,
          runtimeError: `Execution error: ${error.message}`
        });
      } finally {
        setExecuting(false);
      }
    }, 10);
  };

  const handleReset = () => {
    if (wasmInstance.isReady()) {
      wasmInstance.reset();
      setOutput(null);
      console.log('Interpreter state reset');
    }
  };

  const handleToggleDocs = () => {
    setShowDocs(prev => {
      const newValue = !prev;
      localStorage.setItem('showDocs', JSON.stringify(newValue));
      return newValue;
    });
  };

  const handleLoadExample = (exampleCode) => {
    // Decode any HTML entities that might have been encoded
    const decoded = exampleCode
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    console.log('Loading example - original:', exampleCode);
    console.log('Loading example - decoded:', decoded);
    console.log('Has < char:', decoded.includes('<'));
    console.log('Has &lt;:', decoded.includes('&lt;'));

    setCode(decoded);
    setOutput(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="monkey-logo">🐵</div>
          <h2>Loading Monkey Playground...</h2>
          <div className="loading-spinner"></div>
          <p>Initializing WebAssembly module...</p>
        </div>
      </div>
    );
  }

  if (wasmError) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load Monkey Playground</h2>
          <p className="error-message">{wasmError}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Toolbar
        onRun={handleRun}
        onReset={handleReset}
        executing={executing}
        showDocs={showDocs}
        onToggleDocs={handleToggleDocs}
      />

      <div className={`panels-container ${showDocs ? 'with-docs' : 'no-docs'}`}>
        {showDocs && (
          <div className="panel docs-panel">
            <div className="panel-content">
              <Documentation onLoadExample={handleLoadExample} />
            </div>
          </div>
        )}

        <div className="panel editor-panel">
          <div className="panel-header">
            <span className="panel-title">Editor</span>
            <span className="panel-hint">Cmd/Ctrl + Enter to run</span>
          </div>
          <div className="panel-content">
            <Editor
              value={code}
              onChange={setCode}
              errors={output?.parserErrors}
              onRun={handleRun}
            />
          </div>
        </div>

        <div className="panel output-panel-container">
          <div className="panel-header">
            <span className="panel-title">Output</span>
            {output?.success && (
              <span className="panel-badge success">Success</span>
            )}
            {output?.success === false && (
              <span className="panel-badge error">Error</span>
            )}
          </div>
          <div className="panel-content">
            <Output result={output} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
