import { Injectable } from '@nestjs/common';
import { TenantDBManager } from './TenantDBManager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModel } from '../System/models/TenantModel';
import {
  throwErrorIfTenantAlreadyInitialized,
  throwErrorIfTenantAlreadySeeded,
  throwErrorIfTenantNotBuilt,
} from './_utils';
import { SeedMigration } from '@/libs/migration-seed/SeedMigration';
import { TenantRepository } from '../System/repositories/Tenant.repository';

@Injectable()
export class TenantsManagerService {
  constructor(
    private readonly tenantDbManager: TenantDBManager,
    private readonly eventEmitter: EventEmitter2,
    private readonly tenantRepository: TenantRepository,
  ) {}

  /**
   * Creates a new teant with unique organization id.
   * @return {Promise<TenantModel>}
   */
  public async createTenant(): Promise<TenantModel> {
    return this.tenantRepository.createWithUniqueOrgId();
  }

  /**
   * Creates a new tenant database.
   * @param {ITenant} tenant -
   * @return {Promise<void>}
   */
  public async createDatabase(tenant: TenantModel): Promise<void> {
    throwErrorIfTenantAlreadyInitialized(tenant);

    await this.tenantDbManager.createDatabase(tenant);

    await this.eventEmitter.emitAsync(events.tenantManager.databaseCreated);
  }

  /**
   * Drops the database if the given tenant.
   * @param {number} tenantId
   */
  async dropDatabaseIfExists(tenant: TenantModel) {
    // Drop the database if exists.
    await this.tenantDbManager.dropDatabaseIfExists(tenant);
  }

  /**
   * Determines the tenant has database.
   * @param   {ITenant} tenant
   * @returns {Promise<boolean>}
   */
  public async hasDatabase(tenant: TenantModel): Promise<boolean> {
    return this.tenantDbManager.databaseExists(tenant);
  }

  /**
   * Migrates the tenant database.
   * @param  {ITenant} tenant
   * @return {Promise<void>}
   */
  public async migrateTenant(tenant: TenantModel): Promise<void> {
    // Throw error if the tenant already initialized.
    throwErrorIfTenantAlreadyInitialized(tenant);

    // Migrate the database tenant.
    await this.tenantDbManager.migrate(tenant);

    // Mark the tenant as initialized.
    await this.tenantRepository.markAsInitialized().findById(tenant.id);

    // Triggers `onTenantMigrated` event.
    this.eventEmitter.emitAsync(events.tenantManager.tenantMigrated, {
      tenantId: tenant.id,
    });
  }

  /**
   * Seeds the tenant database.
   * @param  {ITenant} tenant
   * @return {Promise<void>}
   */
  public async seedTenant(tenant: TenantModel, tenancyContext): Promise<void> {
    // Throw error if the tenant is not built yet.
    throwErrorIfTenantNotBuilt(tenant);

    // Throw error if the tenant is not seeded yet.
    throwErrorIfTenantAlreadySeeded(tenant);

    // Seeds the organization database data.
    await new SeedMigration(tenancyContext.knex, tenancyContext).latest();

    // Mark the tenant as seeded in specific date.
    await this.tenantRepository.markAsSeeded().findById(tenant.id);

    // Triggers `onTenantSeeded` event.
    this.eventEmitter.emitAsync(events.tenantManager.tenantSeeded, {
      tenantId: tenant.id,
    });
  }

  /**
   * Initialize knex instance or retrieve the instance of cache map.
   * @param {ITenant} tenant
   * @returns {Knex}
   */
  public setupKnexInstance(tenant: TenantModel) {
    // return this.tenantDbManager.setupKnexInstance(tenant);
  }

  /**
   * Retrieve tenant knex instance or throw error in case was not initialized.
   * @param {number} tenantId
   * @returns {Knex}
   */
  public getKnexInstance(tenantId: number) {
    return this.tenantDbManager.getKnexInstance(tenantId);
  }
}
