import { IModel, ISortOrder } from "./Model";

export interface IDynamicFilter {
  setModel(model: IModel): void;
  buildQuery(): void;
  getResponseMeta();
}

export interface IFilterRole {
  fieldKey: string;
  value: string;
  condition?: string;
  index?: number;
  comparator?: string;
}
export interface IDynamicListFilter {
  customViewId?: number;
  filterRoles?: IFilterRole[];
  columnSortBy: ISortOrder;
  sortOrder: string;
  stringifiedFilterRoles: string;
  searchKeyword?: string;
}

export interface IDynamicListService {
  dynamicList(
    tenantId: number,
    model: any,
    filter: IDynamicListFilter
  ): Promise<any>;
  handlerErrorsToResponse(error, req, res, next): void;
}

// Search role.
export interface ISearchRole {
  fieldKey: string;
  comparator: string;
}