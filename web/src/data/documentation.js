export const documentation = {
  syntax: {
    title: "Syntax Basics",
    items: [
      {
        category: "Variables",
        syntax: "let name = expression;",
        example: "let x = 5;\nlet name = \"Monkey\";",
        description: "Bind values to names using the let keyword"
      },
      {
        category: "Functions",
        syntax: "fn(params) { body }",
        example: "let add = fn(x, y) { x + y };\nadd(5, 10);",
        description: "Define anonymous functions and assign them to variables"
      },
      {
        category: "If Expressions",
        syntax: "if (condition) { consequence } else { alternative }",
        example: "if (x > 10) {\n  puts(\"big\");\n} else {\n  puts(\"small\");\n}",
        description: "Conditional expressions that return values"
      },
      {
        category: "Return Statements",
        syntax: "return expression;",
        example: "let max = fn(a, b) {\n  if (a > b) {\n    return a;\n  }\n  return b;\n};",
        description: "Early return from functions"
      },
      {
        category: "Arrays",
        syntax: "[element1, element2, ...]",
        example: "let arr = [1, 2, 3, 4, 5];\nlet mixed = [1, \"two\", fn(x) { x }];",
        description: "Ordered collections of any type"
      },
      {
        category: "Hash Maps",
        syntax: "{key: value, ...}",
        example: "let person = {\"name\": \"Alice\", \"age\": 30};\nperson[\"name\"];",
        description: "Key-value pairs using strings, integers, or booleans as keys"
      },
      {
        category: "Index Expressions",
        syntax: "array[index] or hash[key]",
        example: "let arr = [1, 2, 3];\narr[0];\nlet h = {\"key\": \"value\"};\nh[\"key\"];",
        description: "Access array elements or hash values"
      }
    ]
  },

  operators: {
    title: "Operators",
    items: [
      {
        category: "Arithmetic",
        operators: "+ - * /",
        example: "5 + 3;\n10 - 4;\n3 * 4;\n10 / 2;",
        description: "Basic arithmetic operations"
      },
      {
        category: "Comparison",
        operators: "== != < >",
        example: "5 == 5;\n5 != 3;\n10 > 5;\n3 < 7;",
        description: "Compare values and return booleans"
      },
      {
        category: "Boolean",
        operators: "! (not)",
        example: "!true;\n!false;\n!(5 > 3);",
        description: "Boolean negation operator"
      },
      {
        category: "Prefix",
        operators: "- (negation)",
        example: "-5;\nlet x = 10;\n-x;",
        description: "Negate numbers"
      }
    ]
  },

  builtins: {
    title: "Built-in Functions",
    functions: [
      {
        name: "len",
        signature: "len(value)",
        params: "array or string",
        returns: "Integer - length of the collection",
        description: "Returns the number of elements in an array or characters in a string",
        example: "len([1, 2, 3]);\nlen(\"hello\");\nlen(\"\");",
        valid: true
      },
      {
        name: "puts",
        signature: "puts(values...)",
        params: "any values (variadic)",
        returns: "null",
        description: "Prints values to output, each on a new line",
        example: "puts(\"Hello\", \"World\");\nputs(42, true, [1, 2]);",
        valid: true
      },
      {
        name: "first",
        signature: "first(array)",
        params: "array",
        returns: "First element or null if empty",
        description: "Returns the first element of an array",
        example: "first([1, 2, 3]);\nfirst([]);",
        valid: true
      },
      {
        name: "last",
        signature: "last(array)",
        params: "array",
        returns: "Last element or null if empty",
        description: "Returns the last element of an array",
        example: "last([1, 2, 3]);\nlast([]);",
        valid: true
      },
      {
        name: "rest",
        signature: "rest(array)",
        params: "array",
        returns: "New array without first element",
        description: "Returns a new array with all elements except the first",
        example: "rest([1, 2, 3, 4]);\nrest([1]);\nrest([]);",
        valid: true
      },
      {
        name: "push",
        signature: "push(array, element)",
        params: "array, any value",
        returns: "New array with element added",
        description: "Returns a new array with the element appended to the end",
        example: "push([1, 2], 3);\nlet a = [1];\npush(a, 2);",
        valid: true
      }
    ]
  },

  dataTypes: {
    title: "Data Types",
    items: [
      {
        type: "Integer",
        example: "5, 10, -42, 0",
        description: "64-bit signed integers"
      },
      {
        type: "Boolean",
        example: "true, false",
        description: "Boolean values"
      },
      {
        type: "String",
        example: "\"hello\", \"Monkey\", \"\"",
        description: "UTF-8 strings in double quotes"
      },
      {
        type: "Array",
        example: "[1, 2, 3], [\"a\", \"b\"], []",
        description: "Heterogeneous ordered collections"
      },
      {
        type: "Hash",
        example: "{\"key\": \"value\", 1: \"one\"}",
        description: "Key-value mappings"
      },
      {
        type: "Function",
        example: "fn(x) { x + 1 }",
        description: "First-class functions with closures"
      },
      {
        type: "Null",
        example: "null",
        description: "Represents absence of value"
      }
    ]
  },

  examples: {
    title: "Code Examples",
    snippets: [
      {
        title: "Fibonacci",
        description: "Recursive fibonacci sequence calculator",
        code: `let fibonacci = fn(n) {
  if (n < 2) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
};

fibonacci(10);`,
        tags: ["recursion", "functions"]
      },
      {
        title: "Array Operations",
        description: "Working with arrays using built-in functions",
        code: `let arr = [1, 2, 3, 4, 5];

puts("Array:", arr);
puts("Length:", len(arr));
puts("First:", first(arr));
puts("Last:", last(arr));
puts("Rest:", rest(arr));
puts("Push:", push(arr, 6));`,
        tags: ["arrays", "builtins"]
      },
      {
        title: "Map Function",
        description: "Implementing a higher-order map function",
        code: `let map = fn(arr, f) {
  let iter = fn(arr, accumulated) {
    if (len(arr) == 0) {
      return accumulated;
    } else {
      return iter(rest(arr), push(accumulated, f(first(arr))));
    }
  };
  iter(arr, []);
};

let double = fn(x) { x * 2 };
map([1, 2, 3, 4], double);`,
        tags: ["higher-order", "recursion", "arrays"]
      },
      {
        title: "Closures",
        description: "Functions that capture their environment",
        code: `let newAdder = fn(x) {
  return fn(y) { x + y };
};

let addTwo = newAdder(2);
addTwo(3);`,
        tags: ["closures", "functions"]
      },
      {
        title: "Hash Maps",
        description: "Using hash maps to store data",
        code: `let person = {
  "name": "Alice",
  "age": 30,
  "isAdmin": true
};

puts("Name:", person["name"]);
puts("Age:", person["age"]);
puts("Admin:", person["isAdmin"]);`,
        tags: ["hash", "data-structures"]
      },
      {
        title: "Reduce Function",
        description: "Reducing an array to a single value",
        code: `let reduce = fn(arr, initial, f) {
  let iter = fn(arr, result) {
    if (len(arr) == 0) {
      return result;
    } else {
      return iter(rest(arr), f(result, first(arr)));
    }
  };
  iter(arr, initial);
};

let sum = fn(x, y) { x + y };
reduce([1, 2, 3, 4, 5], 0, sum);`,
        tags: ["higher-order", "recursion", "arrays"]
      },
      {
        title: "Filter Function",
        description: "Filtering array elements",
        code: `let filter = fn(arr, predicate) {
  let iter = fn(arr, accumulated) {
    if (len(arr) == 0) {
      return accumulated;
    } else {
      let head = first(arr);
      let tail = rest(arr);
      if (predicate(head)) {
        return iter(tail, push(accumulated, head));
      } else {
        return iter(tail, accumulated);
      }
    }
  };
  iter(arr, []);
};

let isEven = fn(x) { x - (x / 2) * 2 == 0 };
filter([1, 2, 3, 4, 5, 6], isEven);`,
        tags: ["higher-order", "recursion", "arrays"]
      },
      {
        title: "Factorial",
        description: "Classic factorial function",
        code: `let factorial = fn(n) {
  if (n == 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
};

factorial(5);`,
        tags: ["recursion", "functions"]
      }
    ]
  }
};
