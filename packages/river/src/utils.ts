import { objectDeepAssign } from '@ourcodejs/reef';
import { DEFAULT_RIVER_ENDPOINT_CONFIG } from './data.js';
import type { RiverEndpointConfig, RiverEvent } from './types.js';

export function defaultErrorHandler({ res }: RiverEvent): void {
  // If response is already ended, there's nothing we can do
  if (res.writableEnded) return;

  // If headers were already sent, avoid mutating status/headers; just end gracefully
  if (res.headersSent) {
    try {
      res.end();
    } catch {
      /* noop: best-effort end */
    }

    return;
  }

  // If headers were not sent yet, we can safely set status, headers and send a body
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Internal server error');
}

export function nextFn(): boolean {
  return true;
}

export function getEndpointConfig(
  options?: Partial<RiverEndpointConfig>,
): RiverEndpointConfig {
  if (options) {
    return objectDeepAssign(
      {},
      DEFAULT_RIVER_ENDPOINT_CONFIG,
      options,
    ) as RiverEndpointConfig;
  }

  return DEFAULT_RIVER_ENDPOINT_CONFIG;
}
