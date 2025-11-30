// src/primitives/object.ts
import { addToPrototype } from "./addToPrototype.js";

export function extendObject() {
  // --- OBJECT (static) ---
  addToPrototype(Object, "keysMap", function (obj: Record<string, any>, fn: (k: string, v: any) => [string, any]): Record<string, any> {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => fn(k, v)));
  });

  addToPrototype(Object, "valuesMap", function (obj: Record<string, any>, fn: (v: any, k: string) => any): Record<string, any> {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));
  });

  addToPrototype(Object, "parseKeys", function (this: Record<string, any>, ...keys: string[]): Record<string, any> {
    const obj = this.valueOf() as Record<string, any>;
    const result: Record<string, any> = {};
    for (const key of keys) {
      try {
        result[key] = JSON.parse(obj[key]);
      } catch {
        result[key] = obj[key];
      }
    }
    return obj;
  });

  addToPrototype(Object, "fill", function <T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U): T & U {
    for (const [key, value] of Object.entries(source)) {
      if (!(key in target)) {
        (target as any)[key] = value;
      }
    }
    return target as T & U;
  });

  // --- OBJECT instance ---
  addToPrototype(Object.prototype, "sortKeys", function (this: Record<string, any>, sorterFn: ((a: string, b: string) => number) | null = null): Record<string, any> {
    return Object.fromEntries(Object.entries(this).sort(([keyA], [keyB]) => (sorterFn ? sorterFn(keyA, keyB) : keyA.localeCompare(keyB))));
  });
}
