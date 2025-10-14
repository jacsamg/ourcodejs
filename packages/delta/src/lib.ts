import { ERROR_MSG, SEGMENT_PARAM_KEY } from './data.js';
import type {
  DeltaHttpMethod,
  DeltaRoute,
  DeltaRouteSetup,
  DeltaSegmentInfo,
  HandlerFn,
} from './types.js';
import { getSegments } from './utils.js';

class DeltaNode {
  public readonly children: Map<string, DeltaNode> = new Map();

  public segment: DeltaSegmentInfo | null = null;
  public method: DeltaHttpMethod | null = null;
  public handler: HandlerFn | null = null;
}

export class DeltaRouter {
  private readonly root: DeltaNode = new DeltaNode();
  public readonly children = this.root.children;

  constructor(routes: DeltaRouteSetup[]) {
    for (const route of routes) {
      this.addRouteToTree(route);
    }
  }

  private addRouteToTree(route: DeltaRouteSetup): void {
    const segments: DeltaSegmentInfo[] = getSegments(route.path);
    const resolver = route.resolver;
    let currentNode = this.root; // Start from the root node

    for (const segment of segments) {
      const segmentKey = segment.isParam ? SEGMENT_PARAM_KEY : segment.value;

      if (!currentNode.children.has(segmentKey)) {
        currentNode.children.set(segmentKey, new DeltaNode());
      }

      currentNode.segment = segment;
      currentNode = <DeltaNode>currentNode.children.get(segmentKey); // Move to the child node
    }

    if (resolver instanceof DeltaRouter) {
      // For nested DeltaRouter, add its root's children to the current node's children
      for (const [segmentKey, childNode] of resolver.children.entries()) {
        if (currentNode.children.has(segmentKey)) {
          throw new Error(ERROR_MSG.ROUTER_EXISTS);
        }

        currentNode.children.set(segmentKey, childNode);
      }
    }

    if (currentNode.handler !== null) {
      throw new Error(ERROR_MSG.HANDLER_EXISTS);
    }

    currentNode.method = route.method;
    currentNode.handler = <HandlerFn>resolver;
  }

  public getRoute(method: string = '', path: string = ''): DeltaRoute | null {
    const segmentKeys: string[] = path.split('/').filter(Boolean);
    const params = new Map<string, string>();
    let currentNode = this.root;

    for (const segmentKey of segmentKeys) {
      if (currentNode.children.has(segmentKey)) {
        currentNode = <DeltaNode>currentNode.children.get(segmentKey);
        continue;
      }

      const paramNode = currentNode.children.get(SEGMENT_PARAM_KEY);
      if (paramNode) {
        currentNode = paramNode;
        params.set((<DeltaSegmentInfo>currentNode.segment).value, segmentKey);
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
