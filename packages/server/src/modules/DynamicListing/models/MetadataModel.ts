import { get } from 'lodash';
import {
  IModelMeta,
  IModelMetaField,
  IModelMetaDefaultSort,
} from '@/interfaces/Model';
import { BaseModel } from '@/models/Model';

const defaultModelMeta = {
  fields: {},
  fields2: {},
};

export interface IMetadataModel {
  meta: IModelMeta;
  parsedMeta: IModelMeta;
  fields: { [key: string]: IModelMetaField };
  defaultSort: IModelMetaDefaultSort;
  defaultFilterField: string;

  getField(key: string, attribute?: string): IModelMetaField;
  getMeta(key?: string): IModelMeta;
}

type GConstructor<T = {}> = new (...args: any[]) => T;

export const MetadataModelMixin = <T extends GConstructor<BaseModel>>(
  Model: T,
) =>
  class ModelSettings extends Model {
    /**
     * Retrieve the model meta.
     * @returns {IModelMeta}
     */
    static get meta(): IModelMeta {
      throw new Error('');
    }

    /**
     * Parsed meta merged with default emta.
     * @returns {IModelMeta}
     */
    static get parsedMeta(): IModelMeta {
      return {
        ...defaultModelMeta,
        ...this.meta,
      };
    }

    /**
     * Retrieve specific model field meta of the given field key.
     * @param {string} key
     * @returns {IModelMetaField}
     */
    public static getField(key: string, attribute?: string): IModelMetaField {
      const field = get(this.meta.fields, key);

      return attribute ? get(field, attribute) : field;
    }

    /**
     * Retrieves the specific model meta.
     * @param {string} key
     * @returns
     */
    public static getMeta(key?: string) {
      return key ? get(this.parsedMeta, key) : this.parsedMeta;
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
