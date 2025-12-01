/* eslint-disable no-redeclare */
// primitivetools.ts

// Add it to pkit

// ---------- TYPES ----------

export interface PrimeString {
  unwrap(): string;

  setExt(ext: string): PrimeString;
  reverse(): PrimeString;
  toTitleCase(): PrimeString;
  words(): string[];

  slashreverse(): PrimeString;
  slashwin(): PrimeString;
  slashlinux(): PrimeString;

  strip(): PrimeString;
  containsAny(...arr: string[]): boolean;
  containsAnyOf(arr: string[]): boolean;
  containsAllOf(arr: string[]): boolean;
  compareScore(other: string): number;

  toSlug(): PrimeString;
  stripCompare(other: string): boolean;

  toWordCapitalized(): PrimeString;
  truncate(length: number, suffix?: string): PrimeString;

  isJson(): boolean;
  toCamelCase(): PrimeString;

  safeParseJson(): any;
  nullParseJson(): any | null;

  filenameCompare(otherPath: string): boolean;

  substringFrom(startStr?: string, stopStr?: string): string;
}

export interface PrimeNumber {
  unwrap(): number;

  percentage(percent: number): number;
  isEven(): boolean;
  isOdd(): boolean;
  toFixedNumber(decimals?: number): number;
  between(min: number, max: number): boolean;
  inRange(min: number, max: number): boolean;
  clamp(min: number, max: number): number;
  times(fn: (i: number) => void): void;
  runTillZero(fn: (i: number) => void): void;
  toStringWithLeadingZeros(length: number): string;
  toTimeCode(): string;
  NoN(): number | null;
  NumberOrNull(): number | null;

  // Unit conversions
  metersToMiles(): number;
  metersToInches(): number;
  centimetersToInches(): number;
  gallonsToLiters(): number;
  litersToGallons(): number;
}

export interface PrimeArray<T> {
  unwrap(): T[];

  first(n?: 1): T | undefined;
  first(n: number): T[];

  last(n?: 1): T | undefined;
  last(n: number): T[];

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

  filterHasKeys(...keys: string[]): T[];
  filterExactKeys(...keys: string[]): T[];
  filterObjectsLike(template: Partial<T>): T[];
  filterByKeyValue<K extends keyof T & string>(key: K, value: any): T[];

  difference(other: T[]): T[];
  intersection(other: T[]): T[];
  zip<U>(other: U[]): Array<[T, U]>;
}

// ---------- OVERLOADS VOOR pkit(...) ----------

// ---------- TYPE VOOR HET CALLABLE PAKKET pkit ----------

export interface Pkit {
  (value: string): PrimeString;
  (value: number): PrimeNumber;
  <T>(value: T[]): PrimeArray<T>;
  <T extends Record<string, any>>(value: T): PrimeObject<T>;
  <T>(value: T): { unwrap(): T };
  (): void;

  // extra namespaces:
  math: typeof mathUtils;
  path: typeof pathkit;
  help: string;
  attest: Attest;

  // utility functions:
  tryOrReturn<T>(fn: () => T, fallback: T, warnOnError?: Error): T;
  neverReturn<T>(fn: () => T, fallback: T, warnOnError?: Error): T; // Alias for tryOrReturn
}

function pkitImpl(value: any): any {
  if (value === undefined) {
    console.warn("pkit: undefined, null returned. See pkit.help for usage information. ");
    return null;
  }

  if (typeof value === "string") return createPrimeString(value);
  if (typeof value === "number") return createPrimeNumber(value);
  if (Array.isArray(value)) return createPrimeArray(value);
  if (value && typeof value === "object") return createPrimeObject(value);
  return { unwrap: () => value };
}
// ---------- IMPLEMENTATIES ----------

// STRING IMPLEMENTATIE (op basis van jouw eerdere methods)

