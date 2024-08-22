import SystemModel from '@/system/models/SystemModel';

export class OneClickDemo extends SystemModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'oneclick_demos';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt'];
  }
}
