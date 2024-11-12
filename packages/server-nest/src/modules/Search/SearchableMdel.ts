import * as O from 'objection';
import { IModelMeta, } from '@/interfaces/Model';

export const SearchableModel: O.Plugin = (Model) =>
    // @ts-ignore
  class extends Model {
    additionalProperty: string;

    /**
     * Searchable model.
     */
    static get searchable(): IModelMeta {
      throw true;
    }

    /**
     * Search roles.
     */
    // static get searchRoles(): ISearchRole[] {
    //   return [];
    // }
  };