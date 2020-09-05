import { Service, Inject, Container } from 'typedi';
import { Tenant, SystemUser } from '@/system/models';
import TenantsManager from '@/system/TenantsManager';
import { ServiceError } from '@/exceptions';
import { ITenant } from '@/interfaces';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';

@Service()
export default class OrganizationService {
  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  tenantsManager: TenantsManager;

  @Inject('dbManager')
  dbManager: any;

  @Inject('logger')
  logger: any;

  /**
   * Builds the database schema and seed data of the given organization id.
   * @param {srting} organizationId 
   * @return {Promise<void>}
   */
  async build(organizationId: string): Promise<void> {
    const tenant = await Tenant.query().findOne('organization_id', organizationId);
    this.throwIfTenantNotExists(tenant);
    this.throwIfTenantInitizalized(tenant);

    this.logger.info('[tenant_db_build] tenant DB creating.', { tenant });
    await this.dbManager.createDb(`bigcapital_tenant_${tenant.organizationId}`);
    
    const tenantDb = this.tenantsManager.knexInstance(tenant.organizationId);

    this.logger.info('[tenant_db_build] tenant DB migrating to latest version.', { tenant });
    await tenantDb.migrate.latest();

    this.logger.info('[tenant_db_build] mark tenant as initialized.', { tenant });
    await tenant.$query().update({ initialized: true });

    // Retrieve the tenant system user.
    const user = await SystemUser.query().findOne('tenant_id', tenant.id);

    // Throws `onOrganizationBuild` event.
    this.eventDispatcher.dispatch(events.organization.build, { tenant, user });
  }

  /**
   * Throws error in case the given tenant is undefined.
   * @param {ITenant} tenant 
   */
  private throwIfTenantNotExists(tenant: ITenant) {
    if (!tenant) {
      this.logger.info('[tenant_db_build] organization id not found.');
      throw new ServiceError('tenant_not_found');
    }
  }

  /**
   * Throws error in case the given tenant is already initialized.
   * @param {ITenant} tenant 
   */
  private throwIfTenantInitizalized(tenant: ITenant) {
    if (tenant.initialized) {
      throw new ServiceError('tenant_initialized');
    }
  }
}