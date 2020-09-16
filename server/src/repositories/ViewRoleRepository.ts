import { omit } from 'lodash';
import TenantRepository from 'repositories/TenantRepository';

export default class ViewRoleRepository extends TenantRepository {
  models: any;
  cache: any;
  repositories: any;

  /**
   * Constructor method.
   * @param {number} tenantId - The given tenant id.
   */
  constructor(
    tenantId: number,
  ) {
    super(tenantId);

    this.models = this.tenancy.models(tenantId);
    this.cache = this.tenancy.cache(tenantId);
    this.repositories = this.tenancy.cache(tenantId);
  }

  allByView(viewId: number) {
    const { ViewRole } = this.models;
    return this.cache.get(`viewRole.view.${viewId}`, async () => {
      return ViewRole.query().where('view_id', viewId);
    });
  }
}