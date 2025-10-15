import { ERROR_MSG, SEGMENT_PARAM_KEY } from './data.js';
import type {
  DeltaHttpMethod,
  DeltaRoute,
  DeltaRouteHandler,
  DeltaRouteSetup,
  DeltaSegmentInfo,
  HandlerFn,
} from './types.js';
import { getSegments } from './utils.js';

export class DeltaNode {
  public segment: DeltaSegmentInfo | null = null;
  public method: DeltaHttpMethod | null = null;
  public handler: HandlerFn | null = null;
}

export class DeltaRouter {
  public readonly node: DeltaNode = new DeltaNode();
  public readonly children: Map<string, DeltaRouter> = new Map();

  constructor(routes: DeltaRouteSetup[]) {
    for (const route of routes) {
      this.createTree(route);
    }
  }

  private createTree(route: DeltaRouteSetup): void {
    const segments: DeltaSegmentInfo[] = getSegments(route.path);
    const resolver = route.resolver;
    let currentRouter: DeltaRouter = this; // Start from the root node

    for (const segment of segments) {
      const segmentKey = segment.isParam ? SEGMENT_PARAM_KEY : segment.value;
      let child = currentRouter.children.get(segmentKey);

      if (!child) {
        child = new DeltaRouter([]);
        currentRouter.children.set(segmentKey, child);
      }

      child.node.segment = segment; // Assign the segment to the child node (not the parent)
      currentRouter = child; // Move to the child node
    }

    if (resolver instanceof DeltaRouter) {
      // For nested DeltaRouter, add its children to the current node's children
      for (const [segmentKey, childNode] of resolver.children.entries()) {
        if (currentRouter.children.has(segmentKey)) {
          throw new Error(ERROR_MSG.ROUTER_EXISTS);
        }

        currentRouter.children.set(segmentKey, childNode);
      }

      return; // Because the assignment of handler/method is done in its own tree
    }

    if (currentRouter.node.handler !== null) {
      throw new Error(ERROR_MSG.HANDLER_EXISTS);
    }

    currentRouter.node.method = (route as DeltaRouteHandler).method;
    currentRouter.node.handler = <HandlerFn>resolver;
  }

  public getRoute(method: string = '', path: string = ''): DeltaRoute | null {
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
          (currentRouter.node.segment as DeltaSegmentInfo).value,
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
    if (nodeMethod !== 'ALL' && method !== nodeMethod) {
      return null;
    }

    return { params, handler: currentRouter.node.handler };
  }
}

export function createRouter(...items: DeltaRouteSetup[]): DeltaRouter {
  return new DeltaRouter(items);
}
