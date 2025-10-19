export default function Toolbar({ onRun, onReset, executing, showDocs, onToggleDocs }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1 className="title">
          <span className="monkey-emoji">🐵</span>
          Monkey Playground
        </h1>
      </div>

      <div className="toolbar-right">
        <button
          className={`btn btn-secondary ${showDocs ? 'active' : ''}`}
          onClick={onToggleDocs}
          title="Toggle documentation panel"
        >
          📚 Docs
        </button>
        <button
          className="btn btn-secondary"
          onClick={onReset}
          disabled={executing}
          title="Reset interpreter state"
        >
          Reset
        </button>

        <button
          className="btn btn-primary"
          onClick={onRun}
          disabled={executing}
          title="Run code (Cmd/Ctrl + Enter)"
        >
          {executing ? (
            <>
              <span className="spinner"></span>
              Running...
            </>
          ) : (
            <>
              <span className="run-icon">▶</span>
              Run
            </>
          )}
        </button>
      </div>
    </div>
  );
}
