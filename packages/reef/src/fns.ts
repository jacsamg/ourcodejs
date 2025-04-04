export function isAsyncFn(fn: Function | Promise<unknown>): boolean {
  return fn.constructor.name === "AsyncFunction";
}
