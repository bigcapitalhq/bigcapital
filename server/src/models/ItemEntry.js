import path from 'path';
import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class ItemEntry extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_entries';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {

    };
  }

  static calcAmount(itemEntry) {
    const { discount, quantity, rate } = itemEntry;
    const total = quantity * rate;

    return discount ? total - (total * discount * 0.01) : total;
  }
}
