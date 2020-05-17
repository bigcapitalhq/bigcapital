import knexManager from 'knex-db-manager';
import knexfile from '@/../config/systemKnexfile';
import config from '@/../config/config';

const knexConfig = knexfile[process.env.NODE_ENV];

const dbManager = knexManager.databaseManagerFactory({
  knex: knexConfig,
  dbManager: {
    collate: [],
    superUser: config.manager.superUser,
    superPassword: config.manager.superPassword,
  },
});

export default dbManager;