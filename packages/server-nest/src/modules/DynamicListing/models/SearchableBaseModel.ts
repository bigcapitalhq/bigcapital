import { BaseModel } from '@/models/Model';
import { IModelMeta } from '@/interfaces/Model';
import { ISearchRole } from '../DynamicFilter/DynamicFilter.types';

type GConstructor<T = {}> = new (...args: any[]) => T;

export interface ISearchableBaseModel {
  searchRoles: ISearchRole[];
}

export const SearchableBaseModelMixin = <T extends GConstructor<BaseModel>>(
  Model: T,
) =>
  class SearchableBaseModel extends Model {
    /**
     * Searchable model.
     */
    static get searchable(): boolean {
      throw true;
    }

    /**
     * Search roles.
     */
    static get searchRoles(): ISearchRole[] {
      return [];
    }
  };
