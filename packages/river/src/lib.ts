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
import { defaultErrorHandler, safeEndResponse } from './utils.js';

const defErrorHandler = createErrorHandler(defaultErrorHandler);

export function createMiddleware(
  middleware: RiverMiddlewareFn,
): RiverMiddlewareDefinition {
  return {
    listen: (event: RiverEvent) => middleware(event),
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
  let runNext: boolean = true;

  for (const middleware of middlewares) {
    runNext = (await middleware.listen(event)) ?? false;
    if (!runNext) break;
  }

  return runNext;
}

export function createEndpoint(options: RiverEndpointOptions): RiverEndpointFn {
  const middlewares = options.middlewares || [];
  const errorHandler = options.errorHandler || defErrorHandler;
  const errorLogger = options.errorLogger || console.error;

  return async (
    req: IncomingMessage,
    res: ServerResponse,
    params = new Map(),
    store = new Map(),
  ) => {
    const event: RiverEvent = { req, res, params, store };

    try {
      if (await runEndpointMiddlewares(event, middlewares)) {
        await options.handler.listen(event);
      }
    } catch (error: unknown) {
      const err =
        error instanceof Error
          ? error
          : new Error('Unknown error', { cause: error });

      errorLogger(err);

      const connStatus = safeEndResponse(res);
      if (connStatus === 'open') await errorHandler.listen(event, err);
    }
  };
}
