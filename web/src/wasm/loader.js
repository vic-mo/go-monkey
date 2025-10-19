/**
 * MonkeyWASM - Loader for the Monkey language WebAssembly module
 */
class MonkeyWASM {
  constructor() {
    this.ready = false;
    this.loading = false;
    this.error = null;
  }

  /**
   * Initialize the WASM module
   * @returns {Promise<void>}
   */
  async init() {
    if (this.ready) return;
    if (this.loading) {
      // Wait for existing load to complete
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.loading = true;

    try {
      // Load wasm_exec.js (Go's WASM runtime)
      await this.loadWasmExec();

      // Create Go instance
      const go = new window.Go();

      // Fetch and instantiate WASM module
      console.log('Loading Monkey WASM module...');
      const response = await fetch('/monkey.wasm');

      if (!response.ok) {
        throw new Error(`Failed to load WASM: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const result = await WebAssembly.instantiate(buffer, go.importObject);

      // Run the Go program (this makes the functions available globally)
      go.run(result.instance);

      // Wait a bit for the Go runtime to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify functions are available
      if (typeof window.monkeyExecute !== 'function') {
        throw new Error('WASM module loaded but monkeyExecute function not found');
      }

      this.ready = true;
      console.log('✓ Monkey WASM loaded successfully');
    } catch (error) {
      this.error = error;
      console.error('Failed to load Monkey WASM:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load the wasm_exec.js script
   * @returns {Promise<void>}
   */
  async loadWasmExec() {
    return new Promise((resolve, reject) => {
      if (window.Go) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = '/wasm_exec.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load wasm_exec.js'));
      document.head.appendChild(script);
    });
  }

  /**
   * Execute Monkey code
   * @param {string} code - The Monkey code to execute
   * @returns {Object} Execution result
   */
  execute(code) {
    if (!this.ready) {
      throw new Error('WASM not initialized. Call init() first.');
    }

    try {
      // Call the Go function exposed to JavaScript
      const resultJSON = window.monkeyExecute(code);
      const result = JSON.parse(resultJSON);
      return result;
    } catch (error) {
      return {
        success: false,
        runtimeError: `JavaScript error: ${error.message}`
      };
    }
  }

  /**
   * Reset the interpreter state (clear all variables, functions, etc.)
   */
  reset() {
    if (!this.ready) {
      throw new Error('WASM not initialized. Call init() first.');
    }

    window.monkeyReset();
    console.log('✓ Monkey interpreter state reset');
  }

  /**
   * Check if WASM is ready
   * @returns {boolean}
   */
  isReady() {
    return this.ready;
  }

  /**
   * Get loading state
   * @returns {boolean}
   */
  isLoading() {
    return this.loading;
  }

  /**
   * Get error if any occurred during initialization
   * @returns {Error|null}
   */
  getError() {
    return this.error;
  }
}

// Export a singleton instance
export const wasmInstance = new MonkeyWASM();
