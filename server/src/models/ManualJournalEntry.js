import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ManualJournalEntry extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'manual_journals_entries';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return [];
  }
}
