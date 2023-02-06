import { get } from 'lodash';
import { IModelMeta, IModelMetaField, IModelMetaDefaultSort } from '@/interfaces';

export default (Model) =>
  class ModelSettings extends Model {
    /**
     *
     */
    static get meta(): IModelMeta {
      throw new Error('');
    }

    /**
     * Retrieve specific model field meta of the given field key.
     * @param {string} key
     * @returns {IModelMetaField}
     */
    public static getField(key: string, attribute?:string): IModelMetaField {
      const field = get(this.meta.fields, key);

      return attribute ? get(field, attribute) : field;
    }

    /**
     * Retrieve  the specific model meta.
     * @param {string} key
     * @returns
     */
    public static getMeta(key?: string) {
      return key ? get(this.meta, key): this.meta; 
    }

    /**
     * Retrieve the model meta fields.
     * @return {{ [key: string]: IModelMetaField }}
     */
    public static get fields(): { [key: string]: IModelMetaField } {
      return this.getMeta('fields');
    }

    /**
     * Retrieve the model default sort settings.
     * @return {IModelMetaDefaultSort}
     */
    public static get defaultSort(): IModelMetaDefaultSort {
      return this.getMeta('defaultSort');
    }

    /**
     * Retrieve the default filter field key.
     * @return {string}
     */
    public static get defaultFilterField(): string {
      return this.getMeta('defaultFilterField');
    }
  };
