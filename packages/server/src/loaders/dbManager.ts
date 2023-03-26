import knexManager from 'knex-db-manager';
import { systemKnexConfig, systemDbManager } from 'config/knexConfig';

export default () => knexManager.databaseManagerFactory({
  knex: systemKnexConfig,
  dbManager: systemDbManager,
});