function createPrimeString(initial: string): PrimeString {
  let current = initial;

  const api: PrimeString = {
    unwrap() {
      return current;
    },

    setExt(ext: string) {
      if (!ext) {
        return api;
      }
      if (!ext.startsWith(".")) {
        ext = "." + ext;
      }
      current = current.replace(/\.\w{1,5}$/i, ext);
      return api;
    },

    reverse() {
      current = current.split("").reverse().join("");
      return api;
    },

    toTitleCase() {
      current = current.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      return api;
    },

    words() {
      return current.match(/\b\w+\b/g) || [];
    },

    slashreverse() {
      current = current.replace(/[\\/]/g, (ch) => (ch === "\\" ? "/" : "\\"));
      return api;
    },

    slashwin() {
      current = current.replace(/[\\/]/g, "\\");
      return api;
    },

    slashlinux() {
      current = current.replace(/[\\/]/g, "/");
      return api;
    },

    strip() {
      current = current
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .trim();
      return api;
    },

    containsAny(...arr: string[]) {
      return arr.some((sub) => current.includes(sub));
    },

    containsAnyOf(arr: string[]) {
      return arr.some((sub) => current.includes(sub));
    },

    containsAllOf(arr: string[]) {
      return arr.every((sub) => current.includes(sub));
    },

    compareScore(other: string) {
      const s1 = current.toLowerCase();
      const s2 = other.toLowerCase();

      // Exact match
      if (s1 === s2) return 1.0;

      // Calculate similarity based on common characters
      const len1 = s1.length;
      const len2 = s2.length;
      const maxLen = Math.max(len1, len2);

      if (maxLen === 0) return 1.0;

      // Count matching characters in order
      let matches = 0;
      let i = 0,
        j = 0;

      while (i < len1 && j < len2) {
        if (s1[i] === s2[j]) {
          matches++;
          i++;
          j++;
        } else {
          i++;
        }
      }

      // Calculate score (0 to 1)
      return matches / maxLen;
    },

    toSlug() {
      current = current
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
      return api;
    },

    stripCompare(other: string) {
      const normalize = (s: string) =>
        s
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[\s_]/g, "")
          .trim();

      return normalize(current).includes(normalize(other));
    },

    toWordCapitalized() {
      current = current ? current.charAt(0).toUpperCase() + current.slice(1).toLowerCase() : "";
      return api;
    },

    truncate(length: number, suffix = "…") {
      current = current.length > length ? current.slice(0, length) + suffix : String(current);
      return api;
    },

    isJson() {
      try {
        JSON.parse(current);
        return true;
      } catch {
        return false;
      }
    },

    toCamelCase() {
      current = current.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace("-", "").replace("_", ""));
      return api;
    },

    safeParseJson() {
      try {
        return JSON.parse(current);
      } catch {
        return current;
      }
    },

    nullParseJson() {
      if (!current.trim()) return null;
      try {
        return JSON.parse(current);
      } catch {
        return null;
      }
    },

    filenameCompare(otherPath: string) {
      const normalize = (p: string) => p.replace(/\\/g, "/").split("/").pop()?.toLowerCase() ?? "";
      return normalize(current) === normalize(otherPath);
    },

    substringFrom(startStr?: string, stopStr?: string) {
      const s = String(current);
      if (!startStr) return s;
      const i = s.indexOf(startStr);
      if (i === -1) return "";
      const from = i + startStr.length;
      if (!stopStr) return s.slice(from);
      const j = s.indexOf(stopStr, from);
      return j === -1 ? s.slice(from) : s.slice(from, j);
    },
  };

  return api;
}

// NUMBER IMPLEMENTATION

