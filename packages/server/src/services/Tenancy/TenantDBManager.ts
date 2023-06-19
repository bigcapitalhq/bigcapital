import { Container } from 'typedi';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { tenantKnexConfig, tenantSeedConfig } from '@/config/knexConfig';
import config from '@/config';
import { ITenant, ITenantDBManager } from '@/interfaces';
import SystemService from '@/services/Tenancy/SystemService';
import { TenantDBAlreadyExists } from '@/exceptions';

export default class TenantDBManager implements ITenantDBManager {
  static knexCache: { [key: string]: Knex } = {};

  // System database manager.
  dbManager: any;

  // System knex instance.
  sysKnex: Knex;

  /**
   * Constructor method.
   * @param {ITenant} tenant
   */
  constructor() {
    const systemService = Container.get(SystemService);

    this.dbManager = systemService.dbManager();
    this.sysKnex = systemService.knex();
  }

  /**
   * Retrieve the tenant database name.
   * @return {string}
   */
  private getDatabaseName(tenant: ITenant) {
    return `${config.tenant.db_name_prefix}${tenant.organizationId}`;
  }

  /**
   * Determines the tenant database weather exists.
   * @return {Promise<boolean>}
   */
  public async databaseExists(tenant: ITenant) {
    const databaseName = this.getDatabaseName(tenant);

    const results = await this.sysKnex.raw(
      'SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "' +
        databaseName +
        '"'
    );
    return results[0].length > 0;
  }

  /**
   * Creates a tenant database.
   * @throws {TenantAlreadyInitialized}
   * @return {Promise<void>}
   */
  public async createDatabase(tenant: ITenant): Promise<void> {
    await this.throwErrorIfTenantDBExists(tenant);

    const databaseName = this.getDatabaseName(tenant);
    await this.dbManager.createDb(databaseName);
  }

  /**
   * Dropdowns the tenant database if it was exist.
   * @param {ITenant} tenant -
   */
  public async dropDatabaseIfExists(tenant: ITenant) {
    const isExists = await this.databaseExists(tenant);

    if (!isExists) {
      return;
    }

    await this.dropDatabase(tenant);
  }

  /**
   * dropdowns the tenant's database.
   * @param {ITenant} tenant
   */
  public async dropDatabase(tenant: ITenant) {
    const databaseName = this.getDatabaseName(tenant);

    await this.dbManager.dropDb(databaseName);
  }

  /**
   * Migrate tenant database schema to the latest version.
   * @return {Promise<void>}
   */
  public async migrate(tenant: ITenant): Promise<void> {
    const knex = this.setupKnexInstance(tenant);

    await knex.migrate.latest();
  }

  /**
   * Seeds initial data to the tenant database.
   * @return {Promise<void>}
   */
  public async seed(tenant: ITenant): Promise<void> {
    const knex = this.setupKnexInstance(tenant);

    await knex.migrate.latest({
      ...tenantSeedConfig(tenant),
      disableMigrationsListValidation: true,
    });
  }

  /**
   * Retrieve the knex instance of tenant.
   * @return {Knex}
   */
  public setupKnexInstance(tenant: ITenant) {
    const key: string = `${tenant.id}`;
    let knexInstance = TenantDBManager.knexCache[key];

    if (!knexInstance) {
      knexInstance = Knex({
        ...tenantKnexConfig(tenant),
        ...knexSnakeCaseMappers({ upperCase: true }),
      });
      TenantDBManager.knexCache[key] = knexInstance;
    }
    return knexInstance;
  }

  /**
   * Retrieve knex instance from the givne tenant.
   */
  public getKnexInstance(tenantId: number) {
    const key: string = `${tenantId}`;
    let knexInstance = TenantDBManager.knexCache[key];

    if (!knexInstance) {
      throw new Error('Knex instance is not initialized yut.');
    }
    return knexInstance;
  }

  /**
   * Throws error if the tenant database already exists.
   * @return {Promise<void>}
   */
  async throwErrorIfTenantDBExists(tenant: ITenant) {
    const isExists = await this.databaseExists(tenant);
    if (isExists) {
      throw new TenantDBAlreadyExists();
    }
  }
}
