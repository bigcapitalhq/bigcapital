import { IDynamicListFilter } from 'interfaces/DynamicFilter';

export interface IItem{
  id: number,
  name: string,
  type: string,
  sku: string,

  sellable: boolean,
  purchasable: boolean,

  costPrice: number,
  sellPrice: number,
  currencyCode: string,

  costAccountId: number,
  sellAccountId: number,
  inventoryAccountId: number,

  sellDescription: string,
  purchaseDescription: string,

  quantityOnHand: number,
  note: string,

  categoryId: number,
  userId: number,

  createdAt: Date,
  updatedAt: Date,
}

export interface IItemDTO {
  name: string,
  type: string,
  sku: string,

  sellable: boolean,
  purchasable: boolean,

  costPrice: number,
  sellPrice: number,

  currencyCode: string,

  costAccountId: number,
  sellAccountId: number,
  inventoryAccountId: number,

  sellDescription: string,
  purchaseDescription: string,

  quantityOnHand: number,
  note: string,

  categoryId: number,
}

export interface IItemsService {
  bulkDeleteItems(tenantId: number, itemsIds: number[]): Promise<void>;

  getItem(tenantId: number, itemId: number): Promise<IItem>;
  deleteItem(tenantId: number, itemId: number): Promise<void>;
  editItem(tenantId: number, itemId: number, itemDTO: IItemDTO): Promise<IItem>;

  newItem(tenantId: number, itemDTO: IItemDTO): Promise<IItem>;

  itemsList(tenantId: number, itemsFilter: IItemsFilter): Promise<{items: IItem[]}>;
}

export interface IItemsFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string,
  page: number,
  pageSize: number,
};