import BaseModel from '@/models/Model';

export default class ManualJournal extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'manual_journals';
  }
}
