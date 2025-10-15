# Delta

Tiny, dependency-free router for Node.js built on a fast trie structure.

- Small API: `createRouter(...routes)` and `router.getRoute(method, path)`
- Clean path params via `Map<string, string>`
- Supports nested routers

## Installation

```sh
npm i @ourcodejs/delta
```

Published as ESM. Use `import` in modern Node.js (recommended) or in TypeScript.

## Quick start

```js
import http from 'node:http';
import { createRouter } from '@ourcodejs/delta';

const router = createRouter(
  {
    path: '/',
    method: 'GET',
    resolver: (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World!');
    },
  },
  {
    path: '/user/:id',
    method: 'GET',
    resolver: (req, res, params) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ userId: params.get('id') }));
    },
  },
);

const server = http.createServer((req, res) => {
  const route = router.getRoute(req.method, req.url);

  if (route) {
    route.handler(req, res, route.params);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

## Public API

Delta exposes two main entry points:

- **createRouter(...routes: DeltaRouteSetup[])**
  - Registers routes and returns a `DeltaRouter` instance.
  - Each item in `routes` can be either:
    - Handler: `{ path: string; method: DeltaHttpMethod; resolver: HandlerFn }`
    - Nested router: `{ path: string; resolver: DeltaRouter }`

- **router.getRoute(method: string, path: string)**
  - Resolves a route by HTTP method and path.
  - Returns `null` when no match is found.
  - On success, returns an object with the `handler` and a `params` Map with path params.

### Types and contracts

- DeltaHttpMethod: `GET | POST | PUT | DELETE | PATCH | HEAD | OPTIONS | CONNECT | TRACE | ALL`
- DeltaRouteSetup: `DeltaRouteHandler | DeltaNestedRouter`
  - `DeltaRouteHandler = { path: string; method: DeltaHttpMethod; resolver: HandlerFn }`
  - `DeltaNestedRouter = { path: string; resolver: DeltaRouter }`
- `getRoute` result: `{ handler: HandlerFn; params: Map<string, string> } | null`
- HandlerFn: Delta doesn’t enforce a signature. Pick what fits your server. With Node’s HTTP it’s common to use `(req, res, params) => void`.

### Matching rules

- Path is split by `/` and the query string (after `?`) is ignored.
- Static segments must match exactly (path matching is case-sensitive).
- Param segments use the `:` prefix (e.g., `/users/:id`), match a single segment, and are exposed in `params` without the `:`.
- HTTP method comparison is case-insensitive; `ALL` matches any method.
- At the same tree level, a static segment has precedence over a param segment.
- Duplicate slashes and trailing slash are normalized by filtering empty segments: `//users//` and `/users/` are treated as `/users`.

## Useful examples

### 1. Basic route

```ts
import { createRouter } from '@ourcodejs/delta';

const router = createRouter({
  method: 'GET',
  path: '/health',
  resolver: () => { /* your handler */ },
});

router.getRoute('GET', '/health'); // => { handler, params: Map(0) }
router.getRoute('POST', '/health'); // => null (method mismatch)
```

### 2. Path params

```ts
const router = createRouter({
  method: 'GET',
  path: '/users/:id',
  resolver: (req, res, params) => { /* params.get('id') */ },
});

const route = router.getRoute('GET', '/users/123');
route?.params.get('id'); // '123'
```

### 3. Nested routers

```ts
const users = createRouter(
  { method: 'GET', path: '/:id', resolver: () => {} },
  { method: 'POST', path: '/', resolver: () => {} },
);

const api = createRouter({ path: '/users', resolver: users });

api.getRoute('GET', '/users/42'); // => handler + params(id=42)
api.getRoute('POST', '/users');   // => handler
```

### 4. ALL method

```ts
const router = createRouter({
  method: 'ALL',
  path: '/any',
  resolver: () => {},
});

router.getRoute('GET', '/any');   // => handler
router.getRoute('PATCH', '/any'); // => handler
```

### 5. Precedence: static vs param

```ts
const router = createRouter(
  { method: 'GET', path: '/users/new', resolver: () => 'static' },
  { method: 'GET', path: '/users/:id', resolver: () => 'param' },
);

// Static wins at the same level
router.getRoute('GET', '/users/new'); // => 'static'
router.getRoute('GET', '/users/123'); // => 'param'
```

## Errors

Delta throws for invalid configuration:

- `ROUTER_EXISTS`: a nested router already exists for that segment.
- `HANDLER_EXISTS`: a handler is already registered for that exact route.
- `INVALID_ROUTE`: the `resolver` is neither a `HandlerFn` nor a `DeltaRouter`.

Examples:

```ts
import { createRouter } from '@ourcodejs/delta';

// HANDLER_EXISTS
const dup = () => createRouter(
  { method: 'GET', path: '/a', resolver: () => {} },
  { method: 'GET', path: '/a', resolver: () => {} },
);
// dup(); // throws HANDLER_EXISTS

// ROUTER_EXISTS
const nested = createRouter({ method: 'GET', path: '/b', resolver: () => {} });
const broken = () => createRouter(
  { path: '/a', resolver: nested },
  { path: '/a', resolver: nested },
);
// broken(); // throws ROUTER_EXISTS

// INVALID_ROUTE
const bad: any = { path: '/x', resolver: { not: 'a router nor a function' } };
// () => createRouter(bad); // throws INVALID_ROUTE
```

## TypeScript

Types are bundled (via `types` in `package.json`).

## FAQ

- Are paths case-sensitive?
  - Yes. Path segment matching is case-sensitive. `/Users` and `/users` differ.
- What about trailing slash or duplicate slashes?
  - Empty segments are discarded when splitting by `/`. `/users/` and `//users//` are treated as `/users`.
- Is the query string ignored?
  - Yes. Everything after `?` is ignored while matching.
- Are there wildcards or multi-segment splats?
  - No. Params match a single segment (`:id`).
- Can I register the same path with different methods?
  - Yes. Each method+path combination is unique.
- What about overlapping paths?
  - Static segments take precedence over param segments at the same tree level.
- What is the handler signature?
  - Delta doesn’t enforce a signature. Pick what fits your server. 
  - With Node’s HTTP it’s common to use:
    - `(req, res, params) => void`.
- Lookup complexity
  - O(n) in the depth of the path.

## License

MIT
