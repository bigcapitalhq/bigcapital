const { getCommonWebpackOptions } = require('./webpack.common');

const inputEntry = './src/server.ts';
const outputDir = '../build';
const outputFilename = 'index.js';

module.exports = getCommonWebpackOptions({
  inputEntry,
  outputDir,
  outputFilename,
});
