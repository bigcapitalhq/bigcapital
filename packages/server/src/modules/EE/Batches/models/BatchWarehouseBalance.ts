import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

/** On-hand quantity of a batch in a specific warehouse. */
export class BatchWarehouseBalance extends TenantBaseModel {
  public id!: number;
  public batchId!: number;
  public warehouseId!: number;
  public quantityOnHand!: number;

  static get tableName() {
    return 'batch_warehouse_balances';
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
