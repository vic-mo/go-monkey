export default function Output({ result }) {
  if (!result) {
    return (
      <div className="output-panel empty">
        <div className="output-placeholder">
          <div className="placeholder-icon">▶</div>
          <p>Run your Monkey code to see the output</p>
          <p className="hint">Press <kbd>Cmd/Ctrl + Enter</kbd> or click Run</p>
        </div>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="output-panel error">
        <div className="error-header">
          <span className="error-icon">⚠</span>
          <span>Execution Failed</span>
        </div>

        {result.parserErrors && result.parserErrors.length > 0 && (
          <div className="error-section">
            <h3>Parser Errors:</h3>
            <div className="error-list">
              {result.parserErrors.map((err, i) => (
                <div key={i} className="error-line">
                  <span className="error-bullet">•</span>
                  <span>{err}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.compilerError && (
          <div className="error-section">
            <h3>Compiler Error:</h3>
            <div className="error-line">
              <span className="error-bullet">•</span>
              <span>{result.compilerError}</span>
            </div>
          </div>
        )}

        {result.runtimeError && (
          <div className="error-section">
            <h3>Runtime Error:</h3>
            <div className="error-line">
              <span className="error-bullet">•</span>
              <span>{result.runtimeError}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="output-panel success">
      <div className="output-header">
        <span className="success-icon">✓</span>
        <span>Output</span>
      </div>
      <pre className="output-content">{result.result || '(no output)'}</pre>
    </div>
  );
}
