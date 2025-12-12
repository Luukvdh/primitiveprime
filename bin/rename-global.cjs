const fs = require("fs");
const path = require("path");

const dist = path.resolve(__dirname, "..", "dist");

function rename(from, to) {
  const src = path.join(dist, from);
  const dst = path.join(dist, to);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dst);
    console.log(`Renamed ${from} -> ${to}`);
  } else {
    console.warn(`Not found: ${from}`);
  }
}

// Keep CJS global name aligned
rename("primitiveprimer-global.cjs", "primitiveprimer.global.cjs");
rename("primitiveprimer-global.cjs.map", "primitiveprimer.global.cjs.map");

// Rename non-global IIFE to desired filename
rename("primitiveprimer.global.js", "primitiveprimer.js");
rename("primitiveprimer.global.js.map", "primitiveprimer.js.map");

// Rename IIFE global to desired filename
rename("primitiveprimer-global.global.js", "primitiveprimer.global.js");
rename("primitiveprimer-global.global.js.map", "primitiveprimer.global.js.map");
