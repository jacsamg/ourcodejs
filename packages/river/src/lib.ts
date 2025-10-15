import type { IncomingMessage, ServerResponse } from 'node:http';
import type {
  RiverEndpointFn,
  RiverEndpointOptions,
  RiverErrorHandlerDefinition,
  RiverErrorHandlerFn,
  RiverEvent,
  RiverHandlerDefinition,
  RiverHandlerFn,
  RiverMiddlewareDefinition,
  RiverMiddlewareFn,
} from './types.js';
import { defaultErrorHandler, getEndpointConfig, nextFn } from './utils.js';

export function createMiddleware(
  middleware: RiverMiddlewareFn,
): RiverMiddlewareDefinition {
  return {
    listen: (event: RiverEvent) => middleware(event, nextFn),
  };
}

export function createHandler(handler: RiverHandlerFn): RiverHandlerDefinition {
  return {
    listen: (event: RiverEvent) => handler(event),
  };
}

export function createErrorHandler(
  errorHandler: RiverErrorHandlerFn,
): RiverErrorHandlerDefinition {
  return {
    listen: (event: RiverEvent, error: Error) => errorHandler(event, error),
  };
}

async function runEndpointMiddlewares(
  event: RiverEvent,
  middlewares: RiverMiddlewareDefinition[],
): Promise<boolean> {
  const middlewareLength = middlewares.length;
  let next: boolean = true;

  for (let i = 0; i < middlewareLength; i++) {
    const middleware = middlewares[i];
    next = (await middleware.listen(event)) || false;

    if (!next) break;
  }

  return next;
}

export function createEndpoint(options: RiverEndpointOptions): RiverEndpointFn {
  const middlewares = options.middlewares || [];
  const errorHandler =
    options.errorHandler || createErrorHandler(defaultErrorHandler);
  const config = getEndpointConfig(options.config);

  return async (
    req: IncomingMessage,
    res: ServerResponse,
    params = new Map(),
    store = new Map(),
  ) => {
    const event: RiverEvent = { req, res, params, store };

    try {
      const next = await runEndpointMiddlewares(event, middlewares);

      if (next) {
        await options.handler.listen(event);
      }
    } catch (error: unknown) {
      const err =
        error instanceof Error
          ? error
          : new Error('Unknown error', { cause: error });

      config.errorLogger(err);

      if (!event.res.writableEnded) {
        await errorHandler.listen(event, err);
      }
    }
  };
}
