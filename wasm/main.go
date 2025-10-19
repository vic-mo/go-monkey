//go:build js && wasm
// +build js,wasm

package main

import (
	"bytes"
	"encoding/json"
	"monkey/compiler"
	"monkey/lexer"
	"monkey/object"
	"monkey/parser"
	"monkey/vm"
	"syscall/js"
)

// Global state for REPL-like behavior (persistent between calls)
var (
	constants   []object.Object
	globals     []object.Object
	symbolTable *compiler.SymbolTable
	outputBuffer bytes.Buffer
)

// ExecutionResult represents the result of executing Monkey code
type ExecutionResult struct {
	Success       bool     `json:"success"`
	Result        string   `json:"result,omitempty"`
	ParserErrors  []string `json:"parserErrors,omitempty"`
	CompilerError string   `json:"compilerError,omitempty"`
	RuntimeError  string   `json:"runtimeError,omitempty"`
}

func initState() {
	globals = make([]object.Object, vm.GlobalsSize)
	constants = []object.Object{}
	symbolTable = compiler.NewSymbolTable()

	// Define built-in functions
	for i, v := range object.Builtins {
		symbolTable.DefineBuiltin(i, v.Name)
	}

	// Override puts to use our output buffer
	setupCustomBuiltins()
}

// setupCustomBuiltins replaces the puts builtin with a custom version
// that writes to our output buffer instead of stdout
func setupCustomBuiltins() {
	for i, b := range object.Builtins {
		if b.Name == "puts" {
			object.Builtins[i].Builtin = &object.Builtin{
				Fn: func(args ...object.Object) object.Object {
					for _, arg := range args {
						outputBuffer.WriteString(arg.Inspect())
						outputBuffer.WriteString("\n")
					}
					return nil
				},
			}
		}
	}
}

// execute runs the Monkey code and returns the result
func execute(code string) ExecutionResult {
	// Reset output buffer for each execution
	outputBuffer.Reset()

	// Lexing and Parsing
	l := lexer.New(code)
	p := parser.New(l)
	program := p.ParseProgram()

	if len(p.Errors()) != 0 {
		return ExecutionResult{
			Success:      false,
			ParserErrors: p.Errors(),
		}
	}

	// Compiling
	comp := compiler.NewWithState(symbolTable, constants)
	err := comp.Compile(program)
	if err != nil {
		return ExecutionResult{
			Success:       false,
			CompilerError: err.Error(),
		}
	}

	// Update constants (persist for next call)
	bytecode := comp.Bytecode()
	constants = bytecode.Constants

	// Executing
	machine := vm.NewWithGlobalsStore(bytecode, globals)
	err = machine.Run()
	if err != nil {
		return ExecutionResult{
			Success:      false,
			RuntimeError: err.Error(),
		}
	}

	// Get the result
	lastPopped := machine.LastPoppedStackElem()
	result := ""

	// Include puts output if any
	if outputBuffer.Len() > 0 {
		result = outputBuffer.String()
	}

	// Add the last expression value if it's not null
	if lastPopped != nil {
		inspected := lastPopped.Inspect()
		if inspected != "null" {
			if result != "" {
				result += inspected
			} else {
				result = inspected
			}
		}
	}

	return ExecutionResult{
		Success: true,
		Result:  result,
	}
}

// executeCode is the JavaScript-callable function for executing Monkey code
func executeCode(this js.Value, args []js.Value) interface{} {
	if len(args) != 1 {
		return js.ValueOf(`{"success":false,"runtimeError":"Invalid arguments"}`)
	}

	code := args[0].String()
	result := execute(code)

	// Convert to JSON
	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return js.ValueOf(`{"success":false,"runtimeError":"JSON serialization error"}`)
	}

	return js.ValueOf(string(jsonBytes))
}

// resetState clears the interpreter state (variables, functions, etc.)
func resetState(this js.Value, args []js.Value) interface{} {
	initState()
	return nil
}

func main() {
	// Initialize state
	initState()

	// Create a channel to keep the program running
	c := make(chan struct{})

	// Register JavaScript functions
	js.Global().Set("monkeyExecute", js.FuncOf(executeCode))
	js.Global().Set("monkeyReset", js.FuncOf(resetState))

	// Signal that WASM is ready
	js.Global().Call("postMessage", js.ValueOf(map[string]interface{}{
		"type": "wasm-ready",
	}))

	// Keep the program alive
	<-c
}
