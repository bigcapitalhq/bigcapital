export interface IDynamicFilter {
  setTableName(tableName: string): void;
  buildQuery(): void;
}

export interface IFilterRole {
  fieldKey: string;
  value: string;
  condition?: string;
  index?: number;
  comparator?: string;
}

export interface IDynamicListFilterDTO {
  customViewId?: number;
  filterRoles?: IFilterRole[];
  columnSortBy: string;
  sortOrder: string;
}

export interface IDynamicListService {
  dynamicList(
    tenantId: number,
    model: any,
    filter: IDynamicListFilterDTO
  ): Promise<any>;
  handlerErrorsToResponse(error, req, res, next): void;
}
