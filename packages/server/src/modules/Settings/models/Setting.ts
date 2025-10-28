import { BaseModel } from '@/models/Model';
// import TenantModel from 'models/TenantModel';
// import Auth from './Auth';

export class Setting extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'settings';
  }

  /**
   * Extra metadata query to query with the current authenticate user.
   * @param {Object} query
   */
  // static extraMetadataQuery(query) {
  //   if (Auth.isLogged()) {
  //     query.where('user_id', Auth.userId());
  //   }
  // }
}
