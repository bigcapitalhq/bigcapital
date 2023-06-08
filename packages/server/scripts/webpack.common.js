const path = require('path');
const { NormalModuleReplacementPlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

exports.getCommonWebpackOptions = ({
  inputEntry,
  outputDir,
  outputFilename,
}) => {
  const webpackOptions = {
    entry: ['regenerator-runtime/runtime', inputEntry],
    target: 'node',
    mode: isDev ? 'development' : 'production',
    watch: isDev,
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
    },
    output: {
      path: path.resolve(__dirname, outputDir),
      filename: outputFilename,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      extensionAlias: {
        '.ts': ['.js', '.ts'],
        '.cts': ['.cjs', '.cts'],
        '.mts': ['.mjs', '.mts'],
      },
      plugins: [
        new TsconfigPathsPlugin({
          configFile: './tsconfig.json',
          extensions: ['.ts', '.tsx', '.js'],
        }),
      ],
    },
    plugins: [
      // Ignore knex dynamic required dialects that we don't use
      new NormalModuleReplacementPlugin(
        /m[sy]sql2?|oracle(db)?|sqlite3|pg-(native|query)/,
        'noop2'
      ),
      new ProgressBarPlugin(),
    ],
    externals: [nodeExternals(), 'aws-sdk', 'prettier'],
    module: {
      rules: [
        {
          test: /\.([cm]?ts|tsx|js)$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                configFile: 'tsconfig.json',
              },
            },
          ],
          exclude: /(node_modules)/,
        },
      ],
    },
    optimization: {
      minimize: false,
    },
  };

  if (isDev) {
    webpackOptions.plugins.push(
      new RunScriptWebpackPlugin({ name: outputFilename })
    );
  }
  return webpackOptions;
};
