// src/primitives/primitives.d.ts
export {};

declare global {
  // ─── ARRAY PROTOTYPE ──────────────────────────────────────────────────────────
  interface Array<T> {
    first(n?: number): T | T[];
    last(n?: number): T | T[];
    unique(): T[];
    shuffle(): T[];
    sumByKey(key: string): number;
    findByKey(key: string, value: any): T | null;
    autoParseKeys(): T[];
    highestByKey(key: string): T | null;
    lowestByKey(key: string): T | null;
    sortByKey(key: string, ascending?: boolean): T[];
    sortByKeyName(key: string, ascending?: boolean): T[];
    groupBy(fn: (item: T) => string): Record<string, T[]>;
  }

  // ─── STRING PROTOTYPE ─────────────────────────────────────────────────────────
  interface String {
    toHsp(): string;
    reverse(): string;
    toTitleCase(): string;
    words(): string[];
    slashreverse(str: string): string;
    slashwin(): string;
    slashlinux(): string;
    strip(): string;
    containsAny(...arr: string[]): boolean;
    toSlug(): string;
    stripCompare(other: string): boolean;
    toWordCapitalized(): string;
    truncate(length: number, suffix?: string): string;
    isJson(): boolean;
    toCamelCase(): string;
    safeParseJson(): any;
    nullParseJson(): any | null;
    filenameCompare(otherPath: string): boolean;
    substringFrom(startStr?: string, stopStr?: string): string;
  }

  // ─── NUMBER PROTOTYPE ─────────────────────────────────────────────────────────
  interface Number {
    percentage(percent: number): number;
    isEven(): boolean;
    isOdd(): boolean;
    toFixedNumber(decimals?: number): number;
    between(min: number, max: number): boolean;
    clamp(min: number, max: number): number;
    times(fn: (i: number) => void): void;
    toStringWithLeadingZeros(length: number): string;
    toTimeCode(): string;
  }

  // ─── OBJECT STATIC + INSTANCE ─────────────────────────────────────────────────
  interface ObjectConstructor {
    keysMap(obj: Record<string, any>, fn: (k: string, v: any) => [string, any]): Record<string, any>;
    valuesMap(obj: Record<string, any>, fn: (v: any, k: string) => any): Record<string, any>;
    parseKeys(this: Record<string, any>, ...keys: string[]): Record<string, any>;
  }

  interface Object {
    sortKeys(sorterFn?: ((a: string, b: string) => number) | null): Record<string, any>;
  }

  // ─── MATH EXTENSIONS ──────────────────────────────────────────────────────────
  interface Math {
    randomRangeFloat(min: number, max: number): number;
    randomRangeInt(min: number, max: number): number;
    lerp(min: number, max: number, t: number): number;
    clamp(value: number, min: number, max: number): number;
    degToRad(degrees: number): number;
    radToDeg(radians: number): number;
    distance(x1: number, y1: number, x2: number, y2: number): number;
    roundTo(value: number, decimals?: number): number;
    isPowerOfTwo(value: number): boolean;
    nextPowerOfTwo(value: number): number;
    normalize(value: number, min: number, max: number): number;
    smoothStep(edge0: number, edge1: number, x: number): number;
    mix(x: number, y: number, a: number): number;
    mixColors(hex1: string, hex2: string, mixPerc: number): string;
  }

  // ─── GLOBAL HELPERS (zoals DOMUtils, pathShim) ────────────────────────────────
  var DOMUtils: {
    dom: Record<string, HTMLElement>;
    initIDs(): void;
    measureElement(el: HTMLElement): { width: number; height: number };
  };

  var path: {
    sep: string;
    normalize(p: string): string;
    join(...parts: string[]): string;
    basename(p: string): string;
    dirname(p: string): string;
    extname(p: string): string;
  };
}
