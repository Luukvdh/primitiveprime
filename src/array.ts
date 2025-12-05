// src/primitives/array.ts
declare type arrayMethod = [string, (this: any[], ...args: any[]) => any];
declare type arrayOfObjectsMethod = arrayMethod & [string, <T extends Record<string, any>>(this: T[], ...args: any[]) => any];

const assertIsObjectArray: (arr: any) => asserts arr is Record<string, any>[] = (arr: any): asserts arr is Record<string, any>[] => {
  if (Array.isArray(arr) && arr.every((item) => typeof item === "object" && item !== null)) {
    return undefined;
  }
  throw new Error("not an array of objects");
};
const assertIsArrayOfStrings: (arr: any) => asserts arr is string[] = (arr: any): asserts arr is string[] => {
  if (arr.every((x: unknown) => typeof x === "string")) {
    return undefined;
  }
  throw new Error("not an array of strings");
};
const assertIsArrayOfNumbers: (arr: any) => asserts arr is number[] = (arr: any): asserts arr is number[] => {
  if (arr.every((x: unknown) => typeof x === "number")) {
    return undefined;
  }
  throw new Error("not an array of numbers");
};

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
      assertIsObjectArray(this);
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
      assertIsObjectArray(this);
      return this.reduce((acc, item) => acc + (typeof item[key] === "number" ? item[key] : 0), 0);
    },
  ] as arrayOfObjectsMethod,
  [
    "autoParseKeys",
    function <T extends Record<string, any>>(this: T[]): T[] {
      assertIsObjectArray(this);
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
    function <T extends Record<string, any>>(this: T[], key: string): T | -1 {
      try {
        assertIsObjectArray(this);
        assertIsArrayOfNumbers(this.map((item) => item[key]));

        this.length;
        return this.reduce((max, item) => (typeof item[key] === "number" && item[key] > (max?.[key] ?? -Infinity) ? item : max));
      } catch (e) {
        console.error("not an numberarray in object", e);
        return -1;
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "lowestByKey",
    function <T extends Record<string, any>>(this: T[], key: string): T | -1 {
      try {
        assertIsObjectArray(this);
        assertIsArrayOfNumbers(this.map((item) => item[key]));
        return this.reduce((min, item) => (typeof item[key] === "number" && item[key] < (min?.[key] ?? Infinity) ? item : min));
      } catch (e) {
        console.error("not an objectArray", e);
        return -1;
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "sortByKey",
    function <T extends Record<string, any>>(this: T[], key: string, ascending = true): T[] {
      try {
        assertIsObjectArray(this);
        return [...this].sort((a, b) => {
          const aVal = a[key] ?? 0;
          const bVal = b[key] ?? 0;
          return ascending ? aVal - bVal : bVal - aVal;
        });
      } catch (e) {
        console.error("not an objectArray", e);
        return [];
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "sortByKeyName",
    function <T extends Record<string, any>>(this: T[], key: string, ascending = true): T[] {
      try {
        assertIsObjectArray(this);
        return [...this].sort((a, b) => {
          const aVal = String(a[key] ?? "");
          const bVal = String(b[key] ?? "");
          return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
      } catch (e) {
        console.error("not an objectArray", e);
        return [];
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "mapByKey",
    function <T extends Record<string, any>, K extends keyof T>(this: T[], key: K): Array<T[K]> {
      assertIsObjectArray(this);
      return this.map((item) => (item && typeof item === "object" ? item[key] : undefined)) as Array<T[K]>;
    },
  ] as arrayOfObjectsMethod,
  [
    "sumKey",
    function <T extends Record<string, any>>(this: T[], key: string) {
      try {
        assertIsObjectArray(this);
        assertIsArrayOfNumbers(this.map((item) => item[key]));

        return this.reduce((acc, cur) => acc + (parseFloat(String(cur[key])) || 0), 0);
      } catch (e) {
        console.error("not an numberarray in object", e);
        return 0;
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "averageKey",
    function <T extends Record<string, any>>(this: T[], key: string) {
      try {
        assertIsObjectArray(this);
        assertIsArrayOfNumbers(this.map((item) => item[key]));

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
      } catch (e) {
        console.error("not an numberarray in object", e);
        return 0;
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "filterKey",
    function <T extends Record<string, any>>(this: T[], key: string, pred: (v: any) => boolean) {
      try {
        assertIsObjectArray(this);
        return this.filter((item) => pred(item[key]));
      } catch (e) {
        console.error("not an objectArray", e);
        return [];
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "distinct",
    function <T extends Record<string, any>>(this: T[], keyOrFn: string | ((x: T) => any)) {
      try {
        assertIsObjectArray(this);
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
      } catch (e) {
        console.error("not an objectArray", e);
        return [];
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "aggregate",
    function <T extends Record<string, any>, R>(this: T[], keyOrFn: string | ((x: T) => any), reducer: (acc: R, cur: T) => R, init: R) {
      try {
        assertIsObjectArray(this);
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
      } catch (e) {
        console.error("not an objectArray", e);
        return {};
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "toTable",
    function <T extends Record<string, any>>(this: T[]) {
      try {
        assertIsObjectArray(this);
        const out: Record<string, any[]> = {};
        for (const item of this) {
          for (const [k, v] of Object.entries(item)) {
            (out[k] ??= []).push(v);
          }
        }
        return out;
      } catch (e) {
        console.error("not an objectArray", e);
        return {};
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "sumBy",
    function <T extends Record<string, any>>(this: T[], key: string) {
      try {
        assertIsObjectArray(this);
        assertIsArrayOfNumbers(this.map((item) => item[key]));

        return this.reduce((acc, cur) => {
          const v = parseFloat(String(cur[key]));
          return acc + (Number.isNaN(v) ? 0 : v);
        }, 0);
      } catch (e) {
        console.error("not an objectArray", e);
        return 0;
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "averageBy",
    function <T extends Record<string, any>>(this: T[], key: string) {
      try {
        assertIsObjectArray(this);
        assertIsArrayOfNumbers(this.map((item) => item[key]));

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
      } catch (e) {
        console.error("not an objectArray", e);
        return 0;
      }
    },
  ] as arrayOfObjectsMethod,
  [
    "seededShuffle",
    function <T>(this: T[], seed: number) {
      // Return a deterministic permutation index based on seed and total
      // Linear Congruential Generator to produce pseudo-random indices
      const thisClone = [...this];
      const total = this.length;
      const res: number[] = Array.from({ length: total }, (_, i) => i);
      const rand = () => (seed = (1103515245 * seed + 12345) >>> 0) / 0xffffffff;
      for (let i = total - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [res[i], res[j]] = [res[j], res[i]];
      }
      const shuffled = res.map((i) => thisClone[i]);
      return shuffled;
    },
  ] as arrayMethod,
  [
    "intersect",
    function <T>(this: T[], other: T[]) {
      const set = new Set(other);
      return this.filter((x) => set.has(x));
    },
  ] as arrayMethod,
  [
    "difference",
    function <T>(this: T[], other: T[]) {
      const set = new Set(other);
      return this.filter((x) => !set.has(x));
    },
  ] as arrayMethod,
  [
    "sum",
    function (this: any[]) {
      try {
        assertIsArrayOfNumbers(this);
        let total = 0;
        for (const v of this) {
          const n = typeof v === "number" ? v : parseFloat(String(v));
          if (!Number.isNaN(n)) total += n;
          else if (v) total += 1; // count truthy when not a number
        }
        return total;
      } catch (e) {
        console.error("not an array of numbers", e);
        return 0;
      }
    },
  ] as arrayMethod,
  [
    "average",
    function (this: any[]) {
      try {
        assertIsArrayOfNumbers(this);
        let total = 0;
        let count = 0;
        for (const v of this) {
          const n = typeof v === "number" ? v : parseFloat(String(v));
          if (!Number.isNaN(n)) {
            total += n;
            count++;
          } else if (v) {
            total += 1;
            count++;
          }
        }
        return count === 0 ? 0 : total / count;
      } catch (e) {
        console.error("not an array of numbers", e);
        return 0;
      }
    },
  ],
  [
    "validateEach",
    function <T>(this: (T | null)[], validatorFn: (item: T) => boolean) {
      return this.map((item) => (item != null && validatorFn(item as T) ? item : null));
    },
  ],
  [
    "clearNil",
    function <T>(this: (T | null | undefined)[]) {
      return this.filter((x): x is T => x != null);
    },
  ],
  [
    "indexOfHighestNumber",
    function (this: unknown[]) {
      try {
        assertIsArrayOfNumbers(this);
        if (this.length === 0) return -1;
        let highestIndex = 0;
        for (let i = 1; i < this.length; i++) {
          if (this[i] > this[highestIndex]) {
            highestIndex = i;
          }
        }
        return highestIndex;
      } catch (e) {
        console.error("not an array of numbers", e);
        return -1;
      }
    },
  ] as arrayMethod,
  [
    "indexOfLowestNumber",
    function (this: unknown[]) {
      try {
        assertIsArrayOfNumbers(this);
        if (this.length === 0) return -1;
        let lowestIndex = 0;
        for (let i = 1; i < this.length; i++) {
          if (this[i] < this[lowestIndex]) {
            lowestIndex = i;
          }
        }
        return lowestIndex;
      } catch (e) {
        console.error("not an array of numbers", e);
        return -1;
      }
    },
  ] as arrayMethod,
] as arrayMethod[];

export function extendArray() {
  for (const method of arrayMethods) {
    Object.defineProperty(Array.prototype, method[0], {
      value: method[1],
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}
