import { DeltaRouter } from './lib.js';
import type {
  DeltaNestedRouter,
  DeltaRouteHandler,
  DeltaRouteSetup,
  DeltaSegment,
} from './types.js';

function segmentIsParam(segment: string): boolean {
  return segment.startsWith(':');
}

/** Split a path into segments and identify any parameter segments */
export function getSegments(path: string): DeltaSegment[] {
  const segments = path.split('/').filter(Boolean);

  return segments.map((segment) => {
    const isParam = segmentIsParam(segment);
    return { value: isParam ? segment.slice(1) : segment, isParam };
  });
}

export function isNestedRouter(
  route: DeltaRouteSetup,
): route is DeltaNestedRouter {
  return (route as Partial<DeltaNestedRouter>).resolver instanceof DeltaRouter;
}

/** Type guard to distinguish a handler route from a nested router route */
export function isRouteHandler(
  route: DeltaRouteSetup,
): route is DeltaRouteHandler {
  return (
    typeof (route as Partial<DeltaRouteHandler>).method === 'string' &&
    typeof (route as Partial<DeltaRouteHandler>).resolver === 'function'
  );
}

/** Normalize incoming HTTP method for comparison (uppercase); returns empty string if falsy */
export function normalizeMethod(method?: string): string {
  return (method || '').toUpperCase();
}
