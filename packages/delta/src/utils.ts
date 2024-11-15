import { HandlerFn, PathPiece } from './types.js';

export function pieceIsParam(piece: string): boolean {
  return piece.startsWith(':');
}

export function getPathPieces(path: string): PathPiece[] {
  const pieces = path.split('/').filter(Boolean);

  return pieces.map((piece) => ({
    value: piece,
    isParam: pieceIsParam(piece)
  }));
}

export class DeltaTrieNode {
  public readonly children: Map<string, DeltaTrieNode> = new Map();
  public piece: string | null = null;
  public handler: HandlerFn | null = null;
}