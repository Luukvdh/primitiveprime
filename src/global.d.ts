import type { Pkit } from "./dist/primitiveprimer";
declare global {
  // Globals exposed by IIFE bundles
  /** Global utilities instance provided by the library. */
  var pkit: Pkit;
  /** Apply prototype extensions to global objects. */
  var applyPrimitives: () => void;

  interface Array<T> {
    /** Return first element or first n elements. */
    first(n?: number): T | T[];
    /** Return last element or last n elements. */
    last(n?: number): T | T[];
    /** Find an item where `key` equals `value`. */
    findByKey<K extends keyof T & string>(key: K, value: any): T | null;
    /** Group items using a mapping function. */
    groupBy(fn: (item: T) => string): Record<string, T[]>;
    /** Group items by a property key. */
    groupBy<K extends keyof T & string>(key: K): Record<string, T[]>;
    /** Sum numeric values at the given key. */
    sumByKey<K extends keyof T & string>(key: K): number;
    /** Parse item string fields where applicable. */
    autoParseKeys(): T[];
    /** Return array with duplicates removed. */
    unique(): T[];
    /** Return a shuffled copy of the array. */
    shuffle(): T[];
    /** Return item with highest value for key or null. */
    highestByKey<K extends keyof T & string>(key: K): T | null;
    /** Return item with lowest value for key or null. */
    lowestByKey<K extends keyof T & string>(key: K): T | null;
    /** Sort array by key; ascending by default. */
    sortByKey<K extends keyof T & string>(key: K, ascending?: boolean): T[];
    /** Sort array by key name (string) with optional order. */
    sortByKeyName<K extends keyof T & string>(key: K, ascending?: boolean): T[];
    /** Map array to values of the given key. */
    mapByKey<K extends keyof T & string>(key: K): Array<T[K]>;
    /** Sum numeric values at key across objects. */
    sumKey(key: string): number;
    /** Average numeric values at key across objects. */
    averageKey(key: string): number;
    /** Filter by a key using predicate. */
    filterKey(key: string, pred: (v: any) => boolean): T[];
    /** Unique objects by key or projection function. */
    distinct(keyOrFn: string | ((x: T) => any)): T[];
    /** Group-reduce objects by key or projection. */
    aggregate<R>(keyOrFn: string | ((x: T) => any), reducer: (acc: R, cur: T) => R, init: R): Record<string, R>;
    /** Sum numeric values by key (string). */
    sumBy(key: string): number;
    /** Average numeric values by key (string). */
    averageBy(key: string): number;
    /** Sum all numeric values in the array. */
    sum(): number;
    /** Average all numeric values in the array. */
    average(): number;
    /** Return index of the highest number in the array. */
    indexOfHighestNumber(): number;
    /** Return index of the lowest number in the array. */
    indexOfLowestNumber(): number;
    /** Group-reduce objects by key or projection. */
    toTable(): Record<string, any[]>;
    /** Shuffle array with pattern using a seed for reproducibility. */
    seededShuffle(seed: number): T[];
  }

  interface String {
    /** Replace the file extension with `ext`. */
    changeExtension(ext: string): string;
    /** Return the string reversed. */
    reverse(): string;
    /** Convert the string to Title Case. */
    toTitleCase(): string;
    /** Split string into words. */
    words(): string[];
    /** Reverse slashes relative to `str`. */
    slashreverse(str: string): string;
    /** Convert slashes to Windows style. */
    slashwin(): string;
    /** Convert slashes to POSIX style. */
    slashlinux(): string;
    /** Trim whitespace from both ends. */
    strip(): string;
    /** Return true if contains any of the provided substrings. */
    containsAny(...arr: string[]): boolean;
    /** Create a URL/file-system safe slug. */
    toSlug(): string;
    /** Compare strings after stripping/normalizing. */
    stripCompare(other: string): boolean;
    /** Capitalize each word in the string. */
    toWordCapitalized(): string;
    /** Truncate to `length`, appending optional `suffix`. */
    truncate(length: number, suffix?: string): string;
    /** Return true if string contains valid JSON. */
    isJson(): boolean;
    /** Convert string to camelCase. */
    toCamelCase(): string;
    /** Parse JSON and return value or original on failure. */
    safeParseJson(): any;
    /** Parse JSON and return value or null on failure. */
    nullParseJson(): any | null;
    /** Compare two paths by filename only. */
    filenameCompare(otherPath: string): boolean;
    /** Return substring between optional start and stop markers. */
    substringFrom(startStr?: string, stopStr?: string): string;
    /** Escape HTML special characters. */
    escapeHTML(): string;
    /** Unescape HTML entities to characters. */
    unescapeHTML(): string;
    /** Humanize identifiers: split camelCase, replace dashes/underscores, capitalize sentences. */
    humanize(): string;
    /** Convert to underscore_case. */
    underscore(): string;
    /** True if trimmed string is empty. */
    isEmpty(): boolean;
    /** Count occurrences of substring; case sensitive by default. */
    countOccurrence(str2: string, caseSens?: boolean): number;
    /** True if string represents a number. */
    isNumber(): boolean;
    /** True if string represents a float. */
    isFloat(): boolean;
    /** True if string is alphanumeric. */
    isAlphaNumeric(): boolean;
    /** True if string is all lowercase (with letters present). */
    isLower(): boolean;
    /** True if string is all uppercase (with letters present). */
    isUpper(): boolean;
    /** Simple non-crypto hash (hex); optional truncate. */
    hashed(truncate?: number): string;
    /** Replace the last occurrence of search with replacement. */
    replaceLast(search: string | RegExp, replacement: string): string;
    /** Remove diacritics (latinize). */
    latinise(): string;
    /** Truncate with "..." to total width. */
    ellipsis(total: number): string;
    /** Extract a numeric value from the string. */
    toNumber(): number;
    /** Parse boolean from common truthy/falsey words. */
    toBoolean(): boolean;
  }

  interface Number {
    /** Calculate `percent` of the number. */
    percentage(percent: number): number;
    /** Return true if number is even. */
    isEven(): boolean;
    /** Return true if number is odd. */
    isOdd(): boolean;
    /** Like `toFixed` but returns a number. */
    toFixedNumber(decimals?: number): number;
    /** Check if number is between min and max (inclusive). */
    between(min: number, max: number): boolean;
    /** Clamp the number between min and max. */
    clamp(min: number, max: number): number;
    /** Run `fn` `n` times with index. */
    times(fn: (i: number) => void): void;
    /** Return string with leading zeros to reach `length`. */
    toStringWithLeadingZeros(length: number): string;
    /** Convert seconds/number to a timecode string. */
    toTimeCode(): string;
    /** Calculate what percent this number is of total. */
    percentOf(total: number): number;
    /** Calculate what ratio this number is of total. */
    ratioOf(total: number): number;
  }

  interface ObjectConstructor {
    /** Map object keys using `fn` into a new object. */
    keysMap(obj: Record<string, any>, fn: (k: string, v: any) => [string, any]): Record<string, any>;
    /** Map object values using `fn` into a new object. */
    valuesMap(obj: Record<string, any>, fn: (v: any, k: string) => any): Record<string, any>;
    /** Parse specified keys on `this` object and return new object. */
    parseKeys(this: Record<string, any>, ...keys: string[]): Record<string, any>;
    /** Shallow-merge `source` into `target` and return the result. */
    fill<T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U): T & U;
  }

  interface Object {
    /** Return a new object with keys sorted by `sorterFn`. */
    sortKeys(sorterFn?: ((a: string, b: string) => number) | null): Record<string, any>;
    /** Shallow structural equality by keys and types. */
    equals(other: Record<string, any>): boolean;
    /** Return object without specified keys. */
    omit(...keys: string[]): Record<string, any>;
    /** Return object containing only specified keys. */
    pick(...keys: string[]): Record<string, any>;
    /** Fill missing keys from source without overwriting existing. */
    complement(src: Record<string, any>): Record<string, any>;
    /** Remove empty string/null/undefined entries. */
    clean(): Record<string, any>;
    /** Ensure keys conform to schema; optional type coercion. */
    ensureSchema(schema: Record<string, any>, opts?: { coerce?: boolean }): Record<string, any>;
    /** Filter object entries by predicate. */
    filterEntries(predicate: (k: string, v: any) => boolean): Record<string, any>;
    /** Merge with another object; control array merge strategy. */
    merge(other: Record<string, any>, opts?: { arrayStrategy?: "concat" | "replace" | "unique" }): Record<string, any>;
  }

  interface PathShim {
    /** Platform path separator. */
    sep: string;
    /** Normalize path separators. */
    normalize(p: string): string;
    /** Join path segments. */
    join(...parts: string[]): string;
    /** Return basename of path. */
    basename(p: string): string;
    /** Return directory name of path. */
    dirname(p: string): string;
    /** Return extension of path. */
    extname(p: string): string;
  }

  // Global math utilities object attached by applyPrimitives()/global bundle
  interface MathUtils {
    /** Random float in [min, max). */
    randomRangeFloat(min: number, max: number): number;
    /** Random integer in [min, max]. */
    randomRangeInt(min: number, max: number): number;
    /** Linear interpolate between min and max by t. */
    lerp(min: number, max: number, t: number): number;
    /** Clamp value between min and max. */
    clamp(value: number, min: number, max: number): number;
    /** Convert degrees to radians. */
    degToRad(degrees: number): number;
    /** Convert radians to degrees. */
    radToDeg(radians: number): number;
    /** Euclidean distance between two points. */
    distance(x1: number, y1: number, x2: number, y2: number): number;
    /** Round value to `decimals` places. */
    roundTo(value: number, decimals?: number): number;
    /** Return true if value is a power of two. */
    isPowerOfTwo(value: number): boolean;
    /** Return next power of two >= value. */
    nextPowerOfTwo(value: number): number;
    /** Normalize value from [min,max] to [0,1]. */
    normalize(value: number, min: number, max: number): number;
    /** Smoothstep function between two edges. */
    smoothStep(edge0: number, edge1: number, x: number): number;
    /** Mix two numbers by factor `a`. */
    mix(x: number, y: number, a: number): number;
    /** Mix two hex colors by percentage. */
    mixColors(hex1: string, hex2: string, mixPerc: number): string;
  }
}
