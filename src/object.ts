// src/primitives/object.ts
declare type ObjectMethod = [string, (this: Record<string, any>, ...args: any[]) => any];
declare type ObjectMethodTS = ObjectMethod & [string, <T, U extends T>(this: T) => U | boolean];
import { Empty, NonEmpty } from "./global.js";
import { isEmpty, p, AssertError } from "./index.js";
const { assert, assertRoute } = p;
const interfaces: Record<string, string[]> = {};
export function addInterface(name: string, iface: string[]) {
  interfaces[name] = iface;
}
export const objectMethodsTS: ObjectMethodTS[] = [
  [
    "isObject",
    function (this: any): this is Record<string, any> | never {
      return assertRoute(this, () => {
        if (this !== null && typeof this === "object" && !Array.isArray(this)) {
          return this;
        }
        throw new AssertError("Not an object");
      });
    },
  ],
  [
    "assertHasKeys",
    function <K extends string>(this: Record<string, any>, ...keys: K[]): asserts this is Record<string, any> & Record<K, unknown> {
      for (const key of keys) {
        if (!(key in this)) {
          throw new Error(`Missing required key: ${key}`);
        }
      }
      // No return needed with asserts; TS narrows automatically after this call
    },
  ],
  [
    "asType", // Generic "I know what this is"

    function <T>(this: Record<string, any>): T {
      // You've done the validation above; now cast with confidence
      return this as unknown as T;
    },
  ],
  [
    "isNonEmty",
    function (this: Record<string, any>): this is Record<string, any> & Record<string, NonEmpty> {
      return Object.values(this).every((value) => typeof value === "string" && value.trim().length > 0);
    },
    "mapEmptyToFalseyKeyObje",
    function (this: Record<string, any>): Record<string, Boolean> {
      return Object.fromEntries(Object.entries(this).map((a, b) => [a, isEmpty(b)]));
    },
    "mapEmptyToFalseyValueArray",
    function (this: Record<string, any>): Record<string, Boolean> {
      return Object.fromEntries(Object.entries(this).map((a, b) => [a, isEmpty(b)]));
    },
  ],
] as ObjectMethodTS[];

export const objectMethods = [
  [
    "sortKeys",
    function (this: Record<string, any>, sorterFn: ((a: string, b: string) => number) | null = null): Record<string, any> {
      return Object.fromEntries(Object.entries(this).sort(([keyA], [keyB]) => (sorterFn ? sorterFn(keyA, keyB) : keyA.localeCompare(keyB))));
    },
  ] as ObjectMethod,
  [
    "fill",
    function <T extends Record<string, any>, U extends Record<string, any>>(this: T, source: U): T & U {
      for (const [key, value] of Object.entries(source)) {
        if (!(key in this)) {
          (this as any)[key] = value;
        }
      }
      return this as T & U;
    },
  ] as ObjectMethod,
  [
    "parseKeys",
    function (this: Record<string, any>, ...keys: string[]): Record<string, any> {
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
    },
  ] as ObjectMethod,
  [
    "valuesMap",
    function (this: Record<string, any>, fn: (v: any, k: string) => any): Record<string, any> {
      return Object.fromEntries(Object.entries(this).map(([k, v]) => [k, fn(v, k)]));
    },
  ] as ObjectMethod,
  [
    "entriesMap",
    function (this: Record<string, any>, fn: ([key, value]: [string, any]) => [string, any]): Record<string, any> {
      return Object.fromEntries(Object.entries(this).map(fn));
    },
  ] as ObjectMethod,
  [
    "keysMap",
    function (this: Record<string, any>, fn: (k: string, v: any) => [string, any]): Record<string, any> {
      return Object.fromEntries(Object.entries(this).map(([k, v]) => fn(k, v)));
    },
  ] as ObjectMethod,
  [
    "equals",
    function (this: Record<string, any>, other: Record<string, any>) {
      const keysA = Object.keys(this);
      const keysB = Object.keys(other);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((k) => keysB.includes(k) && typeof this[k] === typeof other[k]);
    },
  ] as ObjectMethod,
  [
    "omit",
    function <T extends Record<string, any>>(this: T, ...keys: string[]) {
      const out: Record<string, any> = {};
      for (const k of Object.keys(this)) if (!keys.includes(k)) out[k] = this[k];
      return out as T;
    },
  ] as ObjectMethod,
  [
    "pick",
    function <T extends Record<string, any>>(this: T, ...keys: string[]) {
      const out: Record<string, any> = {};
      for (const k of keys) if (k in this) out[k] = this[k];
      return out as T;
    },
  ] as ObjectMethod,
  [
    "complement",
    function <T extends Record<string, any>>(this: T, src: Record<string, any>) {
      const out: Record<string, any> = { ...this };
      for (const k of Object.keys(src)) if (!(k in out)) out[k] = src[k];
      return out as T;
    },
  ] as ObjectMethod,
  [
    "clean",
    function <T extends Record<string, any>>(this: T) {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(this)) {
        if (v === "" || v == null) continue; // remove empty, null, undefined
        out[k] = v;
      }
      return out as T;
    },
  ] as ObjectMethod,
  [
    "ensureSchema",
    function (this: Record<string, any>, schema: Record<string, any>, opts: { coerce?: boolean } = {}) {
      const out: Record<string, any> = {};
      for (const [k, def] of Object.entries(schema)) {
        let v = this[k];
        if (v == null) v = def;
        if (opts.coerce) {
          const type = typeof def;
          if (type === "number") v = Number(v);
          else if (type === "boolean") v = Boolean(v);
          else if (type === "string") v = String(v);
        }
        out[k] = v;
      }
      return out;
    },
  ] as ObjectMethod,
  [
    "filterEntries",
    function (this: Record<string, any>, predicate: (k: string, v: any) => boolean) {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(this)) if (predicate(k, v)) out[k] = v;
      return out;
    },
  ] as ObjectMethod,
  [
    "merge",
    function (this: Record<string, any>, other: Record<string, any>, opts: { arrayStrategy?: "concat" | "replace" | "unique" } = {}) {
      const out: Record<string, any> = { ...this };
      for (const [k, v] of Object.entries(other)) {
        const cur = out[k];
        if (Array.isArray(cur) && Array.isArray(v)) {
          const strat = opts.arrayStrategy ?? "concat";
          if (strat === "replace") out[k] = v;
          else if (strat === "unique") out[k] = Array.from(new Set([...cur, ...v]));
          else out[k] = [...cur, ...v];
        } else if (cur && typeof cur === "object" && v && typeof v === "object") {
          out[k] = { ...cur, ...v };
        } else {
          out[k] = v;
        }
      }
      return out;
    },
  ],
  [
    "fromTable",
    function (this: Record<string, any[]>) {
      const keys = Object.keys(this);
      const len = Math.max(0, ...keys.map((k) => this[k]?.length ?? 0));
      const out: Record<string, any>[] = Array.from({ length: len }, () => ({}));
      for (const k of keys) {
        const col = this[k] || [];
        for (let i = 0; i < len; i++) out[i][k] = col[i];
      }
      return out;
    },
  ] as ObjectMethod,
] as ObjectMethod[];

export function extendObject() {
  for (const method of objectMethods) {
    Object.defineProperty(Object.prototype, method[0], {
      value: method[1],
      writable: true,
      configurable: true,
      enumerable: false,
    });
  }
}
