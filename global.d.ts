export {};

declare global {
  // Globals exposed by IIFE bundles
  var pkit: import("./dist/primitiveprimer").Pkit;
  var applyPrimitives: () => void;

  interface Array<T> {
    first(n?: number): T | T[];
    last(n?: number): T | T[];
    findByKey<K extends keyof T & string>(key: K, value: any): T | null;
    groupBy(fn: (item: T) => string): Record<string, T[]>;
    groupBy<K extends keyof T & string>(key: K): Record<string, T[]>;
    sumByKey<K extends keyof T & string>(key: K): number;
    autoParseKeys(): T[];
    unique(): T[];
    shuffle(): T[];
    highestByKey<K extends keyof T & string>(key: K): T | null;
    lowestByKey<K extends keyof T & string>(key: K): T | null;
    sortByKey<K extends keyof T & string>(key: K, ascending?: boolean): T[];
    sortByKeyName<K extends keyof T & string>(key: K, ascending?: boolean): T[];
    mapByKey<K extends keyof T & string>(key: K): Array<T[K]>;
  }

  interface String {
    changeExtension(ext: string): string;
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

  interface ObjectConstructor {
    keysMap(obj: Record<string, any>, fn: (k: string, v: any) => [string, any]): Record<string, any>;
    valuesMap(obj: Record<string, any>, fn: (v: any, k: string) => any): Record<string, any>;
    parseKeys(this: Record<string, any>, ...keys: string[]): Record<string, any>;
    fill<T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U): T & U;
  }

  interface Object {
    sortKeys(sorterFn?: ((a: string, b: string) => number) | null): Record<string, any>;
  }

  var path: {
    sep: string;
    normalize(p: string): string;
    join(...parts: string[]): string;
    basename(p: string): string;
    dirname(p: string): string;
    extname(p: string): string;
  };

  // Global math utilities object attached by applyPrimitives()/global bundle
  var mathUtils: {
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
  };
}
