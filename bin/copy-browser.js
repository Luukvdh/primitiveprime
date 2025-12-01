#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const destDir = args[0] || 'public';

const sourceFile = join(__dirname, '..', 'dist', 'primitivetools.browser.js');
const sourceMap = join(__dirname, '..', 'dist', 'primitivetools.browser.js.map');

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

const destFile = join(destDir, 'primitivetools.browser.js');
const destMap = join(destDir, 'primitivetools.browser.js.map');

try {
  copyFileSync(sourceFile, destFile);
  copyFileSync(sourceMap, destMap);
  console.log(`✓ Copied browser files to ${destDir}/`);
} catch (error) {
  console.error('Error copying files:', error.message);
  process.exit(1);
}
