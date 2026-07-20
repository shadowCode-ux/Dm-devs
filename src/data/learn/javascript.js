export const javascriptReference = [
  {
    name: 'let',
    category: 'Variables',
    description:
      'Declares a variable that can be reassigned later. Scoped to the nearest block ({ }), unlike the older var keyword.',
    syntax: 'let name = value;',
    example: 'let count = 0;\ncount = count + 1;',
  },
  {
    name: 'const',
    category: 'Variables',
    description:
      'Declares a variable that cannot be reassigned. The default choice for most variables — use let only when you know the value will change.',
    syntax: 'const name = value;',
    example: 'const maxUsers = 100;',
  },
  {
    name: 'var',
    category: 'Variables',
    description:
      'The original way to declare variables. Function-scoped rather than block-scoped, which causes subtle bugs — avoid it in modern code in favor of let/const.',
    syntax: 'var name = value;',
    example: 'var oldStyle = "avoid this";',
  },
  {
    name: 'function',
    category: 'Functions',
    description:
      'Declares a reusable named block of code. Function declarations are hoisted — usable even before their definition appears in the file.',
    syntax: 'function name(params) {\n  return value;\n}',
    example: 'function add(a, b) {\n  return a + b;\n}',
  },
  {
    name: 'arrow function',
    category: 'Functions',
    description:
      'A shorter function syntax. Unlike regular functions, arrow functions don\'t have their own this — they inherit it from the surrounding scope.',
    syntax: 'const name = (params) => {\n  return value;\n};',
    example: 'const add = (a, b) => a + b;',
  },
  {
    name: 'default parameters',
    category: 'Functions',
    description: 'Gives a function parameter a fallback value used when no argument (or undefined) is passed.',
    syntax: 'function greet(name = "friend") { ... }',
    example: 'function greet(name = "friend") {\n  return `Hello, ${name}`;\n}',
  },
  {
    name: 'rest parameters',
    category: 'Functions',
    description: 'Collects any number of remaining arguments into an array.',
    syntax: 'function fn(...args) { ... }',
    example: 'function sum(...numbers) {\n  return numbers.reduce((a, b) => a + b, 0);\n}',
  },
  {
    name: 'if / else',
    category: 'Control Flow',
    description: 'Runs code conditionally based on whether an expression is truthy or falsy.',
    syntax: 'if (condition) {\n  ...\n} else {\n  ...\n}',
    example: 'if (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}',
  },
  {
    name: 'ternary operator',
    category: 'Control Flow',
    description: 'A compact one-line if/else, useful for assigning a value based on a condition.',
    syntax: 'condition ? valueIfTrue : valueIfFalse',
    example: 'const status = age >= 18 ? "Adult" : "Minor";',
  },
  {
    name: 'switch',
    category: 'Control Flow',
    description:
      'Compares a value against multiple possible cases, running the matching block. Cleaner than a long if/else chain when checking one variable against many values.',
    syntax: 'switch (value) {\n  case a:\n    ...\n    break;\n  default:\n    ...\n}',
    example: 'switch (role) {\n  case "admin":\n    return "Full access";\n  default:\n    return "Limited access";\n}',
  },
  {
    name: 'for',
    category: 'Loops',
    description: 'Runs a block of code a set number of times, using a counter variable.',
    syntax: 'for (let i = 0; i < n; i++) { ... }',
    example: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}',
  },
  {
    name: 'for...of',
    category: 'Loops',
    description: 'Loops directly over the values in an array (or other iterable), without needing an index.',
    syntax: 'for (const item of array) { ... }',
    example: 'for (const tag of tags) {\n  console.log(tag);\n}',
  },
  {
    name: 'while',
    category: 'Loops',
    description: 'Repeats a block as long as a condition stays true — useful when you don\'t know the exact number of iterations in advance.',
    syntax: 'while (condition) { ... }',
    example: 'let n = 10;\nwhile (n > 0) {\n  n--;\n}',
  },
  {
    name: 'Array.map()',
    category: 'Arrays',
    description:
      'Creates a new array by transforming every item with a function. Doesn\'t modify the original array — extremely common in React for rendering lists.',
    syntax: 'array.map((item) => transformedItem)',
    example: 'const doubled = [1, 2, 3].map((n) => n * 2);\n// [2, 4, 6]',
  },
  {
    name: 'Array.filter()',
    category: 'Arrays',
    description: 'Creates a new array containing only the items for which the given function returns true.',
    syntax: 'array.filter((item) => condition)',
    example: 'const adults = users.filter((user) => user.age >= 18);',
  },
  {
    name: 'Array.reduce()',
    category: 'Arrays',
    description:
      'Boils an array down to a single value by running an accumulator function over each item — used for sums, groupings, or building objects from arrays.',
    syntax: 'array.reduce((accumulator, item) => newAccumulator, initialValue)',
    example: 'const total = [10, 20, 30].reduce((sum, n) => sum + n, 0);\n// 60',
  },
  {
    name: 'Array.find()',
    category: 'Arrays',
    description: 'Returns the first item matching a condition, or undefined if none match.',
    syntax: 'array.find((item) => condition)',
    example: 'const user = users.find((u) => u.id === 3);',
  },
  {
    name: 'Array.includes()',
    category: 'Arrays',
    description: 'Checks whether an array contains a given value, returning true or false.',
    syntax: 'array.includes(value)',
    example: '[1, 2, 3].includes(2); // true',
  },
  {
    name: 'spread operator (...)',
    category: 'Arrays & Objects',
    description:
      'Expands an array or object into individual elements/properties — used to copy, merge, or combine data without mutating the original.',
    syntax: '[...array]\n{...object}',
    example: 'const updated = { ...user, name: "New Name" };',
  },
  {
    name: 'destructuring',
    category: 'Arrays & Objects',
    description: 'Extracts values from arrays or properties from objects into individual variables in one line.',
    syntax: 'const { key } = object;\nconst [first, second] = array;',
    example: 'const { name, age } = user;\nconst [first, ...rest] = [1, 2, 3];',
  },
  {
    name: 'template literals',
    category: 'Strings',
    description:
      'Backtick-delimited strings that allow embedded expressions (${...}) and multi-line text, without messy string concatenation.',
    syntax: '`text ${expression} text`',
    example: 'const greeting = `Hello, ${name}! You are ${age} years old.`;',
  },
  {
    name: 'async / await',
    category: 'Async',
    description:
      'Lets you write asynchronous code (like API calls) that reads top-to-bottom like synchronous code, instead of chained .then() callbacks.',
    syntax: 'async function fn() {\n  const result = await somePromise;\n}',
    example: 'async function getUser(id) {\n  const response = await fetch(`/api/users/${id}`);\n  return response.json();\n}',
  },
  {
    name: 'Promise',
    category: 'Async',
    description:
      'Represents a value that will be available in the future — either resolved (success) or rejected (failure). async/await is built on top of Promises.',
    syntax: 'new Promise((resolve, reject) => { ... })',
    example: 'const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));',
  },
  {
    name: 'try / catch',
    category: 'Async',
    description: 'Catches errors thrown in the try block so they can be handled gracefully instead of crashing the program.',
    syntax: 'try {\n  ...\n} catch (error) {\n  ...\n}',
    example: 'try {\n  await login(email, password);\n} catch (error) {\n  console.log("Login failed");\n}',
  },
  {
    name: 'fetch()',
    category: 'Async',
    description: 'The built-in browser API for making HTTP requests to servers/APIs.',
    syntax: 'fetch(url).then((response) => response.json())',
    example: 'const data = await fetch("/api/projects").then((res) => res.json());',
  },
  {
    name: 'document.querySelector()',
    category: 'DOM',
    description:
      'Finds the first element in the page matching a CSS selector. querySelectorAll() returns all matches instead of just the first.',
    syntax: 'document.querySelector("selector")',
    example: 'const button = document.querySelector(".submit-btn");',
  },
  {
    name: 'addEventListener()',
    category: 'DOM',
    description: 'Attaches a function to run when a specific event (click, submit, keydown, etc) happens on an element.',
    syntax: 'element.addEventListener("event", callback)',
    example: 'button.addEventListener("click", () => {\n  console.log("Clicked!");\n});',
  },
  {
    name: 'localStorage',
    category: 'Browser APIs',
    description:
      'Stores key-value data in the browser that persists across page reloads and sessions, until explicitly cleared.',
    syntax: 'localStorage.setItem(key, value);\nlocalStorage.getItem(key);',
    example: 'localStorage.setItem("theme", "dark");\nconst theme = localStorage.getItem("theme");',
  },
  {
    name: 'JSON.stringify() / parse()',
    category: 'Data',
    description:
      'Converts a JS object to a JSON string (stringify) or a JSON string back to a JS object (parse) — needed since localStorage and APIs only work with strings.',
    syntax: 'JSON.stringify(obj)\nJSON.parse(str)',
    example: 'const str = JSON.stringify({ name: "Shadow" });\nconst obj = JSON.parse(str);',
  },
  {
    name: 'typeof',
    category: 'Operators',
    description: 'Returns a string describing the type of a value — useful for quick runtime checks.',
    syntax: 'typeof value',
    example: 'typeof "hello"; // "string"\ntypeof 42; // "number"',
  },
  {
    name: '=== vs ==',
    category: 'Operators',
    description:
      '=== checks value and type (strict equality) with no conversion. == converts types before comparing, which causes surprising bugs — always prefer ===.',
    syntax: 'a === b',
    example: '"5" == 5;  // true (converts type)\n"5" === 5; // false (different types)',
  },
]
