import TenantModel from '@/models/TenantModel';

export default class ManualJournal extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'manual_journals';
  }
}
