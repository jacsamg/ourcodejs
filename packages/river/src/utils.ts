import type { RiverEvent } from './types.js';

export function safeEndResponse(res: RiverEvent['res']): 'ended' | 'open' {
  // If response is already ended, there's nothing we can do
  if (res.writableEnded) return 'ended';

  // If headers were already sent, avoid mutating status/headers; just end gracefully
  if (res.headersSent) {
    try {
      res.end();
    } catch {
      /* noop: best-effort end */
    }

    return 'ended';
  }

  return 'open'; // Response is still open for mutation
}

export function defaultErrorHandler({ res }: RiverEvent): void {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Internal server error');
}

export function nextFn(): boolean {
  return true;
}
