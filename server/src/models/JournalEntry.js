import TenantModel from '@/models/TenantModel';

export default class JournalEntry extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'manual_journals';
  }
}
