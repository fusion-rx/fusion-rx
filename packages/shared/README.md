# @fusion-rx/shared

This package provides utilities that are shared between all @fusion-rx packages,
including:

| Utility   | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| Array     |                                                                              |
| Date      | Provides DateTz, a timezone-centric extension of JavaScript's built-in date. |
| Format    | Various string formatters                                                    |
| Logger    | A logger that includes coloring and date/time info                           |
| Math      | An extension of JavaScript's built-in Math                                   |
| Object    | Various object manipulation utilities                                        |
| Operators | Extensions of built-in JavaScript operators                                  |
| Reflect   | Extension of the Reflect Metadata library                                    |
| rxjs      | Extension of the RxJs Library                                                |
| String    | Various string utilities                                                     |
| type      | Various type utilities                                                       |

## Angular Interoperability

In order to use `@fusion-rx/core` with Angular, you have to polyfill `buffer`. Install the
`buffer` package from `npm`:

```bash
npm install --save-dev buffer
```

And add the following to `polyfills.ts` in your Angular application:

```typescript
import * as Buffer from 'node_modules/buffer';
(window as any).global = window;
(window as any).process = {};
(window as any).process = window;
(window as any).process.browser = true;
(window as any).process.version = '';
(window as any).process.versions = { node: false };
(window as any).global.Buffer = Buffer.Buffer;
```
