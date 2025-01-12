import * as R from 'ramda';
import { BaseModel } from '@/models/Model';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { CustomViewBaseModelMixin } from '@/modules/CustomViews/CustomViewBaseModel';
import { SearchableBaseModelMixin } from '@/modules/DynamicListing/models/SearchableBaseModel';
import { ResourceableModelMixin } from '@/modules/Resource/models/ResourcableModel';
import { MetadataModelMixin } from '@/modules/DynamicListing/models/MetadataModel';

const ExtendedItem = R.pipe(
  CustomViewBaseModelMixin,
  SearchableBaseModelMixin,
  ResourceableModelMixin,
  MetadataModelMixin
)(BaseModel);

export class Item extends ExtendedItem {
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
