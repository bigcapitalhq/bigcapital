import { systemDbManager, systemKnexConfig } from 'config/knexConfig';
import knexManager from 'knex-db-manager';

export default () =>
  knexManager.databaseManagerFactory({
    knex: systemKnexConfig,
    dbManager: systemDbManager,
  });
