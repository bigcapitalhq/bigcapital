import { Knex, knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { TenantDBAlreadyExists } from './exceptions/TenantDBAlreadyExists';
import { sanitizeDatabaseName } from '@/utils/sanitize-database-name';
import { ConfigService } from '@nestjs/config';
import { SystemKnexConnection } from '../System/SystemDB/SystemDB.constants';
import { Inject } from '@nestjs/common';

export class TenantDBManager {
  static knexCache: { [key: string]: Knex } = {};

  constructor(
    private readonly configService: ConfigService,

    @Inject(SystemKnexConnection)
    private readonly systemKnex: Knex,
  ) {}

  /**
   * Retrieve the tenant database name.
   * @return {string}
   */
  private getDatabaseName(tenant: ITenant) {
    return sanitizeDatabaseName(
      `${this.configService.get('tenant.db_name_prefix')}${tenant.organizationId}`,
    );
  }

  /**
   * Detarmines the tenant database weather exists.
   * @return {Promise<boolean>}
   */
  public async databaseExists(tenant: ITenant) {
    const databaseName = this.getDatabaseName(tenant);
    const results = await this.systemKnex.raw(
      'SELECT * FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = "' +
        databaseName +
        '"',
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
    await this.systemKnex.raw(
      `CREATE DATABASE ${databaseName} DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci`,
    );
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

    await this.systemKnex.raw(`DROP DATABASE IF EXISTS ${databaseName}`);
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
  private setupKnexInstance(tenant: ITenant) {
    const key: string = `${tenant.id}`;
    let knexInstance = TenantDBManager.knexCache[key];

    if (!knexInstance) {
      knexInstance = knex({
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
