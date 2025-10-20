export default function Toolbar({ onRun, onReset, executing, showDocs, onToggleDocs }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1 className="title">
          <span className="monkey-emoji">🐵</span>
          <span className="title-text">Monkey Playground</span>
        </h1>
      </div>

      <div className="toolbar-right">
        <button
          className={`btn btn-secondary ${showDocs ? 'active' : ''}`}
          onClick={onToggleDocs}
          title="Toggle documentation panel"
          aria-label="Toggle documentation"
        >
          📚 <span>Docs</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={onReset}
          disabled={executing}
          title="Reset interpreter state"
          aria-label="Reset interpreter"
        >
          🔄 <span>Reset</span>
        </button>

        <button
          className="btn btn-primary"
          onClick={onRun}
          disabled={executing}
          title="Run code (Cmd/Ctrl + Enter)"
          aria-label={executing ? "Running code" : "Run code"}
        >
          {executing ? (
            <>
              <span className="spinner"></span>
              <span>Running...</span>
            </>
          ) : (
            <>
              <span className="run-icon">▶</span>
              <span>Run</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
