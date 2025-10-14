import { objectDeepAssign } from '@ourcodejs/reef';
import { DEFAULT_RIVER_ENDPOINT_CONFIG } from './data.js';
import type { RiverEndpointConfig, RiverEvent } from './types.js';

export function defaultErrorHandler(event: RiverEvent): void {
  event.res.statusCode = 500;
  event.res.setHeader('Content-Type', 'text/plain');
  event.res.end('Internal server error');
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
