import { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { configureMonkeyLanguage } from '../monaco/monkey-language';

export default function Editor({ value, onChange, errors, onRun }) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // Configure Monkey language syntax highlighting
    configureMonkeyLanguage(monaco);

    // Set keyboard shortcut: Cmd/Ctrl + Enter to run
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
      ],
      run: () => {
        if (onRun) {
          // Get current editor value to ensure we run the latest code
          const currentCode = editor.getValue();
          onChange(currentCode);
          // Small delay to ensure state updates
          setTimeout(() => onRun(), 0);
        }
      }
    });

    // Focus the editor
    editor.focus();
  }

  useEffect(() => {
    if (!editorRef.current || !errors || errors.length === 0) {
      // Clear markers if no errors
      if (editorRef.current) {
        const monaco = window.monaco;
        const model = editorRef.current.getModel();
        if (monaco && model) {
          monaco.editor.setModelMarkers(model, 'monkey', []);
        }
      }
      return;
    }

    const monaco = window.monaco;
    const model = editorRef.current.getModel();

    if (!monaco || !model) return;

    // Convert parser errors to Monaco markers
    const markers = errors.map((error, index) => {
      // Try to extract line information from error message if available
      // Monkey parser errors might not include line numbers, so we'll highlight line 1
      return {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: model.getLineMaxColumn(1),
        message: error,
        severity: monaco.MarkerSeverity.Error
      };
    });

    monaco.editor.setModelMarkers(model, 'monkey', markers);
  }, [errors]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MonacoEditor
        height="100%"
        defaultLanguage="monkey"
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="monkey-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          padding: { top: 10, bottom: 10 },
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          contextmenu: true,
          formatOnPaste: true,
          formatOnType: true
        }}
      />
    </div>
  );
}
