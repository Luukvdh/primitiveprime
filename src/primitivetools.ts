/* eslint-disable no-redeclare */
// primitivetools.ts

import { objectMethods } from "./object.js";
import { stringMethods } from "./string.js";
import { numberMethods } from "./number.js";
import { arrayMethods } from "./array.js";
import { mathUtilsObj } from "./math.js";

// Add it to pkit

// ---------- TYPES ----------
/* eslint-disable no-redeclare */
// primitive-tools.ts
// ---------- TYPES ----------

export interface PrimeString {
  changeExtension(ext: string): string;
  reverse(): string;
  toTitleCase(): string;

  words(): string[]; // lezer → normaal type

  slashreverse(): string;
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
export interface PrimeNumber {
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

export interface PrimeArray<T> {
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
  /** Convert array of objects to column table map. */
  toTable(): Record<string, any[]>;
  /** Sum numeric values by key (string). */
  sumBy(key: string): number;
  /** Average numeric values by key (string). */
  averageBy(key: string): number;
}

// ---------- OVERLOADS VOOR pkit(...) ----------

// ---------- TYPE VOOR HET CALLABLE PAKKET pkit ----------

export interface Pkit {
  (value: undefined): string;
  (value: string): PrimeString;
  (value: number): PrimeNumber;
  <T>(value: T[]): PrimeArray<T>;
  (value: Record<string, any>): PrimeObject;
  <T>(value: T): { unwrap(): T };

  // extra namespaces:
  math: MathUtils;
  path: PathShim;
}

// losse implementatie-functie
const pkitImpl = (value: any): any => {
  if (typeof value === "string") return createPrimeString(value);
  if (typeof value === "number") return createPrimeNumber(value);
  if (Array.isArray(value)) return createPrimeArray(value);
  if (value && typeof value === "object") return createPrimeObject(value);
  if (value === null) return false;
  if (typeof value === "undefined") return null;
  if (typeof value === "function") return pkitImpl(value());
};
// ---------- IMPLEMENTATIES ----------

// STRING IMPLEMENTATIE (op basis van jouw eerdere methods)

function createPrimeString(value: string): PrimeString {
  let current = value;

  return Object.fromEntries(
    stringMethods.map(([name, fn]) => {
      return [
        name,
        function (...args: any[]) {
          current = fn.apply(current, args);
          return current;
        },
      ];
    })
  ) as unknown as PrimeString;
}

// NUMBER IMPLEMENTATION

function createPrimeNumber(initial: number): PrimeNumber {
  let current = initial;
  let result: number | void | string | boolean;
  return Object.fromEntries(
    numberMethods.map(([name, fn]) => {
      return [
        name,
        function (...args: any[]): number | void | string | boolean {
          result = fn.apply(current, args);

          return result;
        },
      ];
    })
  ) as unknown as PrimeNumber;
}

// ARRAY IMPLEMENTATION

function createPrimeArray<T extends any[]>(initial: T): PrimeArray<T> {
  let current = initial;
  let result: any = null;
  return Object.fromEntries(
    arrayMethods.map(([name, fn]) => {
      return [
        name,
        function (...args: T[]) {
          result = fn.apply(current, args);
          return result;
        },
      ];
    })
  ) as unknown as PrimeArray<T>;
}

export interface PrimeObject {
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

function createPrimeObject<T extends Record<string, any>>(initial: T): PrimeObject {
  let current = initial as any;

  return Object.fromEntries(
    objectMethods.map(([name, fn]) => {
      return [
        name,
        function (...args: any[]) {
          current = fn.apply(current, args);
          return current;
        },
      ];
    })
  ) as unknown as PrimeObject;
}

//PATH KIT SIMULATES NODEJS' PATH FUNCTIONS

const normalize = (p: string) => {
  return p.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
};
const sep = (globalThis as any).process ? ((globalThis as any).process.platform === "win32" ? "\\" : "/") : globalThis.window?.navigator.platform.startsWith("Win") ? "\\" : "/";

const pathkit: PathShim = {
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

const pkit = pkitImpl as Pkit;
pkit.math = mathUtilsObj;
pkit.path = pathkit;

// eventueel named exports laten bestaan (handig als je ze los wilt importeren)
export { mathUtilsObj as mathkit, pathkit };
// en dit is nu je default:
export default pkit;
