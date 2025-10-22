#!/usr/bin/env node
/*
  primitiveprimer-copy: Copy packaged public assets into a consumer project's ./public directory.
  Default destination: ./public/primitiveprimer
  Flags:
    --dest <path>      Destination directory relative to CWD (default: public/primitiveprimer)
    --flat             Copy into ./public directly (equivalent to --dest public)
    --clean            Remove destination before copying
*/

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { dest: null, flat: false, clean: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--flat') args.flat = true;
    else if (a === '--clean') args.clean = true;
    else if (a === '--dest') {
      const nxt = argv[i + 1];
      if (!nxt || nxt.startsWith('-')) throw new Error('Missing value for --dest');
      args.dest = nxt; i++;
    }
  }
  return args;
}

function rimrafSyncSafe(p) {
  if (!fs.existsSync(p)) return;
  // Prefer fast native recursive removal when available
  if (fs.rmSync) {
    try {
      fs.rmSync(p, { recursive: true, force: true });
      return;
    } catch (_) {
      // fall through to manual removal
    }
  }
  const stat = fs.lstatSync(p);
  if (stat.isDirectory() && !stat.isSymbolicLink()) {
    for (const e of fs.readdirSync(p)) rimrafSyncSafe(path.join(p, e));
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const st = fs.lstatSync(s);
    if (st.isDirectory()) copyDirSync(s, d);
    else if (st.isSymbolicLink()) {
      const target = fs.readlinkSync(s);
      try { fs.symlinkSync(target, d); } catch { /* noop on Windows if not permitted */ }
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

(async function main() {
  try {
    const args = parseArgs(process.argv);
    const cwd = process.cwd();
    const projectPkg = path.join(cwd, 'package.json');
    if (!fs.existsSync(projectPkg)) {
      console.error('Not in a project root (missing package.json). Run from your app root.');
      process.exit(1);
    }

    // Source assets live next to this script inside the package
    const srcPublic = path.resolve(__dirname, '..', 'public');
    if (!fs.existsSync(srcPublic)) {
      console.error('No public assets found in primitiveprimer package.');
      process.exit(1);
    }

    const defaultDest = args.flat ? path.join(cwd, 'public') : path.join(cwd, 'public', 'primitiveprimer');
    const dest = path.resolve(cwd, args.dest ? args.dest : defaultDest);

    // Prevent copying into a subdirectory of the source public folder to avoid recursive loops
    const srcNorm = path.resolve(srcPublic).toLowerCase();
    const destNorm = path.resolve(dest).toLowerCase();
    if (destNorm.startsWith(srcNorm + path.sep) || destNorm === srcNorm) {
      console.error(
        'Destination cannot be inside the package\'s public directory.\n' +
          `src:  ${srcPublic}\n` +
          `dest: ${dest}\n` +
          'Run this from your app root (not inside the package), or choose a destination outside the package public, e.g.:\n' +
          '  npx primitiveprimer-copy --dest ./.tmp-public/primitiveprimer --clean'
      );
      process.exit(1);
    }

    if (args.clean && fs.existsSync(dest)) {
      console.log(`Removing existing destination: ${path.relative(cwd, dest)}`);
      const t0 = Date.now();
      rimrafSyncSafe(dest);
      const t1 = Date.now();
      console.log(`Cleaned in ${t1 - t0}ms`);
    }

    if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });

    const entries = fs.readdirSync(srcPublic);
    if (entries.length === 0) {
      // Create dest directory but nothing to copy
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      console.log(`No assets to copy (source ${path.relative(cwd, srcPublic)} is empty).`);
      console.log('Done.');
      process.exit(0);
    }

    console.log(`Copying ${entries.length} item(s) from ${path.relative(cwd, srcPublic)} to ${path.relative(cwd, dest)} ...`);
    const t0 = Date.now();
    copyDirSync(srcPublic, dest);
    const t1 = Date.now();
    console.log(`Copied in ${t1 - t0}ms`);

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('primitiveprimer-copy failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
