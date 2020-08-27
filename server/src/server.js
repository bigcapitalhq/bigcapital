import 'reflect-metadata'; // We need this in order to use @Decorators

import express from 'express';
import rootPath from 'app-root-path';
import loadersFactory from '@/loaders';
import '../config';
import moment from 'moment';

moment.prototype.toMySqlDateTime = function () {
  return this.format('YYYY-MM-DD HH:mm:ss');
};

global.rootPath = rootPath.path;

async function startServer() {
  const app = express();

  // Intiialize all registered loaders.
  await loadersFactory({ expressApp: app });

  app.listen(app.get('port'), (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
      return;
    }
    console.log(`
      ################################################
      🛡️  Server listening on port: ${app.get('port')} 🛡️ 
      ################################################
    `);
  });
}

startServer();