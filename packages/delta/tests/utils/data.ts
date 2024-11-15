import { DeltaRouteSetup } from '../../src/lib';

export const BASIC_ROUTE: DeltaRouteSetup = { path: '/a/b/c', handler: () => { } };
export const PARAM_ROUTE: DeltaRouteSetup = { path: '/a/:b/c', handler: () => { } };