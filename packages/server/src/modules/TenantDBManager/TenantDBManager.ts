// @ts-nocheck
import { Knex, knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { TenantDBAlreadyExists } from './exceptions/TenantDBAlreadyExists';
import { sanitizeDatabaseName } from '@/utils/sanitize-database-name';
import { ConfigService } from '@nestjs/config';
import { SystemKnexConnection } from '../System/SystemDB/SystemDB.constants';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModel } from '../System/models/TenantModel';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';

@Injectable()
export class TenantDBManager {
  static knexCache: { [key: string]: Knex } = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly tenancyContext: TenancyContext,

    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,

    @Inject(SystemKnexConnection)
    private readonly systemKnex: Knex,
  ) { }

  /**
   * Retrieves the tenant database name.
   * @return {string}
   */
  private getDatabaseName(tenant: TenantModel) {
    return sanitizeDatabaseName(
      `${this.configService.get('tenantDatabase.dbNamePrefix')}${tenant.organizationId}`,
    );
  }

  /**
   * Determines the tenant database weather exists.
   * @return {Promise<boolean>}
   */
  public async databaseExists() {
    const tenant = await this.tenancyContext.getTenant();
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
  public async createDatabase(): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const databaseName = this.getDatabaseName(tenant);

    await this.throwErrorIfTenantDBExists(tenant);

    await this.systemKnex.raw(
      `CREATE DATABASE ${databaseName} DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci`,
    );
  }

  /**
   * Dropdowns the tenant database if it was exist.
   * @param {ITenant} tenant -
   */
  public async dropDatabaseIfExists() {
    const tenant = await this.tenancyContext.getTenant();
    const isExists = await this.databaseExists();

    if (!isExists) {
      return;
    }
    await this.dropDatabase();
  }

  /**
   * dropdowns the tenant's database.
   */
  public async dropDatabase() {
    const tenant = await this.tenancyContext.getTenant();
    const databaseName = this.getDatabaseName(tenant);

    await this.systemKnex.raw(`DROP DATABASE IF EXISTS ${databaseName}`);
  }

  /**
   * Migrate tenant database schema to the latest version.
   * @return {Promise<void>}
   */
  public async migrate(): Promise<void> {
    await this.tenantKnex().migrate.latest();
  }

  /**
   * Seeds initial data to the tenant database.
   * @return {Promise<void>}
   */
  public async seed(): Promise<void> {
    await this.tenantKnex().migrate.latest({
      ...tenantSeedConfig(tenant),
      disableMigrationsListValidation: true,
    });
  }

  /**
   * Throws error if the tenant database already exists.
   * @return {Promise<void>}
   */
  async throwErrorIfTenantDBExists(tenant: TenantModel) {
    const isExists = await this.databaseExists();
    if (isExists) {
      throw new TenantDBAlreadyExists();
    }
  }
}
