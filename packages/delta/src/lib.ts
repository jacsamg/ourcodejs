import { DeltaRoute, DeltaRouteSetup, HandlerFn, DeltaPathPiece, DeltaHttpMethod } from './types.js';
import { getDeltaPathPieces } from './utils.js';

const PARAM_PIECE_KEY = '*';

class DeltaTrieNode {
  public readonly children: Map<string, DeltaTrieNode> = new Map();

  public piece: string | null = null;
  public method: DeltaHttpMethod | null = null;
  public handler: HandlerFn | null = null;
}

export class DeltaRouter {
  private readonly root: DeltaTrieNode = new DeltaTrieNode();
  public readonly children = this.root.children;

  constructor(items: DeltaRouteSetup[]) {
    for (const item of items) {
      const pieces: DeltaPathPiece[] = getDeltaPathPieces(item.path);
      const resolver = item.resolver;
      let currentNode = this.root;

      for (const piece of pieces) {
        const pieceKey = piece.isParam ? PARAM_PIECE_KEY : piece.value;

        if (!currentNode.children.has(pieceKey)) {
          currentNode.children.set(pieceKey, new DeltaTrieNode());
        }

        currentNode.piece = piece.isParam ? piece.value.slice(1) : piece.value;
        currentNode = currentNode.children.get(pieceKey)!;
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

      currentNode.method = item.method;
      currentNode.handler = <HandlerFn>resolver;
    }
  }

  public getRoute(method: string = '', path: string = ''): DeltaRoute | null {
    const pieces: string[] = path.split('/').filter(Boolean);
    const params = new Map<string, string>();
    let currentNode = this.root;

    for (const piece of pieces) {
      if (currentNode.children.has(piece)) {
        currentNode = currentNode.children.get(piece)!;
        continue;
      }

      if (currentNode.children.has(PARAM_PIECE_KEY)) {
        currentNode = currentNode.children.get(PARAM_PIECE_KEY)!;
        params.set(currentNode.piece!, piece);
        continue;
      }

      return null;
    }

    if ((method !== currentNode.method) || (!currentNode.handler)) {
      return null;
    }

    return { params, handler: currentNode.handler };
  }
}

export function createRouter(...items: DeltaRouteSetup[]): DeltaRouter {
  return new DeltaRouter(items);
}