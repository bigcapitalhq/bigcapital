import { Inject } from 'typedi';
import moment from "moment";
import { Tenant } from 'system/models';
import SystemRepository from "./SystemRepository";
import { ITenant } from 'interfaces';
import uniqid from 'uniqid';

export default class TenantRepository extends SystemRepository {
  @Inject('cache')
  cache: any;

  /**
   * Flush the given tenant stored cache.
   * @param {ITenant} tenant 
   */
  flushTenantCache(tenant: ITenant) {
    this.cache.del(`tenant.org.${tenant.organizationId}`);
    this.cache.del(`tenant.id.${tenant.id}`);
  }

  /**
   * Creates a new tenant with random organization id.
   * @return {ITenant}
   */
  newTenantWithUniqueOrgId(uniqId?: string): Promise<ITenant>{
    const organizationId = uniqid() || uniqId;
    return Tenant.query().insert({ organizationId });
  }

  /**
   * Mark as seeded.
   * @param {number} tenantId 
   */
  async markAsSeeded(tenantId: number) {
    const tenant = await Tenant.query()
      .patchAndFetchById(tenantId, {
        seeded_at: moment().toMySqlDateTime(),
      });
    this.flushTenantCache(tenant);
  }

  /**
   * Mark the the given organization as initialized.
   * @param {string} organizationId 
   */
  async markAsInitialized(tenantId: number) {
    const tenant = await Tenant.query()
      .patchAndFetchById(tenantId, {
        initialized_at: moment().toMySqlDateTime(),
      });
    this.flushTenantCache(tenant);
  }

  /**
   * Retrieve tenant details by the given organization id.
   * @param {string} organizationId 
   */
  getByOrgId(organizationId: string) {
    return this.cache.get(`tenant.org.${organizationId}`, () => {
      return Tenant.query().findOne('organization_id', organizationId);
    });
  }

  /**
   * Retrieve tenant details by the given tenant id.
   * @param {string} tenantId - Tenant id.
   */
  getById(tenantId: number) {
    return this.cache.get(`tenant.id.${tenantId}`, () => {
      return Tenant.query().findById(tenantId);
    });
  }

  /**
   * Retrieve tenant details with associated subscriptions
   * and plans by the given tenant id.
   * @param {number} tenantId - Tenant id.
   */
  getByIdWithSubscriptions(tenantId: number) {
    return Tenant.query().findById(tenantId)
      .withGraphFetched('subscriptions.plan');
  }
}