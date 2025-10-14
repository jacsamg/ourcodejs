import { DeltaRouteSetup } from '../../src/types';

export const BASIC_ROUTE: DeltaRouteSetup = { method: 'GET', path: '/a/b/c', resolver: () => { } };
export const PARAM_ROUTE: DeltaRouteSetup = { method: 'GET', path: '/a/:b/c', resolver: () => { } };
