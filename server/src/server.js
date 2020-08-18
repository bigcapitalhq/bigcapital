import express from 'express';
import rootPath from 'app-root-path';
import loadersFactory from '@/loaders';
import '../config';

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