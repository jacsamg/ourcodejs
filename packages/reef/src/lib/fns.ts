export function isAsyncFn(
  fn: ((...args: unknown[]) => unknown) | Promise<unknown>,
): boolean {
  return fn.constructor.name === 'AsyncFunction';
}
