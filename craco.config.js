const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.fallback = {
        path: require.resolve('path-browserify'),
      };
      return webpackConfig;
    },
  },
};
