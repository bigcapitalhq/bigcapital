import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class Customer extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'customers';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterCustomerIds(query, customerIds) {
        query.whereIn('id', customerIds);
      },
    };
  }
}
