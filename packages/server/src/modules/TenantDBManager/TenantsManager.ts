import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { I18nService } from 'nestjs-i18n';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantDBManager } from './TenantDBManager';
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
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';

@Injectable()
export class TenantsManagerService {
  constructor(
    private readonly tenantDbManager: TenantDBManager,
    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
    private readonly tenantRepository: TenantRepository,
    private readonly i18nService: I18nService,

    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
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
  public async seedTenant(): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();

    // Throw error if the tenant is not built yet.
    throwErrorIfTenantNotBuilt(tenant);

    // Throw error if the tenant is not seeded yet.
    throwErrorIfTenantAlreadySeeded(tenant);

    const seedContext = await this.getSeedMigrationContext();

    // Seeds the organization database data.
    await new SeedMigration(this.tenantKnex(), seedContext).latest();

    // Mark the tenant as seeded in specific date.
    await this.tenantRepository.markAsSeeded().findById(tenant.id);

    // Triggers `onTenantSeeded` event.
    this.eventEmitter.emitAsync(events.tenantManager.tenantSeeded, {
      tenantId: tenant.id,
    });
  }

  /**
   * Initialize seed migration contxt.
   * @param {ITenant} tenant
   * @returns
   */
  public async getSeedMigrationContext() {
    const tenant = await this.tenancyContext.getTenant(true);

    return {
      knex: this.tenantKnex(),
      i18n: this.i18nService,
      tenant,
    };
  }
}
