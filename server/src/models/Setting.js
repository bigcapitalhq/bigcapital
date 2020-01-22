import BaseModel from '@/models/Model';
import Auth from './Auth';

export default class Setting extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'settings';
  }

  /**
   * Timestamp columns.
   */
  static get hasTimestamps() {
    return false;
  }

  /**
   * Extra metadata query to query with the current authenticate user.
   * @param {Object} query
   */
  static extraMetadataQuery(query) {
    if (Auth.isLogged()) {
      query.where('user_id', Auth.userId());
    }
  }
}
