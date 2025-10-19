import { useState } from 'react';
import ExampleSnippet from './ExampleSnippet';
import { documentation } from '../data/documentation';

function Documentation({ onLoadExample }) {
  const [expandedSections, setExpandedSections] = useState({
    syntax: true,
    operators: false,
    dataTypes: false,
    builtins: true,
    examples: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="documentation">
      <div className="docs-header">
        <h2 className="docs-title">📚 Monkey Language</h2>
        <p className="docs-subtitle">Reference & Examples</p>
      </div>

      <div className="docs-content">
        {/* Syntax Section */}
        <section className="docs-section">
          <button
            className="docs-section-header"
            onClick={() => toggleSection('syntax')}
          >
            <span className="docs-chevron">{expandedSections.syntax ? '▼' : '▶'}</span>
            <h3>{documentation.syntax.title}</h3>
          </button>
          {expandedSections.syntax && (
            <div className="docs-section-content">
              {documentation.syntax.items.map((item, idx) => (
                <div key={idx} className="docs-item">
                  <h4 className="docs-item-title">{item.category}</h4>
                  <code className="docs-syntax">{item.syntax}</code>
                  <p className="docs-description">{item.description}</p>
                  <pre className="docs-example">{item.example}</pre>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Operators Section */}
        <section className="docs-section">
          <button
            className="docs-section-header"
            onClick={() => toggleSection('operators')}
          >
            <span className="docs-chevron">{expandedSections.operators ? '▼' : '▶'}</span>
            <h3>{documentation.operators.title}</h3>
          </button>
          {expandedSections.operators && (
            <div className="docs-section-content">
              {documentation.operators.items.map((item, idx) => (
                <div key={idx} className="docs-item">
                  <h4 className="docs-item-title">{item.category}</h4>
                  <code className="docs-syntax">{item.operators}</code>
                  <p className="docs-description">{item.description}</p>
                  <pre className="docs-example">{item.example}</pre>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Data Types Section */}
        <section className="docs-section">
          <button
            className="docs-section-header"
            onClick={() => toggleSection('dataTypes')}
          >
            <span className="docs-chevron">{expandedSections.dataTypes ? '▼' : '▶'}</span>
            <h3>{documentation.dataTypes.title}</h3>
          </button>
          {expandedSections.dataTypes && (
            <div className="docs-section-content">
              {documentation.dataTypes.items.map((item, idx) => (
                <div key={idx} className="docs-item">
                  <h4 className="docs-item-title">{item.type}</h4>
                  <p className="docs-description">{item.description}</p>
                  <pre className="docs-example">{item.example}</pre>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Built-ins Section */}
        <section className="docs-section">
          <button
            className="docs-section-header"
            onClick={() => toggleSection('builtins')}
          >
            <span className="docs-chevron">{expandedSections.builtins ? '▼' : '▶'}</span>
            <h3>{documentation.builtins.title}</h3>
          </button>
          {expandedSections.builtins && (
            <div className="docs-section-content">
              {documentation.builtins.functions.map((func, idx) => (
                <div key={idx} className="docs-item builtin-item">
                  <h4 className="docs-item-title">
                    <code className="builtin-name">{func.name}</code>
                  </h4>
                  <code className="docs-syntax">{func.signature}</code>
                  <p className="docs-description">{func.description}</p>
                  <div className="builtin-meta">
                    <span className="builtin-param"><strong>Params:</strong> {func.params}</span>
                    <span className="builtin-return"><strong>Returns:</strong> {func.returns}</span>
                  </div>
                  <pre className="docs-example">{func.example}</pre>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Examples Section */}
        <section className="docs-section">
          <button
            className="docs-section-header"
            onClick={() => toggleSection('examples')}
          >
            <span className="docs-chevron">{expandedSections.examples ? '▼' : '▶'}</span>
            <h3>{documentation.examples.title}</h3>
          </button>
          {expandedSections.examples && (
            <div className="docs-section-content">
              {documentation.examples.snippets.map((snippet, idx) => (
                <ExampleSnippet
                  key={idx}
                  title={snippet.title}
                  description={snippet.description}
                  code={snippet.code}
                  tags={snippet.tags}
                  onLoad={onLoadExample}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Documentation;
