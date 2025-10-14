const isPlainObject = (v: unknown): v is Record<PropertyKey, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export function objectDeepAssign<T extends Record<PropertyKey, unknown>>(
  target: T,
  ...sources: Array<Record<PropertyKey, unknown>>
): T {
  const t = target as Record<PropertyKey, unknown>;

  sources.forEach((source) => {
    const s = source as Record<PropertyKey, unknown>;

    Object.keys(s).forEach((key) => {
      const value = s[key];

      if (isPlainObject(value)) {
        if (!isPlainObject(t[key])) {
          t[key] = {};
        }

        // t[key] is now guaranteed to be a Record<PropertyKey, unknown>
        objectDeepAssign(t[key] as Record<PropertyKey, unknown>, value);
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
