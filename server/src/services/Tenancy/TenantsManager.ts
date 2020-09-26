import { Container, Inject, Service } from 'typedi';
import { ServiceError } from 'exceptions';
import {
  ITenantManager,
  ITenant,
  ITenantDBManager,
} from 'interfaces';
import {
  EventDispatcherInterface,
  EventDispatcher,
} from 'decorators/eventDispatcher';
import { TenantAlreadyInitialized, TenantAlreadySeeded, TenantDatabaseNotBuilt } from 'exceptions';
import TenantDBManager from 'services/Tenancy/TenantDBManager';
import events from 'subscribers/events';

const ERRORS = {
  TENANT_ALREADY_CREATED: 'TENANT_ALREADY_CREATED',
  TENANT_NOT_EXISTS:      'TENANT_NOT_EXISTS'
};

// Tenants manager service.
@Service()
export default class TenantsManagerService implements ITenantManager{
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
    const tenant = await tenantRepository.newTenantWithUniqueOrgId();

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
   * Detarmines the tenant has database.
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
  public async migrateTenant(tenant: ITenant) {
    this.throwErrorIfTenantAlreadyInitialized(tenant);

    const { tenantRepository } = this.sysRepositories;

    await this.tenantDBManager.migrate(tenant);
    await tenantRepository.markAsInitialized(tenant.id);

    this.eventDispatcher.dispatch(events.tenantManager.tenantMigrated, { tenant });
  }

  /**
   * Seeds the tenant database.
   * @param  {ITenant} tenant
   * @return {Promise<void>}
   */
  public async seedTenant(tenant: ITenant) {
    this.throwErrorIfTenantNotBuilt(tenant);
    this.throwErrorIfTenantAlreadySeeded(tenant);

    const { tenantRepository } = this.sysRepositories;

    // Seed the tenant database.
    await this.tenantDBManager.seed(tenant);

    // Mark the tenant as seeded in specific date.
    await tenantRepository.markAsSeeded(tenant.id);

    this.eventDispatcher.dispatch(events.tenantManager.tenantSeeded);
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
}
