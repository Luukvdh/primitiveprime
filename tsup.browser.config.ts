import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/primitivetools.ts"],
  format: ["iife"],
  globalName: "pkit",
  dts: true,
  minify: true,
  sourcemap: true,
  outDir: "dist",
  outExtension: () => ({ js: ".browser.js" }),
  footer: {
    js: "if (typeof pkit !== 'undefined' && pkit.default) { pkit = pkit.default; }",
  },
});
