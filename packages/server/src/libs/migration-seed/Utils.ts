// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';

/**
 * Detarmines the module type of the given file path.
 * @param {string} filepath
 * @returns {boolean}
 */
async function isModuleType(filepath: string): boolean {
  if (process.env.npm_package_json) {
    const { promisify } = require('util');
    const readFile = promisify(fs.readFile);
    // npm >= 7.0.0
    const packageJson = JSON.parse(
      await readFile(process.env.npm_package_json, 'utf-8'),
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
 * @param {string} seedsDirectory - The seeds directory path from config
 * @returns
 */
export async function importWebpackSeedModule(
  moduleName: string,
  seedsDirectory: string,
): any {
  // Convert the seeds directory to a relative path from this file's location
  const utilsDir = __dirname;
  const seedsDirAbsolute = path.isAbsolute(seedsDirectory)
    ? seedsDirectory
    : path.resolve(process.cwd(), seedsDirectory);

  // Get relative path from Utils.js location to seeds directory
  const relativePath = path.relative(utilsDir, seedsDirAbsolute);

  // Convert to forward slashes for import (works on all platforms)
  const importPath = relativePath.split(path.sep).join('/');

  // Construct the import path (add ./ prefix if not already present, or handle empty/current dir)
  let finalPath = importPath;
  if (!finalPath || finalPath === '.') {
    finalPath = './';
  } else if (!finalPath.startsWith('.')) {
    finalPath = `./${finalPath}`;
  }

  return import(`${finalPath}/${moduleName}`);
}
