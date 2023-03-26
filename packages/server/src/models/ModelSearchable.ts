import { IModelMeta, ISearchRole } from '@/interfaces';

export default (Model) =>
  class ModelSearchable extends Model {
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
