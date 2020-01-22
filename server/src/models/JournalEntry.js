import BaseModel from '@/models/Model';

export default class JournalEntry extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'manual_journals';
  }
}
