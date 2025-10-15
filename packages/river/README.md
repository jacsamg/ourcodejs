# River
- Node.js server handler with middleware flow
- Install with `npm i @ourcodejs/river`

## Quick Start

River allows you to create endpoints with handlers and middlewares for your Node.js HTTP server.

### Basic Example

Here's how to use River with a vanilla Node.js server:

```js
import http from 'node:http';
import { createHandler, createEndpoint } from '@ourcodejs/river';

const handler = createHandler((event) => {
  event.res.writeHead(200, { 'Content-Type': 'text/plain' });
  event.res.end('Hello World');
});
const endpoint = createEndpoint({ handler });
const server = http.createServer((req, res) => {
  // For simplicity, handle all requests with this endpoint
  // In a real app, you'd route based on req.url
  endpoint(req, res);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Run the server and visit `http://localhost:3000` to see "Hello World".

### With Middleware

You can add middlewares to your endpoint:

```js
import { createMiddleware } from '@ourcodejs/river';

// Middleware to log requests
const loggerMiddleware = createMiddleware((event, next) => {
  console.log(`${event.req.method} ${event.req.url}`);
  return next();
});

// Create endpoint with middleware
const endpointWithMiddleware = createEndpoint({
  handler,
  middlewares: [loggerMiddleware]
});
```

Replace the `endpoint` in the server creation with `endpointWithMiddleware`.
