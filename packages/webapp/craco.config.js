const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: {
      resolve: {
        fallback: { path: require.resolve('path-browserify') },
      },
    },
  },
  devServer: {
    allowedHosts: process.env.GITPOD_HOST ? 'all' : 'auto'
  },
};
