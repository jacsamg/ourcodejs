import { ERROR_MSG, SEGMENT_PARAM_KEY } from './data.js';
import type {
  DeltaHttpMethod,
  DeltaRoute,
  DeltaRouteSetup,
  DeltaSegment,
  HandlerFn,
} from './types.js';
import {
  getSegments,
  isNestedRouter,
  isRouteHandler,
  normalizeMethod,
} from './utils.js';

/**
 * Represents a node in the routing tree.
 * - `segment` contains information about the path part this node represents
 * - `method` and `handler` are only set on leaf nodes that own a route
 */
export class DeltaNode {
  public segment: DeltaSegment | null = null;
  public method: DeltaHttpMethod | null = null;
  public handler: HandlerFn | null = null;
}

/**
 * Core trie-based router primitive.
 * - Encapsulates a routing node (`node`) and a map of child routers indexed by segment key.
 * - Builds its tree from `DeltaRouteSetup[]`, supporting both handlers and nested routers.
 * - Designed for composition; routers can be mounted under other routers without copying handlers.
 *
 * Notes for maintainers:
 * - Segments are stored on the child node that represents them (see `ensureChild`).
 * - Parameter segments share a special key (`SEGMENT_PARAM_KEY`) to enable matching any value.
 * - Prefer using `createRouter(...)` in user code; this class models the underlying structure.
 */
export class DeltaRouter {
  public readonly node = new DeltaNode();
  public readonly children = new Map<string, DeltaRouter>();

  constructor(routes: DeltaRouteSetup[]) {
    for (const route of routes) {
      this.createTree(route);
    }
  }

  private ensureChild(parent: DeltaRouter, segment: DeltaSegment): DeltaRouter {
    const segmentKey = segment.isParam ? SEGMENT_PARAM_KEY : segment.value;
    let child = parent.children.get(segmentKey);

    if (!child) {
      child = new DeltaRouter([]);
      parent.children.set(segmentKey, child);
    }

    child.node.segment = segment; // child node owns its segment info
    return child;
  }

  private mergeNestedRouter(target: DeltaRouter, nested: DeltaRouter): void {
    for (const [segmentKey, childNode] of nested.children.entries()) {
      if (target.children.has(segmentKey)) {
        throw new Error(ERROR_MSG.ROUTER_EXISTS);
      }

      target.children.set(segmentKey, childNode);
    }
  }

  private createTree(route: DeltaRouteSetup): void {
    const segments: DeltaSegment[] = getSegments(route.path);
    let currentRouter: DeltaRouter = this; // Start from the root node

    for (const segment of segments) {
      currentRouter = this.ensureChild(currentRouter, segment); // Move to the child node
    }

    if (isNestedRouter(route)) {
      this.mergeNestedRouter(currentRouter, route.resolver);
      return; // The assignment of handler/method is done in its own tree
    }

    if (isRouteHandler(route)) {
      if (currentRouter.node.handler !== null) {
        throw new Error(ERROR_MSG.HANDLER_EXISTS); // Duplicate handler for the same route
      }

      currentRouter.node.method = route.method;
      currentRouter.node.handler = route.resolver as HandlerFn;
      return;
    }

    // Fallback: this should not happen because all cases are handled above
    // but keep defensive to avoid silent misconfiguration.
    throw new Error(ERROR_MSG.INVALID_ROUTE);
  }

  /**
   * Resolve a route for a given HTTP method and path.
   * - Path may include a query string which will be ignored.
   * - Method comparison is case-insensitive; 'ALL' handlers match any method.
   */
  public getRoute(method: string, path: string): DeltaRoute | null {
    const segmentKeys: string[] = path.split('?')[0].split('/').filter(Boolean);
    const params = new Map<string, string>();
    let currentRouter: DeltaRouter = this;

    for (const segmentKey of segmentKeys) {
      const directNode = currentRouter.children.get(segmentKey);
      if (directNode) {
        currentRouter = directNode;
        continue;
      }

      const paramNode = currentRouter.children.get(SEGMENT_PARAM_KEY);
      if (paramNode) {
        currentRouter = paramNode;
        params.set(
          (currentRouter.node.segment as DeltaSegment).value,
          segmentKey,
        );
        continue;
      }

      return null;
    }

    if (!currentRouter.node.handler) {
      return null;
    }

    const nodeMethod = currentRouter.node.method;
    const incomingMethod = normalizeMethod(method);

    if (nodeMethod !== 'ALL' && incomingMethod !== nodeMethod) {
      return null;
    }

    return { params, handler: currentRouter.node.handler };
  }
}

/**
 * A router that registers and resolves routes using a trie tree structure.
 * - Each path segment is a node in the trie, allowing efficient route matching.
 *
 * Example usage:
 * ```ts
 * const router = createRouter(
 *   { method: 'GET', path: '/users/:id', resolver: getUserHandler },
 *   { method: 'POST', path: '/users', resolver: createUserHandler },
 * );
 * ```
 *
 * Returns a `DeltaRouter` instance initialized with the provided routes.
 * - Prefer using this factory function in user code for clarity and future flexibility.
 */
export function createRouter(...items: DeltaRouteSetup[]): DeltaRouter {
  return new DeltaRouter(items);
}
