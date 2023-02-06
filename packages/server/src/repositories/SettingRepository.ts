import TenantRepository from '@/repositories/TenantRepository';
import Setting from 'models/Setting';

export default class SettingRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Setting.bindKnex(this.knex);
  }
}