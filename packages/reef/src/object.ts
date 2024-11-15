export function objectDeepAssign(target: Record<any, any>, ...sources: Record<any, any>[]): any {
  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      const value = source[key];

      if (value && typeof value === 'object') {
        if (!Array.isArray(value)) {
          if (!target[key] || typeof target[key] !== 'object') {
            target[key] = {};
          }

          objectDeepAssign(target[key], value);
        } else {
          target[key] = [...value];
        }
      } else {
        target[key] = value;
      }
    });
  });

  return target;
}