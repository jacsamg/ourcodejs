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
  store: Map<string, string | number | boolean | object>,
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

export interface RiverEndpointOptions {
  handler: RiverHandlerDefinition;
  middlewares?: RiverMiddlewareDefinition[];
  errorHandler?: RiverErrorHandlerDefinition;
  errorLogger?: (error: Error) => void;
}
