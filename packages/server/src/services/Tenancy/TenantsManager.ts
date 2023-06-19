import { Container, Inject, Service } from 'typedi';
import { ITenantManager, ITenant, ITenantDBManager } from '@/interfaces';
import {
  EventDispatcherInterface,
  EventDispatcher,
} from 'decorators/eventDispatcher';
import {
  TenantAlreadyInitialized,
  TenantAlreadySeeded,
  TenantDatabaseNotBuilt,
} from '@/exceptions';
import TenantDBManager from '@/services/Tenancy/TenantDBManager';
import events from '@/subscribers/events';
import { Tenant } from '@/system/models';
import { SeedMigration } from '@/lib/Seeder/SeedMigration';
import i18n from '../../loaders/i18n';

const ERRORS = {
  TENANT_ALREADY_CREATED: 'TENANT_ALREADY_CREATED',
  TENANT_NOT_EXISTS: 'TENANT_NOT_EXISTS',
};

// Tenants manager service.
@Service()
export default class TenantsManagerService implements ITenantManager {
  static instances: { [key: number]: ITenantManager } = {};

  @EventDispatcher()
  private eventDispatcher: EventDispatcherInterface;

  @Inject('repositories')
  private sysRepositories: any;

  private tenantDBManager: ITenantDBManager;

  /**
   * Constructor method.
   */
  constructor() {
    this.tenantDBManager = new TenantDBManager();
  }

  /**
   * Creates a new teant with unique organization id.
   * @param {ITenant} tenant
   * @return {Promise<ITenant>}
   */
  public async createTenant(): Promise<ITenant> {
    const { tenantRepository } = this.sysRepositories;
    const tenant = await tenantRepository.createWithUniqueOrgId();

    return tenant;
  }

  /**
   * Creates a new tenant database.
   * @param {ITenant} tenant -
   * @return {Promise<void>}
   */
  public async createDatabase(tenant: ITenant): Promise<void> {
    this.throwErrorIfTenantAlreadyInitialized(tenant);

    await this.tenantDBManager.createDatabase(tenant);

    this.eventDispatcher.dispatch(events.tenantManager.databaseCreated);
  }

  /**
   * Drops the database if the given tenant.
   * @param {number} tenantId
   */
  async dropDatabaseIfExists(tenant: ITenant) {
    // Drop the database if exists.
    await this.tenantDBManager.dropDatabaseIfExists(tenant);
  }

  /**
   * Determines the tenant has database.
   * @param   {ITenant} tenant
   * @returns {Promise<boolean>}
   */
  public async hasDatabase(tenant: ITenant): Promise<boolean> {
    return this.tenantDBManager.databaseExists(tenant);
  }

  /**
   * Migrates the tenant database.
   * @param  {ITenant} tenant
   * @return {Promise<void>}
   */
  public async migrateTenant(tenant: ITenant): Promise<void> {
    // Throw error if the tenant already initialized.
    this.throwErrorIfTenantAlreadyInitialized(tenant);

    // Migrate the database tenant.
    await this.tenantDBManager.migrate(tenant);

    // Mark the tenant as initialized.
    await Tenant.markAsInitialized(tenant.id);

    // Triggers `onTenantMigrated` event.
    this.eventDispatcher.dispatch(events.tenantManager.tenantMigrated, {
      tenantId: tenant.id,
    });
  }

  /**
   * Seeds the tenant database.
   * @param  {ITenant} tenant
   * @return {Promise<void>}
   */
  public async seedTenant(tenant: ITenant, tenancyContext): Promise<void> {
    // Throw error if the tenant is not built yet.
    this.throwErrorIfTenantNotBuilt(tenant);

    // Throw error if the tenant is not seeded yet.
    this.throwErrorIfTenantAlreadySeeded(tenant);

    // Seeds the organization database data.
    await new SeedMigration(tenancyContext.knex, tenancyContext).latest();

    // Mark the tenant as seeded in specific date.
    await Tenant.markAsSeeded(tenant.id);

    // Triggers `onTenantSeeded` event.
    this.eventDispatcher.dispatch(events.tenantManager.tenantSeeded, {
      tenantId: tenant.id,
    });
  }

  /**
   * Initialize knex instance or retrieve the instance of cache map.
   * @param {ITenant} tenant
   * @returns {Knex}
   */
  public setupKnexInstance(tenant: ITenant) {
    return this.tenantDBManager.setupKnexInstance(tenant);
  }

  /**
   * Retrieve tenant knex instance or throw error in case was not initialized.
   * @param {number} tenantId
   * @returns {Knex}
   */
  public getKnexInstance(tenantId: number) {
    return this.tenantDBManager.getKnexInstance(tenantId);
  }

  /**
   * Throws error if the tenant already seeded.
   * @throws {TenantAlreadySeeded}
   */
  private throwErrorIfTenantAlreadySeeded(tenant: ITenant) {
    if (tenant.seededAt) {
      throw new TenantAlreadySeeded();
    }
  }

  /**
   * Throws error if the tenant database is not built yut.
   * @param {ITenant} tenant
   */
  private throwErrorIfTenantNotBuilt(tenant: ITenant) {
    if (!tenant.initializedAt) {
      throw new TenantDatabaseNotBuilt();
    }
  }

  /**
   * Throws error if the tenant already migrated.
   * @throws {TenantAlreadyInitialized}
   */
  private throwErrorIfTenantAlreadyInitialized(tenant: ITenant) {
    if (tenant.initializedAt) {
      throw new TenantAlreadyInitialized();
    }
  }

  /**
   * Initialize seed migration context.
   * @param {ITenant} tenant
   * @returns
   */
  public getSeedMigrationContext(tenant: ITenant) {
    // Initialize the knex instance.
    const knex = this.setupKnexInstance(tenant);
    const i18nInstance = i18n();

    i18nInstance.setLocale(tenant.metadata.language);

    return {
      knex,
      i18n: i18nInstance,
      tenant,
    };
  }
}
