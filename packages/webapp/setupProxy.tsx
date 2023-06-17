const proxy = require('http-proxy-middleware');

const setupProxy = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
};

export default setupProxy;
