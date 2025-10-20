import { useEffect, useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { configureMonkeyLanguage } from '../monaco/monkey-language';

export default function Editor({ value, onChange, errors, onRun }) {
  const editorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          // Get current editor value and run it directly
          const currentCode = editor.getValue();
          onChange(currentCode);
          onRun(currentCode);
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
          // Use 16px on mobile to prevent iOS zoom
          fontSize: isMobile ? 16 : 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          padding: { top: isMobile ? 8 : 10, bottom: isMobile ? 8 : 10 },
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          contextmenu: !isMobile, // Disable context menu on mobile
          formatOnPaste: true,
          formatOnType: true,
          // Better mobile support
          quickSuggestions: !isMobile, // Disable on mobile for better performance
          suggestOnTriggerCharacters: !isMobile,
          acceptSuggestionOnEnter: isMobile ? 'off' : 'on',
          folding: !isMobile, // Disable code folding on mobile
          glyphMargin: !isMobile, // Disable glyph margin on mobile
          lineDecorationsWidth: isMobile ? 5 : 10,
          lineNumbersMinChars: isMobile ? 3 : 5
        }}
      />
    </div>
  );
}
