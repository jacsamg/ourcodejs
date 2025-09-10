const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export function objectDeepAssign<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Record<string, unknown>>
): T {
  const t = target as Record<string, unknown>;

  sources.forEach((source) => {
    const s = source as Record<string, unknown>;

    Object.keys(s).forEach((key) => {
      const value = s[key];

      if (isPlainObject(value)) {
        if (!isPlainObject(t[key])) {
          t[key] = {};
        }

        // t[key] is now guaranteed to be a Record<string, unknown>
        objectDeepAssign(t[key] as Record<string, unknown>, value);
      } else if (Array.isArray(value)) {
        // shallow copy arrays
        t[key] = value.slice();
      } else {
        t[key] = value;
      }
    });
  });

  return target;
}
