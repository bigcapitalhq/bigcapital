import { View } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class ViewRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = View;
  }

  /**
   * Retrieve all views of the given resource id.
   */
  allByResource(resourceModel: string, withRelations?) {
    return super.find({ resource_mode: resourceModel }, withRelations);
  }
}