function createPrimeNumber(initial: number): PrimeNumber {
  const current = initial;

  const api: PrimeNumber = {
    unwrap() {
      return current;
    },

    percentage(percent: number) {
      return (current * percent) / 100;
    },

    isEven() {
      return current % 2 === 0;
    },

    isOdd() {
      return current % 2 !== 0;
    },

    toFixedNumber(decimals = 2) {
      return parseFloat(current.toFixed(decimals));
    },

    between(min: number, max: number) {
      return current >= min && current <= max;
    },

    inRange(min: number, max: number) {
      return current >= min && current <= max;
    },

    clamp(min: number, max: number) {
      return Math.min(Math.max(current, min), max);
    },

    times(fn: (i: number) => void) {
      for (let i = 0; i < current; i++) fn(i);
    },

    runTillZero(fn: (i: number) => void) {
      for (let i = current; i >= 0; i--) fn(i);
    },

    toStringWithLeadingZeros(length: number) {
      return String(current).padStart(length, "0");
    },

    toTimeCode() {
      const totalSeconds = Math.floor(current);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad2 = (n: number) => String(n).padStart(2, "0");

      return `${hours}:${pad2(minutes)}:${pad2(seconds)}`;
    },

    NoN() {
      return isNaN(current) || !isFinite(current) ? null : current;
    },

    NumberOrNull() {
      return isNaN(current) || !isFinite(current) ? null : current;
    },

    // Unit conversions
    metersToMiles() {
      return current * 0.000621371;
    },

    metersToInches() {
      // 1 meter = 39.3701 inches
      return current * 39.3701;
    },

    centimetersToInches() {
      return current * 0.393701;
    },

    gallonsToLiters() {
      return current * 3.78541; // US gallons
    },

    litersToGallons() {
      return current * 0.264172; // US gallons
    },
  };

  return api;
}

// ARRAY IMPLEMENTATION

