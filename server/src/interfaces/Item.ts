import { IFilterRole } from 'interfaces/DynamicFilter';

export interface IItem{
  id: number,
  name: string,
  type: string,
  code: string,

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
  active: boolean,

  categoryId: number,
  userId: number,

  createdAt: Date,
  updatedAt: Date,
}

export interface IItemDTO {
  name: string,
  type: string,
  code: string,

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
  active: boolean,

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

export interface IItemsFilter extends IDynamicListFilterDTO {
  stringifiedFilterRoles?: string,
  page: number,
  pageSize: number,
};

export interface IItemsAutoCompleteFilter {
  limit: number,
  keyword: string,
  filterRoles?: IFilterRole[];
  columnSortBy: string;
  sortOrder: string;
}