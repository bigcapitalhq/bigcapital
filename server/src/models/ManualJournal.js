import TenantModel from '@/models/Model';

export default class ManualJournal extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'manual_journals';
  }
}