function createPrimeArray<T>(initial: T[]): PrimeArray<T> {
  const current = initial;

  const api: PrimeArray<T> = {
    unwrap() {
      return current;
    },

    first(n: number = 1): any {
      if (n === 1) return current[0];
      return current.slice(0, n);
    },

    last(n: number = 1): any {
      if (n === 1) return current[current.length - 1];
      return current.slice(-n);
    },

    findByKey(key: any, value: any): any {
      for (const item of current as any[]) {
        if (item && typeof item === "object" && item[key] === value) return item;
      }
      return null;
    },

    groupBy(fnOrKey: any): Record<string, T[]> {
      return (current as any[]).reduce((acc: any, item: any) => {
        const key = typeof fnOrKey === "function" ? fnOrKey(item) : item?.[fnOrKey];
        (acc[key] ||= []).push(item);
        return acc;
      }, {} as Record<string, T[]>);
    },

    sumByKey(key: any): number {
      return (current as any[]).reduce((acc, item) => {
        const v = item?.[key];
        return acc + (typeof v === "number" ? v : 0);
      }, 0);
    },

    autoParseKeys(): T[] {
      return (current as any[]).map((obj) => {
        if (obj && typeof obj === "object") {
          for (const key in obj) {
            if (typeof (obj as any)[key] === "string") {
              try {
                (obj as any)[key] = JSON.parse((obj as any)[key]);
              } catch {
                // laat waarde staan
              }
            }
          }
        }
        return obj;
      }) as T[];
    },

    unique(): T[] {
      return [...new Set(current)];
    },

    shuffle(): T[] {
      const arr = [...current];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    highestByKey(key: any): T | null {
      const arr = current as any[];
      if (!arr.length) return null;
      return arr.reduce((max: any, item: any) => (typeof item?.[key] === "number" && item[key] > (max?.[key] ?? -Infinity) ? item : max));
    },

    lowestByKey(key: any): T | null {
      const arr = current as any[];
      if (!arr.length) return null;
      return arr.reduce((min: any, item: any) => (typeof item?.[key] === "number" && item[key] < (min?.[key] ?? Infinity) ? item : min));
    },

    sortByKey(key: any, ascending = true): T[] {
      const arr = [...current] as any[];
      return arr.sort((a, b) => {
        const aVal = a?.[key] ?? 0;
        const bVal = b?.[key] ?? 0;
        return ascending ? aVal - bVal : bVal - aVal;
      });
    },

    sortByKeyName(key: any, ascending = true): T[] {
      const arr = [...current] as any[];
      return arr.sort((a, b) => {
        const aVal = String(a?.[key] ?? "");
        const bVal = String(b?.[key] ?? "");
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    },

    mapByKey(key: any): any[] {
      return (current as any[]).map((item) => (item && typeof item === "object" ? item[key] : undefined));
    },

    filterHasKeys(...keys: string[]): T[] {
      return (current as any[]).filter((item) => {
        if (!item || typeof item !== "object") return false;
        return keys.every((key) => key in item);
      });
    },

    filterExactKeys(...keys: string[]): T[] {
      return (current as any[]).filter((item) => {
        if (!item || typeof item !== "object") return false;
        const itemKeys = Object.keys(item);
        return itemKeys.length === keys.length && keys.every((key) => key in item);
      });
    },

    filterObjectsLike(template: Partial<T>): T[] {
      return (current as any[]).filter((item) => {
        if (!item || typeof item !== "object") return false;
        return Object.entries(template).every(([key, value]) => item[key] === value);
      });
    },

    filterByKeyValue(key: any, value: any): T[] {
      return (current as any[]).filter((item) => item && typeof item === "object" && item[key] === value);
    },

    difference(other: T[]): T[] {
      return current.filter((item) => !other.includes(item));
    },

    intersection(other: T[]): T[] {
      return current.filter((item) => other.includes(item));
    },

    zip<U>(other: U[]): Array<[T, U]> {
      const length = Math.min(current.length, other.length);
      const result: Array<[T, U]> = [];
      for (let i = 0; i < length; i++) {
        result.push([current[i], other[i]]);
      }
      return result;
    },
  };

  return api;
}

export interface PrimeObject<T extends Record<string, any> = Record<string, any>> {
  unwrap(): T;

  sortKeys(sorterFn?: ((a: string, b: string) => number) | null): PrimeObject<T>;

  keysMap(fn: (k: string, v: any) => [string, any]): PrimeObject<Record<string, any>>;

  valuesMap(fn: (v: any, k: string) => any): PrimeObject<Record<string, any>>;

  parseKeys(...keys: string[]): PrimeObject<T>;
  autoParseKeys(): PrimeObject<T>;
  parseJSONProperties(): PrimeObject<T>;

  fill<U extends Record<string, any>>(source: U): PrimeObject<T & U>;

  pick<K extends keyof T>(...keys: K[]): PrimeObject<Pick<T, K>>;
  omit<K extends keyof T>(...keys: K[]): PrimeObject<Omit<T, K>>;
}

function createPrimeObject<T extends Record<string, any>>(initial: T): PrimeObject<T> {
  let current = initial as any;

  const api: PrimeObject<T> = {
    unwrap() {
      return current as T;
    },

    sortKeys(sorterFn: ((a: string, b: string) => number) | null = null) {
      const entries = Object.entries(current);
      const sorted = entries.sort(([keyA], [keyB]) => (sorterFn ? sorterFn(keyA, keyB) : keyA.localeCompare(keyB)));
      current = Object.fromEntries(sorted);
      return api;
    },

    keysMap(fn: (k: string, v: any) => [string, any]) {
      current = Object.fromEntries(Object.entries(current).map(([k, v]) => fn(k, v)));
      return api as any;
    },

    valuesMap(fn: (v: any, k: string) => any) {
      current = Object.fromEntries(Object.entries(current).map(([k, v]) => [k, fn(v, k)]));
      return api as any;
    },

    parseKeys(...keys: string[]) {
      // Ik interpreteer je oude parseKeys als:
      // "probeer opgegeven keys te JSON-parsen in dit object zelf"
      for (const key of keys) {
        try {
          current[key] = JSON.parse(current[key]);
        } catch {
          // laat waarde zoals hij is
        }
      }
      return api;
    },

    autoParseKeys() {
      // Alias for parseJSONProperties for intuitive naming parity with arrays
      return api.parseJSONProperties();
    },

    parseJSONProperties() {
      for (const key in current) {
        const value = current[key];
        if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value);
            current[key] = parsed;
          } catch {
            // Not JSON, leave as is
          }
        }
      }
      return api;
    },

    fill<U extends Record<string, any>>(source: U) {
      for (const [key, value] of Object.entries(source)) {
        if (!(key in current)) {
          current[key] = value;
        }
      }
      return api as unknown as PrimeObject<T & U>;
    },

    pick<K extends keyof T>(...keys: K[]) {
      const picked = {} as Pick<T, K>;
      for (const key of keys) {
        if (key in current) {
          picked[key] = current[key];
        }
      }
      current = picked as any;
      return api as any;
    },

    omit<K extends keyof T>(...keys: K[]) {
      const omitted = { ...current };
      for (const key of keys) {
        delete omitted[key as string];
      }
      current = omitted;
      return api as any;
    },
  };

  return api;
}

