import { DeltaRoute, DeltaRouteSetup, HandlerFn, DeltaSegmentInfo, DeltaHttpMethod } from './types.js';
import { getSegments } from './utils.js';

const SEGMENT_PARAM_KEY = '*';

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
      currentNode = currentNode.children.get(segmentKey)!; // Move to the child node
    }

    if (resolver instanceof DeltaRouter) {
      // For nested DeltaRouter, add its root's children to the current node's children
      for (const [key, childNode] of resolver.children.entries()) {
        if (currentNode.children.has(key)) {
          throw new Error('Router already exists for this route!');
        }

        currentNode.children.set(key, childNode);
      }
    }

    if (currentNode.handler !== null) {
      throw new Error('Handler already exists for this route!');
    }

    currentNode.method = route.method;
    currentNode.handler = <HandlerFn>resolver;
  }

  public getRoute(method: string = '', path: string = ''): DeltaRoute | null {
    const segments: string[] = path.split('/').filter(Boolean);
    const params = new Map<string, string>();
    let currentNode = this.root;

    for (const segment of segments) {
      if (currentNode.children.has(segment)) {
        currentNode = currentNode.children.get(segment)!;
        continue;
      }

      const paramNode = currentNode.children.get(SEGMENT_PARAM_KEY);
      if (paramNode) {
        currentNode = paramNode;
        params.set(currentNode.segment!.value, segment);
        continue;
      }

      return null;
    }

    if ((method !== currentNode.method) || !currentNode.handler) {
      return null;
    }

    return { params, handler: currentNode.handler };
  }
}

export function createRouter(...items: DeltaRouteSetup[]): DeltaRouter {
  return new DeltaRouter(items);
}
