import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class Item extends TenantBaseModel{
  public readonly quantityOnHand: number;
  public readonly name: string;
  public readonly active: boolean;
  public readonly type: string;
  public readonly code: string;
  public readonly sellable: boolean;
  public readonly purchasable: boolean;
  public readonly costPrice: number;
  public readonly sellPrice: number;
  public readonly currencyCode: string;
  public readonly costAccountId: number;
  public readonly inventoryAccountId: number;
  public readonly categoryId: number;
  public readonly pictureUri: string;
  public readonly sellAccountId: number;
  public readonly sellDescription: string;
  public readonly purchaseDescription: string;
  public readonly landedCost: boolean;
  public readonly note: string;
  public readonly userId: number;

  public readonly warehouse!: Warehouse;

  static get tableName() {
    return 'items';
  }
}
