import { IDynamicListFilter } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';

export interface IItemsFilter extends IDynamicListFilter {
  page: number;
  pageSize: number;
  inactiveMode: boolean;
  viewSlug?: string;
}
