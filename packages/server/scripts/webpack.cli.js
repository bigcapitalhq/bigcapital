const { getCommonWebpackOptions } = require('./webpack.common');

const inputEntry = './src/commands/index.ts';
const outputDir = '../build';
const outputFilename = 'commands.js';

module.exports = getCommonWebpackOptions({
  inputEntry,
  outputDir,
  outputFilename,
});
