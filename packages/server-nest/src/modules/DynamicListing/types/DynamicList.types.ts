import { ISortOrder } from '@/interfaces/Model';
import { IFilterRole } from '../DynamicFilter/DynamicFilter.types';

export interface IDynamicListFilter {
  customViewId?: number;
  filterRoles?: IFilterRole[];
  columnSortBy: ISortOrder;
  sortOrder: string;
  stringifiedFilterRoles: string;
  searchKeyword?: string;
}