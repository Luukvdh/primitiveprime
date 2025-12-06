class AssertError extends Error {
  info?: Record<string, unknown>;
  constructor(message: string, info?: Record<string, unknown>) {
    super(message);
    this.name = "AssertError";
    this.info = info;
  }
}

export { AssertError };

export function applyPolyfills() {
  if (!Object.fromEntries) {
    Object.fromEntries = function <T>(entries: Iterable<readonly [PropertyKey, T]>) {
      const obj: Record<string, T> = {};
      for (const [k, v] of entries) obj[String(k)] = v;
      return obj;
    };
  }

  if (!(Math as any).randomRangeFloat) {
    (Math as any).randomRangeFloat = (min: number, max: number) => Math.random() * (max - min) + min;
  }
  if (!(Math as any).randomRangeInt) {
    (Math as any).randomRangeInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  }
  if (!(Math as any).lerp) {
    (Math as any).lerp = (min: number, max: number, t: number) => min + (max - min) * t;
  }
}

export type Empty = false | (any[] & { length: 0 }) | (string & { length: 0 }) | Record<never, never> | { [P in keyof null]: P } | NonNullable<null> | NonNullable<unknown> | NonNullable<undefined>;
export type NonEmpty = string | any[] | Record<string, unknown> | number | boolean;
export declare function isNonEmpty(x: unknown): x is NonEmpty;

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

export { assert, assertTs, assertTypeGuard, nullAssert, assertRoute, type AssertRouteOptions };
