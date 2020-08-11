import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class InventoryLotCostTracker extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_cost_lot_tracker';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return [];
  }
}
