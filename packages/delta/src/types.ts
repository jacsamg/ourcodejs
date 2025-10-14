import type { DeltaRouter } from './lib.js';

export type DeltaHttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE'
  | 'ALL';

// biome-ignore lint/suspicious/noExplicitAny: this is a generic handler type
export type HandlerFn = (...args: any[]) => void | Promise<void>;

export interface DeltaSegmentInfo {
  value: string;
  isParam: boolean;
}

export interface DeltaRoute {
  params: Map<string, string>;
  handler: HandlerFn;
}

export interface DeltaRouteSetup {
  path: string;
  method: DeltaHttpMethod;
  resolver: HandlerFn | DeltaRouter;
}
