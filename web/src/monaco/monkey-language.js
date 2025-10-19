/**
 * Monaco Editor language definition for Monkey
 */

export function configureMonkeyLanguage(monaco) {
  // Register the Monkey language
  monaco.languages.register({ id: 'monkey' });

  // Define syntax highlighting rules
  monaco.languages.setMonarchTokensProvider('monkey', {
    keywords: [
      'let', 'fn', 'if', 'else', 'return', 'true', 'false'
    ],

    builtins: [
      'len', 'first', 'last', 'rest', 'push', 'puts'
    ],

    operators: [
      '=', '>', '<', '!', '+', '-', '*', '/',
      '==', '!=', '<=', '>='
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    tokenizer: {
      root: [
        // Identifiers and keywords
        [/[a-z_$][\w$]*/, {
          cases: {
            '@keywords': 'keyword',
            '@builtins': 'type.identifier',
            '@default': 'identifier'
          }
        }],

        // Whitespace
        { include: '@whitespace' },

        // Numbers
        [/\d+/, 'number'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        // Delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // Delimiter
        [/[;,.]/, 'delimiter'],
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
      ],
    }
  });

  // Define auto-completion provider
  monaco.languages.registerCompletionItemProvider('monkey', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        // Keywords
        {
          label: 'let',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'let ${1:name} = ${2:value};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Variable declaration'
        },
        {
          label: 'fn',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'fn(${1:params}) {\n\t${2}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Function definition'
        },
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'if (${1:condition}) {\n\t${2}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If statement'
        },
        {
          label: 'if-else',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-else statement'
        },
        {
          label: 'return',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'return ${1};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Return statement'
        },

        // Built-in functions
        {
          label: 'puts',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'puts(${1});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Print values to output',
          detail: 'puts(value1, value2, ...)'
        },
        {
          label: 'len',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'len(${1})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Get length of array or string',
          detail: 'len(array|string) -> integer'
        },
        {
          label: 'first',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'first(${1})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Get first element of array',
          detail: 'first(array) -> element'
        },
        {
          label: 'last',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'last(${1})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Get last element of array',
          detail: 'last(array) -> element'
        },
        {
          label: 'rest',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'rest(${1})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Get array without first element',
          detail: 'rest(array) -> array'
        },
        {
          label: 'push',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'push(${1:array}, ${2:element})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Add element to end of array',
          detail: 'push(array, element) -> array'
        },
      ];

      return { suggestions };
    }
  });

  // Define custom theme
  monaco.editor.defineTheme('monkey-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: 'DCDCAA', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.escape', foreground: 'D7BA7D' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'identifier', foreground: '9CDCFE' },
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editorLineNumber.foreground': '#858585',
      'editorCursor.foreground': '#aeafad',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#3a3d41'
    }
  });
}
