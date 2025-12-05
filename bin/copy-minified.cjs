const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const out = path.join(dist, 'minified');

const files = [
  // ESM/CJS library entries
  { src: 'primitiveprimer.mjs', dst: 'primitiveprimer.min.mjs' },
  { src: 'primitiveprimer.mjs.map', dst: 'primitiveprimer.min.mjs.map' },
  { src: 'primitiveprimer.cjs', dst: 'primitiveprimer.min.cjs' },
  { src: 'primitiveprimer.cjs.map', dst: 'primitiveprimer.min.cjs.map' },
  { src: 'primitiveprimer.d.ts', dst: 'primitiveprimer.d.ts' },
  // Browser bundles
  { src: 'primitiveprimer.global.js', dst: 'primitiveprimer.global.min.js' },
  { src: 'primitiveprimer.global.js.map', dst: 'primitiveprimer.global.min.js.map' },
  { src: 'primitiveprimer.global.cjs', dst: 'primitiveprimer.global.min.cjs' },
  { src: 'primitiveprimer.global.cjs.map', dst: 'primitiveprimer.global.min.cjs.map' },
  { src: 'primitiveprimer.js', dst: 'primitiveprimer.min.js' },
  { src: 'primitiveprimer.js.map', dst: 'primitiveprimer.min.js.map' },
];

if (!fs.existsSync(out)) {
  fs.mkdirSync(out, { recursive: true });
}

let copied = 0;
for (const f of files) {
  const src = path.join(dist, typeof f === 'string' ? f : f.src);
  const dst = path.join(out, typeof f === 'string' ? f : f.dst);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    copied++;
  }
}

console.log(`Copied ${copied} file(s) to ${out}`);