//MATH KIT, HAS MORE MATH FUNCTIONS
const mathUtils = {
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
if (globalThis.Math) {
  Object.assign(mathUtils, globalThis.Math);
}

//PATH KIT SIMULATES NODEJS' PATH FUNCTIONS

const normalize = (p: string) => {
  return p.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
};
const sep = globalThis.process ? (globalThis.process.platform === "win32" ? "\\" : "/") : globalThis.window?.navigator.platform.startsWith("Win") ? "\\" : "/";

const pathkit = {
  sep,
  normalize,
  join: (...parts: string[]) => normalize(parts.filter(Boolean).join(sep)),
  basename: (p: string) => normalize(p).split("/").pop() || "",
  dirname: (p: string) => {
    const parts = normalize(p).split("/");
    parts.pop();
    return parts.length ? parts.join("/") : ".";
  },
  extname: (p: string) => {
    const b = normalize(p).split("/").pop() || "";
    const i = b.lastIndexOf(".");
    return i > 0 ? b.slice(i) : "";
  },
};

const help = `
  pkit - Wrapper for primitives with chainable methods

     Usage: pkit(value).method().unwrap()

  String methods:
  setExt, reverse, toTitleCase, words, slashreverse, slashwin, slashlinux,
  strip, containsAny, containsAnyOf, containsAllOf, compareScore, toSlug, 
  stripCompare, toWordCapitalized, truncate, isJson, toCamelCase, 
  safeParseJson, nullParseJson, filenameCompare, substringFrom

  Number methods:
  percentage, isEven, isOdd, toFixedNumber, between, inRange, clamp, times,
  runTillZero, toStringWithLeadingZeros, toTimeCode, NoN, NumberOrNull,
  metersToMiles, metersToInches, centimetersToInches, gallonsToLiters, 
  litersToGallons

  Array methods:
  first, last, findByKey, groupBy, sumByKey, autoParseKeys, unique, shuffle,
  highestByKey, lowestByKey, sortByKey, sortByKeyName, mapByKey,
  filterHasKeys, filterExactKeys, filterObjectsLike, filterByKeyValue,
  difference, intersection, zip

  Object methods:
  sortKeys, keysMap, valuesMap, parseKeys, parseJSONProperties, fill, pick, omit

  pkit.math utilities:
  randomRangeFloat, randomRangeInt, lerp, clamp, degToRad, radToDeg,
  distance, roundTo, isPowerOfTwo, nextPowerOfTwo, normalize, smoothStep, mix, mixColors

  pkit.path utilities:
  sep, normalize, join, basename, dirname, extname

  pkit.tryOrReturn(fn, fallback, warnOnError?) / pkit.neverReturn(...):
  Execute function safely, return fallback on error (never throws when warnOnError used)
  - If warnOnError is provided and matches error type: warn + return fallback
  - Otherwise: throw the error
  - neverReturn is an alias (TypeScript-friendly name)
  Example: pkit.tryOrReturn(() => JSON.parse(str), {}) → {} on any error
  Example: pkit.neverReturn(() => assert(x), null, new Error()) → warns on Error, throws others

  Examples:
  pkit("hello").toTitleCase().unwrap()  // "Hello"
  pkit(42).percentage(50)                // 21
  pkit([1,2,3]).shuffle()                // [3,1,2]
  pkit.math.randomRangeInt(1, 10)        // random 1-10
  pkit.path.basename("/path/to/file.txt") // "file.txt"

  STRING methods:
  setExt(ext)              - Change file extension
  reverse()                - Reverse string
  toTitleCase()            - "hello world" → "Hello World"
  words()                  - Extract words as array
  slashreverse()           - Swap \\ and /
  slashwin()               - Convert to Windows paths (\\)
  slashlinux()             - Convert to Linux paths (/)
  strip()                  - Remove accents, spaces, lowercase
  containsAny(...arr)      - Check if contains any of the strings
  containsAnyOf(arr)       - Check if contains any from array
  containsAllOf(arr)       - Check if contains all from array
  compareScore(other)      - Similarity score 0-1 (1 = exact match)
  toSlug()                 - "Hello World!" → "hello-world"
  stripCompare(other)      - Fuzzy compare (ignores accents/spaces)
  toWordCapitalized()      - "hello" → "Hello"
  truncate(len, suffix)    - Shorten with suffix (default "…")
  isJson()                 - Check if valid JSON
  toCamelCase()            - "hello-world" → "helloWorld"
  safeParseJson()          - Parse JSON or return original
  nullParseJson()          - Parse JSON or return null
  filenameCompare(path)    - Compare filenames (ignore path)
  substringFrom(start, stop) - Extract substring between markers.
  
  
  NUMBER methods:
  percentage(percent)      - Get percentage of number
  isEven()                 - Check if even
  isOdd()                  - Check if odd
  toFixedNumber(decimals)  - Round to decimals (returns number)
  between(min, max)        - Check if in range
  inRange(min, max)        - Alias for between
  clamp(min, max)          - Constrain to range
  times(fn)                - Execute function n times (0 to n-1)
  runTillZero(fn)          - Execute function from current number down to 0
  toStringWithLeadingZeros(len) - Pad with zeros
  toTimeCode()             - Convert seconds to "HH:MM:SS"
  NoN()                    - Return number or null if NaN/Infinite
  NumberOrNull()           - Same as NoN (full name)
  metersToMiles()          - Convert meters to miles
  metersToInches()         - Convert meters to inches
  centimetersToInches()    - Convert centimeters to inches
  gallonsToLiters()        - Convert US gallons to liters
  litersToGallons()        - Convert liters to US gallons
  
  ARRAY methods:
  first(n?)                - Get first element(s)
  last(n?)                 - Get last element(s)
  findByKey(key, value)    - Find object by property
  groupBy(key|fn)          - Group by property or function
  sumByKey(key)            - Sum numeric property
  autoParseKeys()          - Auto-parse JSON string properties
  unique()                 - Remove duplicates
  shuffle()                - Randomize order
  highestByKey(key)        - Find max by property
  lowestByKey(key)         - Find min by property
  sortByKey(key, asc?)     - Sort by numeric property
  sortByKeyName(key, asc?) - Sort by string property
  mapByKey(key)            - Extract property from all items
  filterHasKeys(...keys)   - Filter objects that have all specified keys
  filterExactKeys(...keys) - Filter objects with exactly these keys (no more, no less)
  filterObjectsLike(obj)   - Filter objects matching template values
  filterByKeyValue(key, val) - Filter objects where key equals value
  difference(other)        - Elements in this array but not in other
  intersection(other)      - Elements in both arrays
  zip(other)               - Combine arrays: [1,2].zip(['a','b']) → [[1,'a'],[2,'b']]
  
  OBJECT methods:
  sortKeys(sorterFn?)      - Sort object keys
  keysMap(fn)              - Transform keys
  valuesMap(fn)            - Transform values
  autoParseKeys()          - Auto-parse all string properties that contain JSON
  parseKeys(...keys)       - JSON parse specific keys
  parseJSONProperties()    - Auto-parse all string properties that are valid JSON
  fill(source)             - Add missing keys from source
  pick(...keys)            - Keep only specified keys
  omit(...keys)            - Remove specified keys

  ATTEST assertions (runtime type narrowing):
  pkit.attest.notNull(v)           - Assert value is not null (undefined allowed)
  pkit.attest.notNil(v)            - Assert value is neither null nor undefined
  pkit.attest.nonEmptyString(v)    - Assert string non-empty
  pkit.attest.nonEmptyArray(v)     - Assert array non-empty
  pkit.attest.isString(v)          - Assert typeof string
  pkit.attest.isNumber(v)          - Assert typeof number and not NaN
  pkit.attest.isBoolean(v)         - Assert typeof boolean
  pkit.attest.isArray(v)           - Assert Array.isArray
  pkit.attest.isObject(v)          - Assert plain object (not array/null)
  pkit.attest.hasKeys(obj,[...])   - Assert object contains listed keys
  pkit.attest.ensure(cond)         - Generic condition assert
  pkit.attest.nonZero(n)           - Assert number != 0
  pkit.attest.isPositiveOrZero(n)  - Assert number >= 0
  pkit.attest.lengthAtLeast(arr,n) - Assert array length >= n
  pkit.attest.allTruthy(arr)       - Assert every element truthy
  pkit.attest.allObjects(arr)      - Assert every element a plain object
  pkit.attest.allNumbers(arr)      - Assert every element a number
  pkit.attest.isInstanceOf(v,Ctor) - Assert v instanceof Ctor
  pkit.attest.jsonCompare(a,b)     - Assert structural JSON equality

  Each throws AssertError (globalThis.AssertError) on failure for easy catch.
  These functions use 'asserts' so TypeScript narrows types after successful calls.
`;

// ---- Attest (runtime assertions for TS narrowing) ----
// Error class exposed globally (only defined if absent)
class AssertError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "AssertError";
  }
}
// Attach to globalThis if not already present (avoid overwriting)
// Use any cast to avoid TS complaints when augmenting global.
if (!(globalThis as any).AssertError) {
  (globalThis as any).AssertError = AssertError;
}

