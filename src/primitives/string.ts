// src/primitives/string.ts
import { addToPrototype } from "./addToPrototype.js";

export function extendString() {
  const stringMethods: [string, (...args: any[]) => any][] = [
    [
      "toHsp",
      function (this: string) {
        return this.replace(/\.\w{3}$/i, ".hsp");
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
  ];

  for (const [name, fn] of stringMethods) {
    addToPrototype(String.prototype, name, fn);
  }
}
