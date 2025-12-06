// src/primitives/string.ts
import { NonEmpty } from "./global.js";
import { p } from "./index.js";

const { assert, assertRoute } = p;

function assertIs<T, U extends T>(value: T, guard: (v: T) => v is U, message: string = "Type assertion failed"): asserts value is U {
  if (!guard(value)) {
    throw new Error(message);
  }
}

export const stringMethods: [string, (...args: any[]) => any][] = [
  [
    "assertNonEmptyString",
    function (this: string) {
      try {
        assertIs(this, (v): v is string => typeof v === "string");
        return this as string & NonEmpty;
      } catch {
        return false;
      }
    },
  ],

  [
    "isNonEmty",
    function (this: string): this is string & NonEmpty {
      return typeof this === "string" && this.trim().length > 0;
    },
  ],
  [
    "changeExtension",
    function (this: string, ext: string) {
      return this.replace(/\.[0-9a-z]{1,5}$/i, "." + ext.replace(/\W/, "").substring(0, 5));
    },
  ],
  [
    "reverse",
    function (this: string) {
      return this.split("").reverse().join("");
    },
  ],
  [
    "toTitleCase",
    function (this: string) {
      return this.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    },
  ],
  [
    "words",
    function (this: string) {
      return this.match(/\b\w+\b/g) || [];
    },
  ],
  [
    "slashreverse",
    function (this: string, str: string) {
      return str.replace(/[\\/]/g, (ch) => (ch === "\\" ? "/" : "\\"));
    },
  ],
  [
    "slashwin",
    function (this: string) {
      return this.replace(/[\\/]/g, "\\");
    },
  ],
  [
    "slashlinux",
    function (this: string) {
      return this.replace(/[\\/]/g, "/");
    },
  ],
  [
    "strip",
    function (this: string) {
      return this.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .trim();
    },
  ],
  [
    "containsAny",
    function (this: string, ...arr: string[]) {
      return arr.some((sub) => this.includes(sub));
    },
  ],
  [
    "toSlug",
    function (this: string) {
      return this.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
    },
  ],
  [
    "stripCompare",
    function (this: string, other: string) {
      const normalize = (str: string) =>
        str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[\s_]/g, "")
          .trim();
      return normalize(this).includes(normalize(other));
    },
  ],
  [
    "toWordCapitalized",
    function (this: string) {
      return this ? this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() : "";
    },
  ],
  [
    "truncate",
    function (this: string, length: number, suffix = "…") {
      return this.length > length ? this.slice(0, length) + suffix : this.toString();
    },
  ],
  [
    "isJson",
    function (this: string) {
      try {
        JSON.parse(this);
        return true;
      } catch {
        return false;
      }
    },
  ],
  [
    "toCamelCase",
    function (this: string) {
      return this.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace("-", "").replace("_", ""));
    },
  ],
  [
    "safeParseJson",
    function (this: string) {
      try {
        return JSON.parse(this);
      } catch {
        return this.valueOf();
      }
    },
  ],
  [
    "nullParseJson",
    function (this: string) {
      if (!this.trim()) return null;
      try {
        return JSON.parse(this);
      } catch {
        return null;
      }
    },
  ],
  [
    "filenameCompare",
    function (this: string, otherPath: string) {
      const normalize = (p: string) => p.replace(/\\/g, "/").split("/").pop()?.toLowerCase() ?? "";
      return normalize(this) === normalize(otherPath);
    },
  ],
  [
    "substringFrom",
    function (this: string, startStr?: string, stopStr?: string) {
      const s = String(this);
      if (!startStr) return s;
      const i = s.indexOf(startStr);
      if (i === -1) return "";
      const from = i + startStr.length;
      if (!stopStr) return s.slice(from);
      const j = s.indexOf(stopStr, from);
      return j === -1 ? s.slice(from) : s.slice(from, j);
    },
  ],
  [
    "escapeHTML",
    function (this: string) {
      return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
    },
  ],
  [
    "unescapeHTML",
    function (this: string) {
      return this.replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
    },
  ],
  [
    "humanize",
    function (this: string) {
      const s = this.replace(/([a-z0-9])([A-Z])/g, "$1 $2") // break camelCase
        .replace(/[\-_]+/g, " ") // dash/underscore to space
        .replace(/\s{2,}/g, " ") // trim double spaces
        .trim();
      return s.replace(/(^\w|[.!?]\s+\w)/g, (m) => m.toUpperCase()); // capitalize sentences
    },
  ],
  [
    "underscore",
    function (this: string) {
      return this.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/[\s\-]+/g, "_")
        .toLowerCase();
    },
  ],
  [
    "countOccurrence",
    function (this: string, str2: string, caseSens: boolean = true) {
      const src = caseSens ? this : this.toLowerCase();
      const needle = caseSens ? str2 : str2.toLowerCase();
      if (!needle) return 0;
      let i = 0,
        pos = 0;
      while ((pos = src.indexOf(needle, pos)) !== -1) {
        i++;
        pos += needle.length;
      }
      return i;
    },
  ],
  [
    "isNumber",
    function (this: string): this is string {
      return /^\s*[+-]?(?:\d+\.?\d*|\.\d+)\s*$/.test(this);
    },
  ],
  [
    "isFloat",
    function (this: string): this is string {
      return /^\s*[+-]?\d*\.\d+\s*$/.test(this) && !Number.isNaN(parseFloat(this));
    },
  ],
  [
    "isAlphaNumeric",
    function (this: string): this is string {
      return /^[a-z0-9]+$/i.test(this);
    },
  ],
  [
    "isLower",
    function (this: string) {
      return this === this.toLowerCase() && /[a-z]/.test(this);
    },
  ],
  [
    "isUpper",
    function (this: string) {
      return this === this.toUpperCase() && /[A-Z]/.test(this);
    },
  ],
  [
    "hashed",
    function (this: string, truncate?: number) {
      // Simple non-cryptographic hash (djb2-like)
      let h = 5381;
      for (let i = 0; i < this.length; i++) h = (h << 5) + h + this.charCodeAt(i);
      let out = (h >>> 0).toString(16);
      return typeof truncate === "number" ? out.slice(0, Math.max(0, truncate)) : out;
    },
  ],
  [
    "replaceLast",
    function (this: string, search: string | RegExp, replacement: string) {
      const s = String(this);
      if (search instanceof RegExp) {
        const m = s.match(search);
        if (!m) return s;
        const last = m[m.length - 1];
        const idx = s.lastIndexOf(last);
        return idx === -1 ? s : s.slice(0, idx) + replacement + s.slice(idx + last.length);
      } else {
        const idx = s.lastIndexOf(search);
        return idx === -1 ? s : s.slice(0, idx) + replacement + s.slice(idx + search.length);
      }
    },
  ],
  [
    "latinise",
    function (this: string) {
      return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
  ],
  [
    "ellipsis",
    function (this: string, total: number) {
      if (total <= 3) return this.slice(0, total);
      return this.length > total ? this.slice(0, total - 3) + "..." : this;
    },
  ],
  [
    "toNumber",
    function (this: string) {
      const cleaned = this.replace(/[^0-9+\-\.eE]/g, " ");
      const match = cleaned.match(/[+\-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+\-]?\d+)?/);
      return match ? Number(match[0]) : NaN;
    },
  ],
  [
    "toBoolean",
    function (this: string) {
      const s = this.trim().toLowerCase();
      if (["1", "true", "yes", "on", "y"].includes(s)) return true;
      if (["0", "false", "no", "off", "n"].includes(s)) return false;
      return Boolean(s);
    },
  ],
];
export function extendString() {
  for (const method of stringMethods) {
    Object.defineProperty(String.prototype, method[0], {
      value: method[1],
      writable: true,
      configurable: true,
    });
  }
}
