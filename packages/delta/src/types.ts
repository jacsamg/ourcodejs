import { DeltaRouter } from './lib.js';

export type HandlerFn = (...args: any[]) => (void | Promise<void>);

export interface PathPiece {
  value: string;
  isParam: boolean;
}

export interface DeltaRoute {
  params: Map<string, string>;
  handler: HandlerFn;
}

export interface DeltaRouteSetup {
  path: string;
  handler: HandlerFn | DeltaRouter;
}