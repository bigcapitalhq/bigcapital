import fs from 'fs';

const { promisify } = require('util');
const readFile = promisify(fs.readFile);

/**
 * Determines the module type of the given file path.
 * @param {string} filepath
 * @returns {boolean}
 */
async function isModuleType(filepath: string): boolean {
  if (process.env.npm_package_json) {
    // npm >= 7.0.0
    const packageJson = JSON.parse(
      await readFile(process.env.npm_package_json, 'utf-8')
    );
    if (packageJson.type === 'module') {
      return true;
    }
  }
  return process.env.npm_package_type === 'module' || filepath.endsWith('.mjs');
}

/**
 * Imports content of the given file path.
 * @param {string} filepath
 * @returns
 */
export async function importFile(filepath: string): any {
  return (await isModuleType(filepath))
    ? import(require('url').pathToFileURL(filepath))
    : require(filepath);
}

/**
 *
 * @param {string} moduleName
 * @returns
 */
export async function importWebpackSeedModule(moduleName: string): any {
  return import(`@/database/seeds/core/${moduleName}`);
}
