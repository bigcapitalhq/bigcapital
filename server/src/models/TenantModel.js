import BaseModel from '@/models/Model';

export default class TenantModel extends BaseModel {
  static tenant() {
    if (!this.knexBinded) {
      throw new Error('Tenant knex is not binded yet.');
    }
    return super.bindKnex(this.knexBinded);
  }
}
