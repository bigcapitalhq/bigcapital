import knexManager from 'knex-db-manager';
import knexfile from '@/../knexfile';

const config = knexfile[process.env.NODE_ENV];

const dbManager = knexManager.databaseManagerFactory({
  knex: config,
  dbManager: {
    // db manager related configuration
    collate: [],
    superUser: 'root',
    superPassword: 'root',
    // populatePathPattern: 'data/**/*.js', // glob format for searching seeds
  },
});

export default dbManager;