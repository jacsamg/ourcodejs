import type { DeltaSegmentInfo } from './types.js';

function segmentIsParam(segment: string): boolean {
  return segment.startsWith(':');
}

export function getSegments(path: string): DeltaSegmentInfo[] {
  const segments = path.split('/').filter(Boolean);

  return segments.map((segment) => {
    const isParam = segmentIsParam(segment);
    return { value: isParam ? segment.slice(1) : segment, isParam };
  });
}
