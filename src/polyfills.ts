export function applyPolyfills() {
  if (!Object.fromEntries) {
    Object.fromEntries = function <T>(
      entries: Iterable<readonly [PropertyKey, T]>
    ) {
      const obj: Record<string, T> = {};
      for (const [k, v] of entries) obj[String(k)] = v;
      return obj;
    };
  }

  if (!(Math as any).randomRangeFloat) {
    (Math as any).randomRangeFloat = (min: number, max: number) =>
      Math.random() * (max - min) + min;
  }
  if (!(Math as any).randomRangeInt) {
    (Math as any).randomRangeInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
  }
  if (!(Math as any).lerp) {
    (Math as any).lerp = (min: number, max: number, t: number) =>
      min + (max - min) * t;
  }
}
