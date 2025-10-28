import { ISortOrder } from '@/interfaces/Model';
import { BaseModel } from '@/models/Model';
import { ICustomViewBaseModel } from '@/modules/CustomViews/CustomViewBaseModel';
import { IFilterRole } from '../DynamicFilter/DynamicFilter.types';
import { IMetadataModel } from '../models/MetadataModel';
import { ISearchableBaseModel } from '../models/SearchableBaseModel';

export interface IDynamicListFilter {
  customViewId?: number;
  filterRoles?: IFilterRole[];
  columnSortBy: ISortOrder;
  sortOrder: string;
  stringifiedFilterRoles: string;
  searchKeyword?: string;
}

export type MetableModel = typeof BaseModel &
  IMetadataModel &
  ISearchableBaseModel &
  ICustomViewBaseModel;
