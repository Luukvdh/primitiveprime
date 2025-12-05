// src/pathShim.ts
function createBrowserPathShim() {
  const normalize = (p: string) => {
    return p.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
  };
  const sep = "/";

  return {
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
}
export function extendPath() {
  if (typeof window === "undefined") return;
  if (!(globalThis as any).path) {
    (globalThis as any).path = createBrowserPathShim();
  }
}
