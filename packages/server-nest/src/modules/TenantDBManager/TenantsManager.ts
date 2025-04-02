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
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Injectable()
export class TenantsManagerService {
  constructor(
    private readonly tenantDbManager: TenantDBManager,
    private readonly tenancyContext: TenancyContext,
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
   * @return {Promise<void>}
   */
  public async createDatabase(): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    throwErrorIfTenantAlreadyInitialized(tenant);

    await this.tenantDbManager.createDatabase();
    await this.eventEmitter.emitAsync(events.tenantManager.databaseCreated);
  }

  /**
   * Drops the database if the given tenant.
   * @param {number} tenantId
   */
  async dropDatabaseIfExists() {
    await this.tenantDbManager.dropDatabaseIfExists();
  }

  /**
   * Determines the tenant has database.
   * @param   {ITenant} tenant
   * @returns {Promise<boolean>}
   */
  public async hasDatabase(): Promise<boolean> {
    return this.tenantDbManager.databaseExists();
  }

  /**
   * Migrates the tenant database.
   * @return {Promise<void>}
   */
  public async migrateTenant(): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
   
    // Throw error if the tenant already initialized.
    throwErrorIfTenantAlreadyInitialized(tenant);

    // Migrate the database tenant.
    await this.tenantDbManager.migrate();

    // Mark the tenant as initialized.
    await this.tenantRepository.markAsInitialized().findById(tenant.id);

    // Triggers `onTenantMigrated` event.
    this.eventEmitter.emitAsync(events.tenantManager.tenantMigrated, {
      tenantId: tenant.id,
    });
  }

  /**
   * Seeds the tenant database.
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
}