export interface Attest {
  AssertError: typeof AssertError;
  notNull<T>(value: T | null, message?: string): asserts value is T; // only excludes null
  notNil<T>(value: T | null | undefined, message?: string): asserts value is NonNullable<T>; // excludes null and undefined
  nonEmptyString(value: any, message?: string): asserts value is string;
  nonEmptyArray<T>(value: T[] | null | undefined, message?: string): asserts value is [T, ...T[]];
  isString(value: any, message?: string): asserts value is string;
  isNumber(value: any, message?: string): asserts value is number;
  isBoolean(value: any, message?: string): asserts value is boolean;
  isArray<T = any>(value: any, message?: string): asserts value is T[];
  isObject<T extends Record<string, any> = Record<string, any>>(value: any, message?: string): asserts value is T;
  hasKeys<K extends string>(obj: any, keys: K[], message?: string): asserts obj is Record<K, any>;
  ensure(condition: any, message?: string): asserts condition;
  nonZero(value: any, message?: string): asserts value is number;
  isPositiveOrZero(value: any, message?: string): asserts value is number;
  lengthAtLeast<T>(value: T[] | null | undefined, min: number, message?: string): asserts value is T[];
  allTruthy<T>(value: T[] | null | undefined, message?: string): asserts value is T[];
  allObjects<T extends Record<string, any> = Record<string, any>>(value: any, message?: string): asserts value is T[];
  allNumbers(value: any, message?: string): asserts value is number[];
  isInstanceOf<T>(value: any, ctor: new (...args: any) => T, message?: string): asserts value is T;
  jsonCompare<T>(a: T, b: T, message?: string): asserts a is T; // asserts equality
}

