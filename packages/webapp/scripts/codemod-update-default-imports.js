// @ts-check
'use strict';
/**
 * Codemod: Update default imports from containers to use named imports.
 *
 * For each file in src/ that has:
 *   import X from './path/to/Container'
 * where that container is in the manifest (its default export was converted),
 * replace with:
 *   import { ExportName } from './path/to/Container'      // if local name === export name
 *   import { ExportName as X } from './path/to/Container' // if local name !== export name
 *
 * Reads: scripts/export-manifest.json
 */

const { Project, Node, SyntaxKind } = require('ts-morph');
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
// Normalise keys to absolute paths (they already are, but ensure no trailing slash etc.)
const manifestByPath = {};
for (const [absPath, exportName] of Object.entries(manifest)) {
  manifestByPath[path.normalize(absPath)] = exportName;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function findFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findFiles(full));
    else if (/\.(tsx?|ts)$/.test(entry.name)) results.push(full);
  }
  return results;
}

const TS_EXTENSIONS = ['.tsx', '.ts', '/index.tsx', '/index.ts'];

/** Try to resolve a relative or alias import to an absolute file path. */
function resolveImport(fromFile, importPath) {
  // Handle path aliases like @/containers/...
  const aliasMatch = importPath.match(/^@\/(.+)/);
  if (aliasMatch) {
    const rel = aliasMatch[1];
    const base = path.join(SRC_DIR, rel);
    for (const ext of TS_EXTENSIONS) {
      const candidate = base + ext.replace(/^\//, path.sep);
      if (fs.existsSync(candidate)) return path.normalize(candidate);
    }
    // Try index file
    for (const ext of TS_EXTENSIONS) {
      const candidate = path.join(base, 'index' + ext.replace(/^\//, ''));
      if (fs.existsSync(candidate)) return path.normalize(candidate);
    }
    return null;
  }

  if (!importPath.startsWith('.')) return null; // external package

  const dir = path.dirname(fromFile);
  const base = path.resolve(dir, importPath);

  for (const ext of TS_EXTENSIONS) {
    let candidate;
    if (ext.startsWith('/')) {
      candidate = base + ext; // e.g. base/index.tsx
    } else {
      candidate = base + ext;
    }
    candidate = path.normalize(candidate);
    if (fs.existsSync(candidate)) return candidate;
  }

  // Already has extension
  const direct = path.normalize(base);
  if (fs.existsSync(direct)) return direct;

  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const files = findFiles(SRC_DIR);
let changed = 0;
let errors = 0;

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('import ')) continue;

  const project = new Project({
    useInMemoryFileSystem: true,
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { allowJs: true, jsx: 4 },
  });
  const sourceFile = project.createSourceFile(filePath, content);

  let fileChanged = false;

  for (const importDecl of sourceFile.getImportDeclarations()) {
    const defaultImport = importDecl.getDefaultImport();
    if (!defaultImport) continue;

    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    const resolvedPath = resolveImport(filePath, moduleSpecifier);
    if (!resolvedPath) continue;

    const exportName = manifestByPath[resolvedPath];
    if (!exportName) continue;

    // We have a default import from a converted container
    const localName = defaultImport.getText();

    // Build replacement
    const existingNamedImports = importDecl.getNamedImports();

    if (localName === exportName) {
      // import X from './X'  →  import { X } from './X'
      importDecl.removeDefaultImport();
      importDecl.addNamedImport(exportName);
    } else {
      // import Foo from './Bar'  →  import { Bar as Foo } from './Bar'
      importDecl.removeDefaultImport();
      importDecl.addNamedImport({ name: exportName, alias: localName });
    }

    fileChanged = true;
  }

  if (fileChanged) {
    try {
      fs.writeFileSync(filePath, sourceFile.getFullText(), 'utf-8');
      changed++;
    } catch (err) {
      console.error(`ERROR writing ${path.relative(ROOT, filePath)}: ${err.message}`);
      errors++;
    }
  }
}

console.log(`\nDone. Import sites updated: ${changed}  Errors: ${errors}`);
