// Types are exposed via package root index.d.ts + global.d.ts; no direct reference here to avoid DTS build conflicts.
export * from "./primitives.js";
import "./polyfills.js";
import "./string.js";
import "./array.js";
import "./number.js";
import "./object.js";
import type { Empty, NonEmpty } from "./global.js";

class AssertError extends Error {
  info?: Record<string, unknown>;
  constructor(message: string, info?: Record<string, unknown>) {
    super(message);
    this.name = "AssertError";
    this.info = info;
  }
}
export { AssertError };

export const isEmpty = (val: any): any | (any & Empty) => {
  if (val == null) return true;
  if (typeof val === "boolean") return val === false;
  if (typeof val === "string" || Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") {
    // No keys or all values are 0 or null
    const keys = Object.keys(val);
    const resbool = keys.length === 0 || keys.every((k) => val[k] === 0 || val[k] == null);
    return resbool ? isEmptyTyped(val) : false;
  }
  return false;
};
export const isEmptyTyped = (val: any) => {
  if (isEmpty(val)) {
    switch (typeof val) {
      case "boolean":
        return val as boolean & Empty;
      case "function":
        return val as Function & Empty;
      case "number":
      case "bigint":
        return val as number & Empty;
      case "object":
        return val as Record<any, any> & { [P in keyof any]: NonEmpty } & { [P in keyof null]: Empty };
      case "string":
        return val as string & Empty;
      case "undefined":
        return val as undefined & Empty & NonNullable<undefined>;
      default:
    }
  }
  return val as NonEmpty;
};

type AssertRouteOptions = {
  // Called when an assertion fails inside the route; can log/telemetry
  onError?: (err: AssertError | Error) => void;
  catchNonAssertErrors?: boolean;
};

declare const __assertGlobalOnError: ((err: AssertError) => void) | undefined;

// Simple version (throws on false)
function assert(condition: boolean, message: string = "Assertion failed"): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

// More flexible version (with type narrowing)
function assertTs<T>(value: T, predicate: (v: T) => boolean, message: string = "Assertion failed"): asserts value {
  if (!predicate(value)) {
    throw new Error(message);
  }
}

// Type-guard version (returns boolean or throws)
function assertTypeGuard<T, U extends T>(value: T, guard: (v: T) => v is U, message: string = "Type assertion failed"): asserts value is U {
  if (!guard(value)) {
    throw new Error(message);
  }
}

// Safe version (returns result or null instead of throwing)
function nullAssert<T>(value: T, predicate: (v: T) => boolean): T | null {
  return predicate(value) ? value : null;
}
function assertRoute<T>(fallback: T, fn: () => T, options?: AssertRouteOptions): T;
function assertRoute<T, A extends any[]>(fallback: T, fn: (...args: A) => T, options?: AssertRouteOptions): T;
function assertRoute<T, A extends any[]>(fallback: T, fnx: (...args: A) => T) {
  const onError = (e: AssertError | Error) => {
    if (e instanceof AssertError) {
      console.log(e.message, e.name, e.cause);
      return fallback;
    }
    if (e instanceof Error) {
      throw e;
    }
    if (!fnx) {
      return fallback;
    }
    return (fnx as () => T)();
  };

  // If the function has parameters, return a wrapped function
  return ((...args) => {
    try {
      return fnx(...args);
    } catch (e) {
      if (e instanceof AssertError) {
        onError?.(e);
        return fallback;
      }

      throw e; // rethrow non-assert errors by default
    }
  }) as (...args: A) => T;
}

const pas = {
  assert,
  assertTs,
  assertTypeGuard,
  nullAssert,
  assertRoute,
};

export { pas as p };
