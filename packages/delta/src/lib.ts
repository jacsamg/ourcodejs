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

export class DeltaNode {}

export class DeltaRouter {
  public readonly children: Map<string, DeltaRouter> = new Map();

  public segment: DeltaSegmentInfo | null = null;
  public method: DeltaHttpMethod | null = null;
  public handler: HandlerFn | null = null;

  constructor(routes: DeltaRouteSetup[]) {
    for (const route of routes) {
      this.createTree(route);
    }
  }

  private createTree(route: DeltaRouteSetup): void {
    const segments: DeltaSegmentInfo[] = getSegments(route.path);
    const resolver = route.resolver;
    let currentNode: DeltaRouter = this; // Start from the root node

    for (const segment of segments) {
      const segmentKey = segment.isParam ? SEGMENT_PARAM_KEY : segment.value;
      let child = currentNode.children.get(segmentKey);

      if (!child) {
        child = new DeltaRouter([]);
        currentNode.children.set(segmentKey, child);
      }

      // Assign the segment to the child node (not the parent)
      child.segment = segment;
      currentNode = child; // Move to the child node
    }

    if (resolver instanceof DeltaRouter) {
      // For nested DeltaRouter, add its children to the current node's children
      for (const [segmentKey, childNode] of resolver.children.entries()) {
        if (currentNode.children.has(segmentKey)) {
          throw new Error(ERROR_MSG.ROUTER_EXISTS);
        }

        currentNode.children.set(segmentKey, childNode);
      }

      return;
    }

    if (currentNode.handler !== null) {
      throw new Error(ERROR_MSG.HANDLER_EXISTS);
    }

    currentNode.method = (route as DeltaRouteHandler).method;
    currentNode.handler = <HandlerFn>resolver;
  }

  public getRoute(method: string = '', path: string = ''): DeltaRoute | null {
    const segmentKeys: string[] = path.split('?')[0].split('/').filter(Boolean);
    const params = new Map<string, string>();
    let currentNode: DeltaRouter = this;

    for (const segmentKey of segmentKeys) {
      const directNode = currentNode.children.get(segmentKey);
      if (directNode) {
        currentNode = directNode;
        continue;
      }

      const paramNode = currentNode.children.get(SEGMENT_PARAM_KEY);
      if (paramNode) {
        currentNode = paramNode;
        params.set((currentNode.segment as DeltaSegmentInfo).value, segmentKey);
        continue;
      }

      return null;
    }

    if (method !== currentNode.method || !currentNode.handler) {
      return null;
    }

    return { params, handler: currentNode.handler };
  }
}

export function createRouter(...items: DeltaRouteSetup[]): DeltaRouter {
  return new DeltaRouter(items);
}
