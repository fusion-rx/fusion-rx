## Angular Interop

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
