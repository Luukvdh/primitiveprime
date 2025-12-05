// src/primitives/math.ts
export const mathUtils = {
  randomRangeFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  },
  randomRangeInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  lerp(min: number, max: number, t: number) {
    return min + (max - min) * t;
  },
  clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  },
  degToRad(deg: number) {
    return deg * (Math.PI / 180);
  },
  radToDeg(rad: number) {
    return rad * (180 / Math.PI);
  },
  distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.hypot(x2 - x1, y2 - y1);
  },
  roundTo(value: number, decimals = 2) {
    return Math.round(value * 10 ** decimals) / 10 ** decimals;
  },
  isPowerOfTwo(value: number) {
    return value > 0 && (value & (value - 1)) === 0;
  },
  nextPowerOfTwo(value: number) {
    return 2 ** Math.ceil(Math.log2(value));
  },
  normalize(value: number, min: number, max: number) {
    return (value - min) / (max - min);
  },
  smoothStep(edge0: number, edge1: number, x: number) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  },
  mix(x: number, y: number, a: number) {
    return x * (1 - a) + y * a;
  },
  mixColors(hex1: string, hex2: string, mixPerc: number) {
    const cleanHex = (h: string) => h.replace("#", "").padStart(6, "0");
    const [h1, h2] = [cleanHex(hex1), cleanHex(hex2)];
    const [r1, g1, b1] = [parseInt(h1.slice(0, 2), 16), parseInt(h1.slice(2, 4), 16), parseInt(h1.slice(4, 6), 16)];
    const [r2, g2, b2] = [parseInt(h2.slice(0, 2), 16), parseInt(h2.slice(2, 4), 16), parseInt(h2.slice(4, 6), 16)];
    const r = Math.round(this.mix(r1, r2, mixPerc));
    const g = Math.round(this.mix(g1, g2, mixPerc));
    const b = Math.round(this.mix(b1, b2, mixPerc));
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },
};

export function extendMathUtils() {
  if (!(globalThis as any).mathUtils) {
    (globalThis as any).mathUtils = mathUtils;
  }
  if (window !== undefined) {
    Object.assign(window, { mathUtils });
  }
}
