import { View } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class ViewRepository extends TenantRepository {
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

  /**
   * Retrieve view model by the given id.
   * @param {number} id -
   */
  getById(id: number) {
    const { View } = this.models;
    return this.cache.get(`customView.id.${id}`, () => {
      return View.query().findById(id);
    });
  }

  /**
   * Retrieve all views of the given resource id.
   */
  allByResource() {
    const resourceId = 1;
    return this.cache.get(`customView.resource.id.${resourceId}`, () => {
      return View.query().where('resource_id', resourceId);
    });
  }
}