# [React Auto TDD](https://github.com/ramsunvtech/react-test-bed) &middot; ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react-auto-tdd)

React-Auto-TDD beta is a JavaScript library helps you to kickstart your Test Case, prescribing best practices and tools to help you stay productive.

This Module aims to help developer to save time in basic test setup once and yet to support for existing spec files.

Module consumes `Jest`, `React Testing Library`, `Redux Mock Store`.

## Installation

Tool has been designed for gradual adoption from the start.

```
npm i -D react-auto-tdd
```

## Guidelines

Add script command in your package.json like below.

```
"tdd": "react-tdd -f src/root/path/fileName",
```

Run command

```
npm run tdd
```

### License

React Auto TDD is [MIT licensed](./LICENSE).