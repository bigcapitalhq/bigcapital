import { IDynamicListFilter } from 'interfaces/DynamicFilter';

export interface IItem{
  id: number,
  name: string,
  type: string,
}

export interface IItemsService {

}

export interface IItemsFilter extends IDynamicListFilter {
  stringifiedFilterRoles?: string,
  page?: number,
  pageSize?: number,
};