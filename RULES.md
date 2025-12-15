# ESLint Rules Documentation

This document outlines the ESLint rules configured in the `.windsurf` file, organized by category for better understanding and maintenance.

## Table of Contents
- [Basic JavaScript/TypeScript Rules](#basic-javascripthtml)
- [Best Practices](#best-practices)
- [Code Style](#code-style)
- [TypeScript Specific](#typescript-specific)
- [Test Files](#test-files)
- [Environment Settings](#environment-settings)

## Basic JavaScript/TypeScript Rules

| Rule | Description | Severity |
|------|-------------|----------|
| `no-console` | Warns about `console` statements | Warning |
| `no-debugger` | Disallows `debugger` statements | Error |
| `no-unused-vars` | Warns about unused variables (ignores those starting with `_`) | Warning |
| `semi` | Enforces consistent semicolon usage | Error |
| `quotes` | Enforces single quotes | Error |
| `indent` | Enforces 2-space indentation | Error |
| `comma-dangle` | Requires trailing commas in multiline objects/arrays | Error |
| `object-curly-spacing` | Enforces consistent spacing inside braces | Error |
| `array-bracket-spacing` | Disallows spaces inside array brackets | Error |
| `space-in-parens` | Disallows spaces inside parentheses | Error |

## Best Practices

| Rule | Description | Severity |
|------|-------------|----------|
| `eqeqeq` | Requires `===` and `!==` instead of `==` and `!=` | Error |
| `no-eval` | Disallows `eval()` | Error |
| `no-implied-eval` | Disallows implied `eval()` through `setTimeout`/`setInterval` | Error |
| `no-extra-bind` | Disallows unnecessary `.bind()` calls | Error |
| `no-invalid-this` | Disallows `this` in invalid contexts | Error |
| `no-lone-blocks` | Disallows unnecessary nested blocks | Error |
| `no-multi-spaces` | Disallows multiple spaces | Error |
| `no-new` | Disallows `new` operators outside of assignments | Error |
| `no-return-assign` | Disallows assignment in `return` statements | Error |
| `no-return-await` | Disallows unnecessary `return await` | Error |
| `no-self-compare` | Disallows comparisons where both sides are the same | Error |
| `no-useless-concat` | Flags unnecessary string concatenation | Error |
| `no-useless-return` | Flags unnecessary `return` statements | Error |
| `no-var` | Requires `let` or `const` instead of `var` | Error |
| `prefer-const` | Requires `const` for variables that are never reassigned | Error |
| `yoda` | Requires comparison literals to be on the right side | Error |

## Code Style

| Rule | Description | Severity |
|------|-------------|----------|
| `brace-style` | Enforces consistent brace style (1tbs) | Error |
| `camelcase` | Enforces camelCase naming | Error |
| `comma-spacing` | Enforces spacing after commas | Error |
| `func-call-spacing` | Disallows spaces between function calls and parentheses | Error |
| `key-spacing` | Enforces consistent spacing between keys and values | Error |
| `keyword-spacing` | Enforces consistent spacing around keywords | Error |
| `max-len` | Limits line length to 100 characters | Warning |
| `no-multiple-empty-lines` | Limits consecutive empty lines to 1 | Error |
| `no-trailing-spaces` | Disallows trailing whitespace | Error |
| `space-before-blocks` | Requires space before blocks | Error |
| `space-before-function-paren` | Disallows spaces before function parentheses | Error |
| `spaced-comment` | Requires consistent spacing after `//` | Error |

## TypeScript Specific

These rules are applied to `.ts` and `.tsx` files:

| Rule | Description | Severity |
|------|-------------|----------|
| `@typescript-eslint/explicit-function-return-type` | Disabled for flexibility | Off |
| `@typescript-eslint/no-explicit-any` | Warns about `any` type usage | Warning |
| `@typescript-eslint/no-unused-vars` | Warns about unused TypeScript variables | Warning |

## Test Files

Special rules for test files (`*.test.js`, `*.test.ts`, etc.):
- Enables Jest environment
- Disables `no-unused-expressions` for test assertions

## Environment Settings

- **Environments**:
  - Browser
  - Node.js
  - ES6+
  - Jest (for test files)
- **Parser Options**:
  - ECMAScript 2021
  - Source Type: Module

## How to Use

Run ESLint on your project:

```bash
# Check all files
npx eslint .

# Check specific file
npx eslint path/to/file.js

# Fix auto-fixable issues
npx eslint . --fix
```

## Adding New Rules

1. Add the rule to the appropriate section in `.windsurf`
2. Update this document with the new rule's description and severity
3. Consider the impact on existing code before changing rule severity
