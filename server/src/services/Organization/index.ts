import { Service, Inject } from 'typedi';
import { ServiceError } from 'exceptions';
import { ITenant } from 'interfaces';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import {
  TenantAlreadyInitialized,
  TenantAlreadySeeded,
  TenantDatabaseNotBuilt
} from 'exceptions';
import TenantsManager from 'services/Tenancy/TenantsManager';

const ERRORS = {
  TENANT_NOT_FOUND: 'tenant_not_found',
  TENANT_ALREADY_INITIALIZED: 'tenant_already_initialized',
  TENANT_ALREADY_SEEDED: 'tenant_already_seeded',
  TENANT_DB_NOT_BUILT: 'tenant_db_not_built',
};
@Service()
export default class OrganizationService {
  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject('logger')
  logger: any;

  @Inject('repositories')
  sysRepositories: any;

  @Inject()
  tenantsManager: TenantsManager;

  /**
   * Builds the database schema and seed data of the given organization id.
   * @param  {srting} organizationId 
   * @return {Promise<void>}
   */
  async build(organizationId: string): Promise<void> {
    const tenant = await this.getTenantByOrgIdOrThrowError(organizationId);
    this.throwIfTenantInitizalized(tenant);

    const tenantHasDB = await this.tenantsManager.hasDatabase(tenant);

    try {
      if (!tenantHasDB) {
        this.logger.info('[organization] trying to create tenant database.', { organizationId });
        await this.tenantsManager.createDatabase(tenant);
      }
      this.logger.info('[organization] trying to migrate tenant database.', { organizationId });
      await this.tenantsManager.migrateTenant(tenant);

      // Throws `onOrganizationBuild` event.
      this.eventDispatcher.dispatch(events.organization.build, { tenant });

    } catch (error) {
      if (error instanceof TenantAlreadyInitialized) {
        throw new ServiceError(ERRORS.TENANT_ALREADY_INITIALIZED);
      } else {
        throw error;
      }
    }
  }

  /**
   * Seeds initial core data to the given organization tenant.
   * @param  {number} organizationId 
   * @return {Promise<void>}
   */
  async seed(organizationId: string): Promise<void> {
    const tenant = await this.getTenantByOrgIdOrThrowError(organizationId);
    this.throwIfTenantSeeded(tenant);

    try {
      this.logger.info('[organization] trying to seed tenant database.', { organizationId });
      await this.tenantsManager.seedTenant(tenant);

      // Throws `onOrganizationBuild` event.
      this.eventDispatcher.dispatch(events.organization.seeded, { tenant });

    } catch (error) {
      if (error instanceof TenantAlreadySeeded) {
        throw new ServiceError(ERRORS.TENANT_ALREADY_SEEDED);
      } else if (error instanceof TenantDatabaseNotBuilt) {
        throw new ServiceError(ERRORS.TENANT_DB_NOT_BUILT);
      } else {
        throw error;
      }
    }
  }

  /**
   * Throws error in case the given tenant is undefined.
   * @param {ITenant} tenant 
   */
  private throwIfTenantNotExists(tenant: ITenant) {
    if (!tenant) {
      this.logger.info('[tenant_db_build] organization id not found.');
      throw new ServiceError(ERRORS.TENANT_NOT_FOUND);
    }
  }

  /**
   * Throws error in case the given tenant is already initialized.
   * @param {ITenant} tenant 
   */
  private throwIfTenantInitizalized(tenant: ITenant) {
    if (tenant.initializedAt) {
      throw new ServiceError(ERRORS.TENANT_ALREADY_INITIALIZED);
    }
  }

  /**
   * Throws service if the tenant already seeded.
   * @param {ITenant} tenant 
   */
  private throwIfTenantSeeded(tenant: ITenant) {
    if (tenant.seededAt) {
      throw new ServiceError(ERRORS.TENANT_ALREADY_SEEDED);
    }
  }

  /**
   * Retrieve tenant model by the given organization id or throw not found 
   * error if the tenant not exists on the storage.
   * @param  {string} organizationId 
   * @return {ITenant}
   */
  private async getTenantByOrgIdOrThrowError(organizationId: string) {
    const { tenantRepository } = this.sysRepositories;
    const tenant = await tenantRepository.getByOrgId(organizationId);
    this.throwIfTenantNotExists(tenant);

    return tenant;
  }
}