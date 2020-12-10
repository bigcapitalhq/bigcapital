import { omit } from 'lodash';
import TenantRepository from 'repositories/TenantRepository';

export default class ViewRoleRepository extends TenantRepository {

  allByView(viewId: number) {
    const { ViewRole } = this.models;
    return this.cache.get(`viewRole.view.${viewId}`, async () => {
      return ViewRole.query().where('view_id', viewId);
    });
  }
}