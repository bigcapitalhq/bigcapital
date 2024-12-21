import * as F from 'fp-ts/function';
import * as R from 'ramda';
import { SearchableModel } from '@/modules/Search/SearchableMdel';
import { BaseModel } from '@/models/Model';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
// import { TenantModel } from '@/modules/System/models/TenantModel';

// const Extend = R.compose(SearchableModel)(TenantModel);

export class Item extends BaseModel {
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

  public readonly warehouse!: Warehouse;

  static get tableName() {
    return 'items';
  }
}
