// @ts-check
'use strict';
/**
 * Codemod: Convert `export default` to named exports in src/containers.
 *
 * Rules:
 *   1. `export default function X` → `export function X`
 *   2. `function X` + `export default compose(...)(X)` (inner name === basename)
 *        → rename X to XInner, emit `export const X = compose(...)(XInner)`
 *   3. `function XRoot` + `export default compose(...)(XRoot)` (inner name !== basename)
 *        → emit `export const Basename = compose(...)(XRoot)` (no rename)
 *
 * Outputs: scripts/export-manifest.json  (path → exportName)
 */

const { Project, Node, SyntaxKind } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const CONTAINERS_DIR = path.join(ROOT, 'src', 'containers');
const MANIFEST_PATH = path.join(__dirname, 'export-manifest.json');

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

/** Replace all occurrences of `oldName` identifier-only in source text using AST positions. */
function renameInFile(sourceFile, oldName, newName) {
  const identifiers = sourceFile
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .filter((id) => {
      if (id.getText() !== oldName) return false;
      // Skip property access RHS: `foo.oldName` — we only want standalone refs
      const parent = id.getParent();
      if (Node.isPropertyAccessExpression(parent) && parent.getNameNode() === id) return false;
      // Skip property assignment keys: `{ oldName: value }` (though unlikely for component names)
      if (Node.isPropertyAssignment(parent) && parent.getNameNode() === id) return false;
      // Skip import/export specifiers that are the "original" name in an alias
      // (we do want to rename them if they refer to the local declaration)
      return true;
    });

  // Replace back-to-front to preserve positions
  for (const id of [...identifiers].reverse()) {
    id.replaceWithText(newName);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('export default')) return null;

  const basename = path.basename(filePath, path.extname(filePath));

  // One isolated project per file – guarantees rename stays local
  const project = new Project({
    useInMemoryFileSystem: true,
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { allowJs: true, jsx: 4 /* react-jsx */ },
  });
  const sourceFile = project.createSourceFile(filePath, content);

  // ── Rule 1: export default function X ──────────────────────────────────────
  const defaultFunc = sourceFile.getFunctions().find((f) => f.isDefaultExport());
  if (defaultFunc) {
    const name = defaultFunc.getName() || basename;
    defaultFunc.setIsDefaultExport(false);
    defaultFunc.setIsExported(true);
    fs.writeFileSync(filePath, sourceFile.getFullText(), 'utf-8');
    return name;
  }

  // ── Rule 2 / 3: export default <expression> ─────────────────────────────────
  const exportAssignment = sourceFile.getExportAssignment((e) => !e.isExportEquals());
  if (!exportAssignment) return null;

  const expr = exportAssignment.getExpression();

  // Simple re-export: export default X;
  if (Node.isIdentifier(expr)) {
    const innerName = expr.getText();
    const exportName = basename;
    if (innerName === exportName) {
      // export default X → export { X }  (it's already declared above, just remove the default)
      exportAssignment.remove();
      // Add `export {}` won't work if X isn't already named-exported, so just leave as-is and warn
      console.warn(`SKIP (self re-export): ${filePath}`);
      return null;
    }
    exportAssignment.replaceWithText(`export const ${exportName} = ${innerName};`);
    fs.writeFileSync(filePath, sourceFile.getFullText(), 'utf-8');
    return exportName;
  }

  // HOC-wrapped: export default compose(a, b)(X)  or  export default R.compose(a,b)(X)
  if (Node.isCallExpression(expr)) {
    const args = expr.getArguments();

    if (args.length === 1 && Node.isIdentifier(args[0])) {
      const innerName = args[0].getText();
      const exportName = basename;

      if (innerName === exportName) {
        // Conflict: rename inner declaration to XInner
        const newInnerName = innerName + 'Inner';
        renameInFile(sourceFile, innerName, newInnerName);
        // After rename the expr text has updated references
      }

      const updatedExprText = exportAssignment.getExpression().getText();
      exportAssignment.replaceWithText(`export const ${exportName} = ${updatedExprText};`);
      fs.writeFileSync(filePath, sourceFile.getFullText(), 'utf-8');
      return exportName;
    }

    // Inline arrow / complex inner arg
    console.warn(`WARN (complex inner): ${path.relative(ROOT, filePath)}`);
    return null;
  }

  console.warn(`WARN (unhandled): ${path.relative(ROOT, filePath)}`);
  return null;
}

// ─── Run ─────────────────────────────────────────────────────────────────────

const files = findFiles(CONTAINERS_DIR);
const manifest = {};
let changed = 0;
let skipped = 0;
let warnings = 0;

for (const filePath of files) {
  try {
    const exportName = processFile(filePath);
    if (exportName) {
      manifest[filePath] = exportName;
      changed++;
    } else {
      skipped++;
    }
  } catch (err) {
    console.error(`ERROR: ${path.relative(ROOT, filePath)}\n  ${err.message}`);
    warnings++;
  }
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

console.log(`\nDone. Changed: ${changed}  Skipped: ${skipped}  Errors: ${warnings}`);
console.log(`Manifest written to: ${MANIFEST_PATH}`);
