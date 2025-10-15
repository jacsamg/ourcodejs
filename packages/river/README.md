# River

- Node.js server handler with a simple middleware flow
- Install: `npm i @ourcodejs/river`

River is a small library to build HTTP endpoints in Node.js with a simple and predictable middleware pipeline.

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Key concepts](#key-concepts)
- [Using middlewares](#using-middlewares)
- [Per-request params and store](#per-request-params-and-store)
- [Error handling](#error-handling)
- [Public API reference](#public-api-reference)
- [Types and TypeScript](#types-and-typescript)
- [Best practices and gotchas](#best-practices-and-gotchas)
- [License](#license)

## Installation

```bash
npm i @ourcodejs/river
```

Module type: ESM. Import using `import ... from`.

## Quick start

```js
import http from 'node:http';
import { createHandler, createEndpoint } from '@ourcodejs/river';

const handler = createHandler((event) => {
  event.res.writeHead(200, { 'Content-Type': 'text/plain' });
  event.res.end('Hello World');
});

const endpoint = createEndpoint({ handler });

const server = http.createServer((req, res) => {
  // In a real project, you'd route by req.url
  endpoint(req, res);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Visit `http://localhost:3000` to see "Hello World".

## Key concepts

- Event (RiverEvent): object with `req`, `res`, `params` and `store`, shared across the whole pipeline.
- Handler: the final function that produces the response.
- Middleware: chained functions that can read/write the `event` and decide whether to continue the flow.
- Error handler: function that handles runtime errors if the response is still open.
- Error logger: function that logs the error when an exception occurs.

## Using middlewares

```js
import { createHandler, createEndpoint, createMiddleware } from '@ourcodejs/river';

// 1) Logger
const logger = createMiddleware((event) => {
  console.log(`${event.req.method} ${event.req.url}`);
  return true; // continue the chain
});

// 2) Auth (example): stop the chain if not authorized
const auth = createMiddleware((event) => {
  const authorized = event.req.headers['x-api-key'] === 'secret';

  if (!authorized) {
    event.res.statusCode = 401;
    event.res.end('Unauthorized');
    return false; // stop here; handler and following middlewares won't run
  }

  return true;
});

const handler = createHandler((event) => {
  event.res.writeHead(200, { 'Content-Type': 'application/json' });
  event.res.end(JSON.stringify({ ok: true }));
});

const endpoint = createEndpoint({
  handler,
  middlewares: [logger, auth]
});
```

Important notes about middlewares:
- Return `true` to continue the flow.
- Returning `false` or `undefined` (or returning nothing) stops the chain.
- Both sync and async middlewares are supported and they run in order.

## Per-request params and store

Besides `(req, res)`, the endpoint accepts two optional Maps: `params` and `store`.

```js
const endpoint = createEndpoint({ handler, middlewares: [logger] });

http.createServer((req, res) => {
  const params = new Map();
  const store = new Map();

  // A very simple routing example
  if (req.url?.startsWith('/users/')) {
    const id = req.url.split('/')[2];
    params.set('id', id);
  }

  endpoint(req, res, params, store);
});
```

Inside any middleware/handler:

```js
const handler = createHandler((event) => {
  const id = event.params.get('id'); // string | undefined
  event.store.set('startTime', Date.now());
  // ...
});
```

## Error handling

If a middleware or the handler throws an exception:
- `errorLogger` is invoked (by default `console.error(error)`).
- If the response is still open (headers not sent and not ended), River invokes the `errorHandler`.
- If headers have already been sent, River tries to end the response gracefully without mutating headers/body.

Default error handler behavior: respond with `500`, `text/plain`, and body `"Internal server error"`.

Customization:

```js
import { createErrorHandler } from '@ourcodejs/river';

const errorHandler = createErrorHandler((event, error) => {
  // You can log or enrich store/params if needed
  event.res.statusCode = 500;
  event.res.setHeader('Content-Type', 'application/json');
  event.res.end(JSON.stringify({ message: 'Oops', details: error.message }));
});

const endpoint = createEndpoint({
  handler,
  errorHandler,
  errorLogger: (err) => {
    // Replace the default logger
    // e.g., send to your observability
    console.error('[river]', err.message);
  }
});
```

Important: the `errorHandler` only runs if the response is still open. If headers/body were sent or the response has ended, River won’t call it to avoid invalid mutations.

## Public API reference

River exposes four primary creators:

1) createEndpoint(options)

- Signature: `createEndpoint({ handler, middlewares?, errorHandler?, errorLogger? }): (req, res, params?, store?) => Promise<void> | void`
- Parameters:
  - handler: result of `createHandler(fn)` (required)
  - middlewares: `Array<ReturnType<typeof createMiddleware>>` (optional)
  - errorHandler: `ReturnType<typeof createErrorHandler>` (optional)
  - errorLogger: `(error: Error) => void` (optional, defaults to `console.error`)
- Returns: an endpoint function that you can pass to `http.createServer` (or your router) and that optionally accepts `params` and `store` Maps.

Minimal example:

```js
const endpoint = createEndpoint({ handler });
endpoint(req, res); // you can also pass params and store
```

2) createHandler(fn)

- Signature: `createHandler((event) => void | Promise<void>)`
- `event` contains `{ req, res, params, store }`.
- It should write to `res` and end the response when appropriate.

Example:

```js
const handler = createHandler(async ({ res, store }) => {
  const started = Date.now();
  store.set('started', started);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});
```

3) createMiddleware(fn)

- Signature: `createMiddleware((event) => boolean | undefined | Promise<boolean | undefined>)`
- Return `true` to continue. Return `false` or `undefined` (or nothing) to stop the chain.
- Can be sync or async.

Example:

```js
const timing = createMiddleware(async (event) => {
  event.store.set('user-id', '12345');
  return true; // continue the chain
});
```

4) createErrorHandler(fn)

- Signature: `createErrorHandler((event, error) => void | Promise<void>)`
- It runs only if an error occurs and the response is still open.

Example:

```js
const errorHandler = createErrorHandler(({ res }, err) => {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Error: ${err.message}`);
});
```

## Types and TypeScript

- You don’t need to import types manually: callbacks are typed and inferred.
- `event.params` is `Map<string, string>` and `event.store` is `Map<string, unknown>`.
- The library is published as ESM; use `"type": "module"`.

## Best practices and gotchas

- In your middlewares, return `true` when you want to continue the flow.
- If headers/body were already sent and an error occurs, River will end the response safely and won’t call the `errorHandler`.
- The order in `middlewares: [...]` is the execution order.

## License

MIT
