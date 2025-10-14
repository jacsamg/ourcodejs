# Delta
- Node.js server router
- Install with `npm i @ourcodejs/delta`

## Quick Start

Here's how to use Delta with a vanilla Node.js server:

```javascript
const http = require('http');
const { createRouter } = require('@ourcodejs/delta');

const router = createRouter(
  {
    path: '/',
    method: 'GET',
    resolver: (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World!');
    }
  },
  {
    path: '/user/:id',
    method: 'GET',
    resolver: (req, res, params) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ userId: params.get('id') }));
    }
  }
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

This example creates a simple HTTP server that uses Delta to route requests. The router handles GET requests to `/` and `/user/:id` (where `:id` is a path parameter).