function stableStringify(obj: any): string {
  return JSON.stringify(obj, function (_key, value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((acc, k) => {
          acc[k] = (value as any)[k];
          return acc;
        }, {} as Record<string, any>);
    }
    return value;
  });
}

const attest: Attest = {
  AssertError,
  notNull(value: any, message?: string): asserts value is any {
    if (value === null) throw new AssertError(message || "Expected value not to be null");
  },
  notNil(value: any, message?: string): asserts value is NonNullable<any> {
    if (value === null || value === undefined) throw new AssertError(message || "Expected value not to be null/undefined");
  },
  nonEmptyString(value: any, message?: string): asserts value is string {
    if (typeof value !== "string" || value.length === 0) throw new AssertError(message || "Expected non-empty string");
  },
  nonEmptyArray(value: any, message?: string): asserts value is [any, ...any[]] {
    if (!Array.isArray(value) || value.length === 0) throw new AssertError(message || "Expected non-empty array");
  },
  isString(value: any, message?: string): asserts value is string {
    if (typeof value !== "string") throw new AssertError(message || "Expected string");
  },
  isNumber(value: any, message?: string): asserts value is number {
    if (typeof value !== "number" || Number.isNaN(value)) throw new AssertError(message || "Expected number");
  },
  isBoolean(value: any, message?: string): asserts value is boolean {
    if (typeof value !== "boolean") throw new AssertError(message || "Expected boolean");
  },
  isArray(value: any, message?: string): asserts value is any[] {
    if (!Array.isArray(value)) throw new AssertError(message || "Expected array");
  },
  isObject(value: any, message?: string): asserts value is Record<string, any> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) throw new AssertError(message || "Expected plain object");
  },
  hasKeys(obj: any, keys: string[], message?: string): asserts obj is Record<string, any> {
    if (obj === null || typeof obj !== "object") throw new AssertError(message || "Expected object for hasKeys");
    for (const k of keys) {
      if (!(k in obj)) throw new AssertError(message || `Missing required key '${k}'`);
    }
  },
  ensure(condition: any, message?: string): asserts condition {
    if (!condition) throw new AssertError(message || "Assertion failed (ensure)");
  },
  nonZero(value: any, message?: string): asserts value is number {
    if (typeof value !== "number" || Number.isNaN(value) || value === 0) throw new AssertError(message || "Expected non-zero number");
  },
  isPositiveOrZero(value: any, message?: string): asserts value is number {
    if (typeof value !== "number" || Number.isNaN(value) || value < 0) throw new AssertError(message || "Expected positive or zero number");
  },
  lengthAtLeast(value: any, min: number, message?: string): asserts value is any[] {
    if (!Array.isArray(value) || value.length < min) throw new AssertError(message || `Expected array length >= ${min}`);
  },
  allTruthy(value: any, message?: string): asserts value is any[] {
    if (!Array.isArray(value) || value.some((v) => !v)) throw new AssertError(message || "Expected all elements to be truthy");
  },
  allObjects(value: any, message?: string): asserts value is Record<string, any>[] {
    if (!Array.isArray(value) || value.some((v) => v === null || typeof v !== "object" || Array.isArray(v))) throw new AssertError(message || "Expected all elements to be plain objects");
  },
  allNumbers(value: any, message?: string): asserts value is number[] {
    if (!Array.isArray(value) || value.some((v) => typeof v !== "number" || Number.isNaN(v))) throw new AssertError(message || "Expected all elements to be numbers");
  },
  isInstanceOf(value: any, ctor: new (...args: any) => any, message?: string): asserts value is any {
    if (!(value instanceof ctor)) throw new AssertError(message || `Expected value to be instance of ${(ctor && ctor.name) || "provided constructor"}`);
  },
  jsonCompare(a: any, b: any, message?: string): asserts a is any {
    if (stableStringify(a) !== stableStringify(b)) throw new AssertError(message || "Expected JSON structures to be equal");
  },
};

const pkit = pkitImpl as Pkit;

// koppel de namespaces:
pkit.math = mathUtils;
pkit.path = pathkit;
pkit.help = help;
pkit.attest = attest;

// utility function for safe execution with fallback
pkit.tryOrReturn = function <T>(fn: () => T, fallback: T, warnOnError?: Error): T {
  try {
    return fn();
  } catch (error) {
    // If warnOnError is provided and error is an instance of that Error class, just warn
    if (warnOnError && error instanceof warnOnError.constructor) {
      console.warn("pkit.tryOrReturn:", error);
      return fallback;
    }
    // Otherwise, re-throw the error
    throw error;
  }
};

// TypeScript-friendly alias: signals this will never return (throw) an error
pkit.neverReturn = pkit.tryOrReturn;

// eventueel named exports laten bestaan (handig als je ze los wilt importeren)
export { mathUtils as mathkit, pathkit };

// en dit is nu je default:
export default pkit;
