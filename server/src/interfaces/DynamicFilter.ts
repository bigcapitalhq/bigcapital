
export interface IDynamicFilter {
  setTableName(tableName: string): void;
  buildQuery(): void;
}

export interface IFilterRole {
  fieldKey: string,
  value: string,
  condition?: string,
  index?: number,
  comparator?: string,
};

export interface IDynamicListFilterDTO {
  customViewId?: number,
  filterRoles?: IFilterRole[],
  columnSortBy: string,
  sortOrder: string,
}