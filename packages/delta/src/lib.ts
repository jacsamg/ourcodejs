import { DeltaRoute, DeltaRouteSetup, HandlerFn, PathPiece } from './types.js';
import { DeltaTrieNode, getPathPieces } from './utils.js';

const PARAM_PIECE_KEY = '*';

export class DeltaRouter {
  private readonly root: DeltaTrieNode = new DeltaTrieNode();
  public readonly children = this.root.children;

  constructor(items: DeltaRouteSetup[]) {
    for (const item of items) {
      const pieces: PathPiece[] = getPathPieces(item.path);
      let currentNode = this.root;

      for (const piece of pieces) {
        const pieceKey = piece.isParam ? PARAM_PIECE_KEY : piece.value;

        if (!currentNode.children.has(pieceKey)) {
          currentNode.children.set(pieceKey, new DeltaTrieNode());
        }

        currentNode.piece = piece.isParam ? piece.value.slice(1) : piece.value;
        currentNode = currentNode.children.get(pieceKey)!;
      }

      if (item.handler instanceof DeltaRouter) {
        // For nested DeltaRouter, add its root's children to the current node's children
        for (const [key, childNode] of item.handler.children.entries()) {
          if (!currentNode.children.has(key)) currentNode.children.set(key, childNode);
          else throw new Error('Router already exists for this route!');
        }
      }

      if (currentNode.handler !== null) {
        throw new Error('Handler already exists for this route!');
      }

      currentNode.handler = <HandlerFn>item.handler;
    }
  }

  public getRoute(path: string): DeltaRoute | null {
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

    return {
      params,
      handler: currentNode.handler!
    };
  }
}