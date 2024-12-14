import { ApiProperty } from '@nestjs/swagger';
import { Knex } from 'knex';
import { Item } from '@/modules/Items/models/Item';
// import { AbilitySubject } from '@/interfaces';
// import { IFilterRole } from '@/interfaces/DynamicFilter';

export interface IItem {
  id: number;
  name: string;
  type: string;
  code: string;

  sellable: boolean;
  purchasable: boolean;

  costPrice: number;
  sellPrice: number;
  currencyCode: string;

  costAccountId: number;
  sellAccountId: number;
  inventoryAccountId: number;

  sellDescription: string;
  purchaseDescription: string;

  sellTaxRateId: number;
  purchaseTaxRateId: number;

  quantityOnHand: number;

  note: string;
  active: boolean;

  categoryId: number;
  userId: number;

  createdAt: Date;
  updatedAt: Date;
}

export class IItemDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  sellable: boolean;

  @ApiProperty()
  purchasable: boolean;

  @ApiProperty()
  costPrice: number;

  @ApiProperty()
  sellPrice: number;

  @ApiProperty()
  currencyCode: string;

  @ApiProperty()
  costAccountId: number;

  @ApiProperty()
  sellAccountId: number;

  @ApiProperty()
  inventoryAccountId: number;

  @ApiProperty()
  sellDescription: string;

  @ApiProperty()
  purchaseDescription: string;

  @ApiProperty()
  sellTaxRateId: number;

  @ApiProperty()
  purchaseTaxRateId: number;

  @ApiProperty()
  quantityOnHand: number;

  @ApiProperty()
  note: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  categoryId: number;
}

export interface IItemCreateDTO extends IItemDTO {}
export interface IItemEditDTO extends IItemDTO {}

// export interface IItemsService {
//   getItem(tenantId: number, itemId: number): Promise<IItem>;
//   deleteItem(tenantId: number, itemId: number): Promise<void>;
//   editItem(tenantId: number, itemId: number, itemDTO: IItemDTO): Promise<IItem>;
//   newItem(tenantId: number, itemDTO: IItemDTO): Promise<IItem>;
//   itemsList(
//     tenantId: number,
//     itemsFilter: IItemsFilter,
//   ): Promise<{ items: IItem[] }>;
// }

// export interface IItemsFilter extends IDynamicListFilterDTO {
//   stringifiedFilterRoles?: string;
//   page: number;
//   pageSize: number;
//   inactiveMode: boolean;
//   viewSlug?: string;
// }

// export interface IItemsAutoCompleteFilter {
//   limit: number;
//   keyword: string;
//   filterRoles?: IFilterRole[];
//   columnSortBy: string;
//   sortOrder: string;
// }

export interface IItemEventCreatedPayload {
  tenantId: number;
  item: Item;
  itemId: number;
  trx: Knex.Transaction;
}

export interface IItemEventEditedPayload {
  item: Item;
  oldItem: Item;
  itemId: number;
  trx: Knex.Transaction;
}

export interface IItemEventDeletingPayload {
  tenantId: number;
  trx: Knex.Transaction;
  oldItem: IItem;
}

export interface IItemEventDeletedPayload {
  tenantId: number;
  oldItem: IItem;
  itemId: number;
  trx: Knex.Transaction;
}

export enum ItemAction {
  CREATE = 'Create',
  EDIT = 'Edit',
  DELETE = 'Delete',
  VIEW = 'View',
}

// export type ItemAbility = [ItemAction, AbilitySubject.Item];
