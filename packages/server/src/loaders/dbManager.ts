import knexManager from 'knex-db-manager';
import { systemDbManager, systemKnexConfig } from '../config/knexConfig';

export default () =>
  knexManager.databaseManagerFactory({
    knex: systemKnexConfig,
    dbManager: systemDbManager,
  });
