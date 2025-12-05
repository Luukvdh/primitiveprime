import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  minify: true,
  entry: {
    primitiveprimer: "src/index.ts",
  },
  outExtension: ({ format }) => ({
    js: format === "esm" ? ".mjs" : ".cjs",
  }),
  target: "es2023",
});
