import TenantModel from 'models/TenantModel';

export default class BillLandedCostEntry extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'bill_located_cost_entries';
  }
}
