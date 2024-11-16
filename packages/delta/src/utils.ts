import { DeltaPathPiece } from './types.js';

export function pieceIsParam(piece: string): boolean {
  return piece.startsWith(':');
}

export function getDeltaPathPieces(path: string): DeltaPathPiece[] {
  const pieces = path.split('/').filter(Boolean);

  return pieces.map((piece) => ({
    value: piece,
    isParam: pieceIsParam(piece)
  }));
}