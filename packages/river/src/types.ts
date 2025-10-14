import type { IncomingMessage, ServerResponse } from 'node:http';

export interface RiverEvent {
  req: IncomingMessage;
  res: ServerResponse;
  store: Map<string, unknown>;
  params: Map<string, string>;
}

export type RiverMiddlewareResponse =
  | Promise<boolean | undefined>
  | boolean
  | undefined;
export type RiverHandlerResponse = Promise<void> | void;
export type MiddlewareNextFn = () => boolean;
export type RiverMiddlewareFn = (
  event: RiverEvent,
  next: MiddlewareNextFn,
) => RiverMiddlewareResponse;
export type RiverHandlerFn = (event: RiverEvent) => RiverHandlerResponse;
export type RiverErrorHandlerFn = (
  event: RiverEvent,
  error: Error,
) => RiverHandlerResponse;
export type RiverEndpointFn = (
  req: IncomingMessage,
  res: ServerResponse,
  params: Map<string, string>,
  // biome-ignore lint/suspicious/noExplicitAny: this is a generic store
  store: Map<string, any>,
) => RiverHandlerResponse;

export interface RiverMiddlewareDefinition {
  listen: (event: RiverEvent) => RiverMiddlewareResponse;
}

export interface RiverHandlerDefinition {
  listen: RiverHandlerFn;
}

export interface RiverErrorHandlerDefinition {
  listen: RiverErrorHandlerFn;
}

export interface RiverEndpointConfig {
  [key: PropertyKey]: string | number | boolean | object;
  // biome-ignore lint/suspicious/noExplicitAny: this is a generic logger
  errorLogger: (...args: any[]) => void;
}

export interface RiverEndpointOptions {
  handler: RiverHandlerDefinition;
  middlewares?: RiverMiddlewareDefinition[];
  errorHandler?: RiverErrorHandlerDefinition;
  config?: Partial<RiverEndpointConfig>;
}
