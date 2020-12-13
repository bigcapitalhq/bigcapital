import TenantRepository from 'repositories/TenantRepository';
import Setting from 'models/Setting';

export default class SettingRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = Setting;
  }
}