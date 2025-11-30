// src/primitives/array.ts
import { addToPrototype } from "./addToPrototype.js";

export function extendArray() {
  addToPrototype(Array.prototype, "first", function (this: any[], n = 1) {
    return n === 1 ? this[0] : this.slice(0, n);
  });

  addToPrototype(Array.prototype, "last", function (this: any[], n = 1) {
    return n === 1 ? this[this.length - 1] : this.slice(-n);
  });

  addToPrototype(Array.prototype, "findByKey", function <T extends Record<string, any>>(this: T[], key: string, value: any): T | null {
    for (const item of this) if (item[key] === value) return item;
    return null;
  });

  addToPrototype(Array.prototype, "groupBy", function (this: any[], fn: (item: any) => string): Record<string, any[]> {
    return this.reduce((acc: any, item) => {
      const key = typeof fn === "function" ? fn(item) : item[fn];
      (acc[key] ||= []).push(item);
      return acc;
    }, {});
  });

  addToPrototype(Array.prototype, "sumByKey", function <T extends Record<string, any>>(this: T[], key: string): number {
    return this.reduce((acc, item) => acc + (typeof item[key] === "number" ? item[key] : 0), 0);
  });

  addToPrototype(Array.prototype, "autoParseKeys", function <T extends Record<string, any>>(this: T[]): T[] {
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
  });

  addToPrototype(Array.prototype, "unique", function <T>(this: T[]): T[] {
    return [...new Set(this)];
  });

  addToPrototype(Array.prototype, "shuffle", function <T>(this: T[]): T[] {
    const arr = [...this];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  addToPrototype(Array.prototype, "highestByKey", function <T extends Record<string, any>>(this: T[], key: string): T | null {
    if (!this.length) return null;
    return this.reduce((max, item) => (typeof item[key] === "number" && item[key] > (max?.[key] ?? -Infinity) ? item : max));
  });

  addToPrototype(Array.prototype, "lowestByKey", function <T extends Record<string, any>>(this: T[], key: string): T | null {
    if (!this.length) return null;
    return this.reduce((min, item) => (typeof item[key] === "number" && item[key] < (min?.[key] ?? Infinity) ? item : min));
  });

  addToPrototype(Array.prototype, "sortByKey", function <T extends Record<string, any>>(this: T[], key: string, ascending = true): T[] {
    return [...this].sort((a, b) => {
      const aVal = a[key] ?? 0;
      const bVal = b[key] ?? 0;
      return ascending ? aVal - bVal : bVal - aVal;
    });
  });

  addToPrototype(Array.prototype, "sortByKeyName", function <T extends Record<string, any>>(this: T[], key: string, ascending = true): T[] {
    return [...this].sort((a, b) => {
      const aVal = String(a[key] ?? "");
      const bVal = String(b[key] ?? "");
      return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  });
}
addToPrototype(Array.prototype, "mapByKey", function <T extends Record<string, any>, K extends keyof T>(this: T[], key: K): Array<T[K]> {
  return this.map((item) => (item && typeof item === "object" ? item[key] : undefined)) as Array<T[K]>;
});
