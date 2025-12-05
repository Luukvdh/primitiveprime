// src/primitives/array.ts

declare type arrayMethod = [string, (this: any[], ...args: any[]) => any];
declare type arrayOfObjectsMethod = arrayMethod & [string, <T extends Record<string, any>>(this: T[], ...args: any[]) => any];

const assertIsObjectArray = (arr: any): arr is Record<string, any>[] => Array.isArray(arr) && arr.every((item) => typeof item === "object" && item !== null);
const assertIsArrayOfType = (arr: any, type: string): arr is Record<string, unknown>[] => Array.isArray(arr) && arr.every((item) => typeof item === type && item !== null);

export const arrayMethods = [
  [
    "first",
    function (this: any[], n = 1): any[] {
      return n === 1 ? this[0] : this.slice(0, n);
    },
  ] as arrayMethod,
  [
    "last",
    function (this: any[], n = 1): any[] {
      return n === 1 ? this[this.length - 1] : this.slice(-n);
    },
  ] as arrayMethod,
  [
    "findByKey",
    function <T extends Record<string, any>>(this: T[], key: string, value: any): T | null {
      if (!assertIsObjectArray(this)) return null;
      for (const item of this) if (item[key] === value) return item;
      return null;
    },
  ] as arrayOfObjectsMethod,
  [
    "groupBy",
    function (this: any[], fn: (item: any) => string): Record<string, any[]> {
      return this.reduce((acc: any, item) => {
        const key = typeof fn === "function" ? fn(item) : item[fn];
        (acc[key] ||= []).push(item);
        return acc;
      }, {});
    },
  ] as arrayMethod,
  [
    "sumByKey",
    function <T extends Record<string, any>>(this: T[], key: string): number {
      if (!assertIsObjectArray(this)) return 0;
      return this.reduce((acc, item) => acc + (typeof item[key] === "number" ? item[key] : 0), 0);
    },
  ] as arrayOfObjectsMethod,
  [
    "autoParseKeys",
    function <T extends Record<string, any>>(this: T[]): T[] {
      if (!assertIsObjectArray(this)) return [];
      return this.map((obj) => {
        if (obj && typeof obj === "object") {
          for (const key in obj) {
            if (typeof obj[key] === "string") {
              try {
                obj[key] = JSON.parse(obj[key]);
              } catch {}
            }
          }
        }
        return obj;
      });
    },
  ] as arrayOfObjectsMethod,
  [
    "unique",
    function <T>(this: T[]): T[] {
      return [...new Set(this)];
    },
  ] as arrayMethod,
  [
    "shuffle",
    function <T>(this: T[]): T[] {
      const arr = [...this];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
  ] as arrayMethod,
  [
    "highestByKey",
    function <T extends Record<string, any>>(this: T[], key: string): T | null {
      if (!assertIsObjectArray(this)) return null;
      if (!this.length) return null;
      return this.reduce((max, item) => (typeof item[key] === "number" && item[key] > (max?.[key] ?? -Infinity) ? item : max));
    },
  ] as arrayOfObjectsMethod,
  [
    "lowestByKey",
    function <T extends Record<string, any>>(this: T[], key: string): T | null {
      if (!assertIsObjectArray(this)) return null;
      if (!this.length) return null;
      return this.reduce((min, item) => (typeof item[key] === "number" && item[key] < (min?.[key] ?? Infinity) ? item : min));
    },
  ] as arrayOfObjectsMethod,
  [
    "sortByKey",
    function <T extends Record<string, any>>(this: T[], key: string, ascending = true): T[] {
      if (!assertIsObjectArray(this)) return [];
      return [...this].sort((a, b) => {
        const aVal = a[key] ?? 0;
        const bVal = b[key] ?? 0;
        return ascending ? aVal - bVal : bVal - aVal;
      });
    },
  ] as arrayOfObjectsMethod,
  [
    "sortByKeyName",
    function <T extends Record<string, any>>(this: T[], key: string, ascending = true): T[] {
      if (!assertIsObjectArray(this)) return [];
      return [...this].sort((a, b) => {
        const aVal = String(a[key] ?? "");
        const bVal = String(b[key] ?? "");
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    },
  ] as arrayOfObjectsMethod,
  [
    "mapByKey",
    function <T extends Record<string, any>, K extends keyof T>(this: T[], key: K): Array<T[K]> {
      if (!assertIsObjectArray(this)) return [];
      return this.map((item) => (item && typeof item === "object" ? item[key] : undefined)) as Array<T[K]>;
    },
  ] as arrayOfObjectsMethod,
  [
    "sumKey",
    function <T extends Record<string, any>>(this: T[], key: string) {
      if (!assertIsObjectArray(this)) return 0;
      if (
        !assertIsArrayOfType(
          this.map((item) => item[key]),
          "number"
        )
      )
        return 0;
      return this.reduce((acc, cur) => acc + (parseFloat(String(cur[key])) || 0), 0);
    },
  ] as arrayOfObjectsMethod,
  [
    "averageKey",
    function <T extends Record<string, any>>(this: T[], key: string) {
      if (!assertIsObjectArray(this)) return 0;
      if (
        !assertIsArrayOfType(
          this.map((item) => item[key]),
          "number"
        )
      )
        return 0;
      let total = 0,
        count = 0;
      for (const cur of this) {
        const v = parseFloat(String(cur[key]));
        if (!Number.isNaN(v)) {
          total += v;
          count++;
        }
      }
      return count ? total / count : 0;
    },
  ] as arrayOfObjectsMethod,
  [
    "filterKey",
    function <T extends Record<string, any>>(this: T[], key: string, pred: (v: any) => boolean) {
      if (!assertIsObjectArray(this)) return 0;
      return this.filter((item) => pred(item[key]));
    },
  ] as arrayOfObjectsMethod,
  [
    "distinct",
    function <T extends Record<string, any>>(this: T[], keyOrFn: string | ((x: T) => any)) {
      if (!assertIsObjectArray(this)) return 0;
      const seen = new Set<any>();
      const getKey = typeof keyOrFn === "function" ? keyOrFn : (x: T) => x[keyOrFn];
      const out: T[] = [];
      for (const item of this) {
        const k = getKey(item);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(item);
        }
      }
      return out;
    },
  ] as arrayOfObjectsMethod,
  [
    "aggregate",
    function <T extends Record<string, any>, R>(this: T[], keyOrFn: string | ((x: T) => any), reducer: (acc: R, cur: T) => R, init: R) {
      if (!assertIsObjectArray(this)) return 0;
      const getKey = typeof keyOrFn === "function" ? keyOrFn : (x: T) => x[keyOrFn];
      const groups = new Map<any, R>();
      for (const item of this) {
        const k = getKey(item);
        const acc = groups.has(k) ? groups.get(k)! : init;
        groups.set(k, reducer(acc, item));
      }
      const out: Record<string, R> = {} as any;
      for (const [k, v] of groups.entries()) (out as any)[k] = v;
      return out;
    },
  ] as arrayOfObjectsMethod,
  [
    "toTable",
    function <T extends Record<string, any>>(this: T[]) {
      if (!assertIsObjectArray(this)) return 0;
      const out: Record<string, any[]> = {};
      for (const item of this) {
        for (const [k, v] of Object.entries(item)) {
          (out[k] ??= []).push(v);
        }
      }
      return out;
    },
  ] as arrayOfObjectsMethod,
  [
    "sumBy",
    function <T extends Record<string, any>>(this: T[], key: string) {
      if (!assertIsObjectArray(this)) return 0;
      if (
        !assertIsArrayOfType(
          this.map((item) => item[key]),
          "number"
        )
      )
        return 0;
      return this.reduce((acc, cur) => {
        const v = parseFloat(String(cur[key]));
        return acc + (Number.isNaN(v) ? 0 : v);
      }, 0);
    },
  ] as arrayOfObjectsMethod,
  [
    "averageBy",
    function <T extends Record<string, any>>(this: T[], key: string) {
      if (!assertIsObjectArray(this)) return 0;
      if (
        !assertIsArrayOfType(
          this.map((item) => item[key]),
          "number"
        )
      )
        return 0;
      let total = 0,
        count = 0;
      for (const cur of this) {
        const v = parseFloat(String(cur[key]));
        if (!Number.isNaN(v)) {
          total += v;
          count++;
        }
      }
      return count ? total / count : 0;
    },
  ] as arrayOfObjectsMethod,
  [
    "sum",
    function (this: number[]): number {
      assertIsArrayOfType(this, "number");
      return this.reduce((acc, cur) => acc + cur, 0);
    },
  ] as arrayOfObjectsMethod,
  [
    "average",
    function (this: number[]): number {
      assertIsArrayOfType(this, "number");
      let total = 0,
        count = 0;
      for (const num of this) {
        if (typeof num === "number" && !Number.isNaN(num)) {
          total += num;
          count++;
        }
      }
      return count ? total / count : 0;
    },
  ] as arrayMethod,
] as arrayMethod[];

export function extendArray() {
  for (const method of arrayMethods) {
    Object.defineProperty(Object.prototype, method[0], {
      value: method[1],
      writable: true,
      configurable: true,
    });
  }
}
