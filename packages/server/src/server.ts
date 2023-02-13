import 'reflect-metadata'; // We need this in order to use @Decorators
import '@/config';
import './before';

import express from 'express';
import loadersFactory from 'loaders';


console.log("asdfasf");

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
        Server listening on port: ${app.get('port')}
      ################################################
    `);
  });
}

startServer();
