export function timestampIsSec(timestamp: number): boolean {
  const minValidTimestamp = 1e9; // Jan 1, 2001 approximately
  const maxValidTimestamp = 1e10 - 1; // Before year 2286

  return (
    Number.isInteger(timestamp) &&
    timestamp >= minValidTimestamp &&
    timestamp <= maxValidTimestamp
  );
}

export function timestampIsMs(timestamp: number): boolean {
  const minValidTimestamp = 1e12; // Jan 1, 2001 approximately
  const maxValidTimestamp = 1e13 - 1; // Before year 2286

  return (
    Number.isInteger(timestamp) &&
    timestamp >= minValidTimestamp &&
    timestamp <= maxValidTimestamp
  );
}
