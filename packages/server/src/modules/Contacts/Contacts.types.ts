import { IFilterRole } from '../DynamicListing/DynamicFilter/DynamicFilter.types';

export interface IContactsAutoCompleteFilter {
  limit: number;
  keyword: string;
  filterRoles?: IFilterRole[];
  columnSortBy: string;
  sortOrder: string;
}

export interface IContactAutoCompleteItem {
  displayName: string;
  contactService: string;
}
