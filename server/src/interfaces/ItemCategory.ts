


export interface IItemCategory {
  name: string,

  parentCategoryId?: number,
  description?: string,
  userId: number,

  costAccountId?: number,
  sellAccountId?: number,
  inventoryAccountId?: number,

  costMethod?: string,
};

export interface IItemCategoryOTD {
  name: string,

  parentCategoryId?: number,
  description?: string,
  userId: number,

  costAccountId?: number,
  sellAccountId?: number,
  inventoryAccountId?: number,

  costMethod?: string,
};