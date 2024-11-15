export function timeout(time = 1): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}