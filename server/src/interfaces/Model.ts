

export interface IModel {
  name: string,
  tableName: string,
  fields: { [key: string]: any, },
};

export interface IFilterMeta {
  sortOrder: string,
  sortBy: string,
};

export interface IPaginationMeta {
  pageSize: number,
  page: number,
};