export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  const num = Math.floor(Math.random() * (max - min + 1) + min);

  return num;
}

export function padStartWithZeros(value: number, pads: number = 2): string {
  return value.toString().padStart(pads, '0');
}