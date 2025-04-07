import { BaseModel } from '@/models/Model';

export type ISortOrder = 'DESC' | 'ASC';

export interface IDynamicFilter {
  setModel(model: typeof BaseModel): void;
  onInitialize(): void;
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
  sortOrder: ISortOrder;
  stringifiedFilterRoles?: string;
  searchKeyword?: string;
  viewSlug?: string;
}

export interface IDynamicListService {
  dynamicList(
    model: any,
    filter: IDynamicListFilter,
  ): Promise<any>;
  handlerErrorsToResponse(error, req, res, next): void;
}

// Search role.
export interface ISearchRole {
  fieldKey: string;
  comparator: string;
}
