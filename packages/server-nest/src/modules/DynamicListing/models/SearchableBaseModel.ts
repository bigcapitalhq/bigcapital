import { BaseModel } from '@/models/Model';
import { IModelMeta } from '@/interfaces/Model';
import { ISearchRole } from '../DynamicFilter.types';

type GConstructor<T = {}> = new (...args: any[]) => T;

export const SearchableBaseModelMixin = <T extends GConstructor<BaseModel>>(
  Model: T,
) =>
  class SearchableBaseModel extends Model {
    /**
     * Searchable model.
     */
    static get searchable(): IModelMeta {
      throw true;
    }

    /**
     * Search roles.
     */
    static get searchRoles(): ISearchRole[] {
      return [];
    }
  };
