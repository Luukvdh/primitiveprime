/* eslint-disable no-redeclare */
// primitive-tools.ts

import { basename, dirname, extname } from "path/win32";

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
  clamp(min: number, max: number): number;
  times(fn: (i: number) => void): void;
  toStringWithLeadingZeros(length: number): string;
  toTimeCode(): string;
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
}

// ---------- OVERLOADS VOOR pkit(...) ----------

// ---------- TYPE VOOR HET CALLABLE PAKKET pkit ----------

export interface Pkit {
  (value: string): PrimeString;
  (value: number): PrimeNumber;
  <T>(value: T[]): PrimeArray<T>;
  <T extends Record<string, any>>(value: T): PrimeObject<T>;
  <T>(value: T): { unwrap(): T };

  // extra namespaces:
  math: typeof mathUtils;
  path: typeof pathkit;
}

// losse implementatie-functie
function pkitImpl(value: any): any {
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

    clamp(min: number, max: number) {
      return Math.min(Math.max(current, min), max);
    },

    times(fn: (i: number) => void) {
      for (let i = 0; i < current; i++) fn(i);
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
  };

  return api;
}

export interface PrimeObject<T extends Record<string, any> = Record<string, any>> {
  unwrap(): T;

  sortKeys(sorterFn?: ((a: string, b: string) => number) | null): PrimeObject<T>;

  keysMap(fn: (k: string, v: any) => [string, any]): PrimeObject<Record<string, any>>;

  valuesMap(fn: (v: any, k: string) => any): PrimeObject<Record<string, any>>;

  parseKeys(...keys: string[]): PrimeObject<T>;

  fill<U extends Record<string, any>>(source: U): PrimeObject<T & U>;
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

    fill<U extends Record<string, any>>(source: U) {
      for (const [key, value] of Object.entries(source)) {
        if (!(key in current)) {
          current[key] = value;
        }
      }
      return api as unknown as PrimeObject<T & U>;
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

const pkit = pkitImpl as Pkit;

// koppel de namespaces:
pkit.math = mathUtils;
pkit.path = pathkit;

// en dit is nu je default:
export default pkit;
