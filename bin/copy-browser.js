#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Usage: npx primitiveprimer-copy-browser [destFolder]
// Defaults to copying into public/vendor
const args = process.argv.slice(2);
const destRoot = args[0] || 'public/vendor';
const destDir = resolve(process.cwd(), destRoot);

const distDir = join(__dirname, '..', 'dist');

const filesToCopy = [
  // Auto-installing global (browser IIFE)
  'primitiveprimer.global.js',
  'primitiveprimer.global.js.map',
  // Non-global IIFE (toolkit and manual installer available on globalThis)
  'primitiveprimer.js',
  'primitiveprimer.js.map',
];

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

let copied = 0;
for (const filename of filesToCopy) {
  const src = join(distDir, filename);
  const dst = join(destDir, filename);
  if (existsSync(src)) {
    copyFileSync(src, dst);
    copied++;
  }
}

if (copied > 0) {
  console.log(`✓ Copied ${copied} file(s) to ${destDir}`);
} else {
  console.error('No browser bundles found in dist. Did you run `npm run build`?');
  process.exit(1);
}
