// @ts-check
'use strict';
/**
 * Fix React.lazy() calls that need a default export.
 *
 * Converts:
 *   React.lazy(() => import('./X'))
 * to:
 *   React.lazy(() => import('./X').then(m => ({ default: m.ExportName })))
 *
 * Only updates lazy imports whose target files appear in export-manifest.json
 * (i.e., files that had their default export converted to a named export).
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const MANIFEST_PATH = path.join(__dirname, 'export-manifest.json');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Manifest not found. Run codemod-containers-exports.js first.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
const manifestByPath = {};
for (const [absPath, exportName] of Object.entries(manifest)) {
  manifestByPath[path.normalize(absPath)] = exportName;
}

const TS_EXTENSIONS = ['.tsx', '.ts', '/index.tsx', '/index.ts'];

function resolveImport(fromFile, importPath) {
  const aliasMatch = importPath.match(/^@\/(.+)/);
  if (aliasMatch) {
    const base = path.join(SRC_DIR, aliasMatch[1]);
    for (const ext of TS_EXTENSIONS) {
      const c = path.normalize(base + ext);
      if (fs.existsSync(c)) return c;
    }
    return null;
  }
  if (!importPath.startsWith('.')) return null;

  const base = path.resolve(path.dirname(fromFile), importPath);
  for (const ext of TS_EXTENSIONS) {
    const c = path.normalize(base + ext);
    if (fs.existsSync(c)) return c;
  }
  const direct = path.normalize(base);
  if (fs.existsSync(direct)) return direct;
  return null;
}

function findFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findFiles(full));
    else if (/\.(tsx?|ts)$/.test(entry.name)) results.push(full);
  }
  return results;
}

// Regex: matches lazy(() => import('...')) — single or multi-line, with optional trailing comma
// Captures: quote char and path. Does NOT already have .then(
const LAZY_RE = /lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*(['"`])([^'"`]+)\1\s*\)\s*,?\s*\)/g;

const files = findFiles(SRC_DIR);
let changed = 0;
let errors = 0;

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Quick skip: no lazy import pattern
  if (!content.includes('lazy(') && !content.includes('lazy (')) continue;
  if (!content.includes('import(')) continue;

  let newContent = content;
  let fileChanged = false;

  newContent = newContent.replace(LAZY_RE, (match, quote, importPath) => {
    // Skip if it already has .then(
    if (match.includes('.then(')) return match;

    const resolved = resolveImport(filePath, importPath);
    if (!resolved) return match;

    const exportName = manifestByPath[resolved];
    if (!exportName) return match;

    // Build the replacement (always compact single-line form)
    return `lazy(() => import(${quote}${importPath}${quote}).then(m => ({ default: m.${exportName} })))`;
  });

  if (newContent !== content) {
    try {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      changed++;
      fileChanged = true;
    } catch (err) {
      console.error(`ERROR: ${path.relative(ROOT, filePath)}: ${err.message}`);
      errors++;
    }
  }
}

console.log(`\nDone. Lazy imports fixed: ${changed}  Errors: ${errors}`);
