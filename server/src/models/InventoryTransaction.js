import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class InventoryTransaction extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_transactions';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
