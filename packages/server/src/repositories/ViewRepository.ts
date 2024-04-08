import TenantRepository from '@/repositories/TenantRepository';
import { View } from '../models';

export default class ViewRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return View.bindKnex(this.knex);
  }

  /**
   * Retrieve all views of the given resource id.
   */
  allByResource(resourceModel: string, withRelations?) {
    return super.find({ resource_model: resourceModel }, withRelations);
  }
}
