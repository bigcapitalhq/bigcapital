import './before';

import '@config/index';

import express from 'express';
import loadersFactory from './loaders/index';

async function startServer() {
  const app = express();
  await loadersFactory({ expressApp: app });
}

export { startServer };