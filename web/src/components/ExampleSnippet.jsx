import { useState } from 'react';

function ExampleSnippet({ title, description, code, tags, onLoad }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="example-snippet">
      <div className="example-header" onClick={() => setExpanded(!expanded)}>
        <div className="example-title-group">
          <span className="example-chevron">{expanded ? '▼' : '▶'}</span>
          <h4 className="example-title">{title}</h4>
        </div>
        <button
          className="example-load-btn"
          onClick={(e) => {
            e.stopPropagation();
            onLoad(code);
          }}
          title="Load into editor"
        >
          ↗ Load
        </button>
      </div>

      {expanded && (
        <div className="example-body">
          <p className="example-description">{description}</p>
          <pre className="example-code">{code}</pre>
          {tags && tags.length > 0 && (
            <div className="example-tags">
              {tags.map((tag, idx) => (
                <span key={idx} className="example-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExampleSnippet;
