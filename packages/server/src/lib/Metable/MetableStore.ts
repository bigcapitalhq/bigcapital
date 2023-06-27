import { Model } from 'objection';
import { omit, isEmpty } from 'lodash';
import { IMetadata, IMetaQuery, IMetableStore } from '@/interfaces';
import { itemsStartWith } from 'utils';

export default class MetableStore implements IMetableStore {
  metadata: IMetadata[];
  model: Model;
  extraColumns: string[];

  /**
   * Constructor method.
   */
  constructor() {
    this.metadata = [];
    this.model = null;
    this.extraColumns = [];
  }

  /**
   * Sets a extra columns.
   * @param {Array} columns -
   */
  setExtraColumns(columns: string[]): void {
    this.extraColumns = columns;
  }

  /**
   * Find the given metadata key.
   * @param {string|IMetaQuery} query -
   * @returns {IMetadata} - Metadata object.
   */
  find(query: string | IMetaQuery): IMetadata {
    const { key, value, ...extraColumns } = this.parseQuery(query);

    return this.metadata.find((meta: IMetadata) => {
      const isSameKey = meta.key === key;
      const sameExtraColumns = this.extraColumns.some(
        (extraColumn: string) => extraColumns[extraColumn] === meta[extraColumn]
      );

      const isSameExtraColumns = sameExtraColumns || isEmpty(extraColumns);

      return isSameKey && isSameExtraColumns;
    });
  }

  /**
   * Retrieve all metadata.
   * @returns {IMetadata[]}
   */
  all(): IMetadata[] {
    return this.metadata
      .filter((meta: IMetadata) => !meta._markAsDeleted)
      .map((meta: IMetadata) =>
        omit(meta, itemsStartWith(Object.keys(meta), '_'))
      );
  }

  /**
   * Retrieve metadata of the given key.
   * @param {String} key -
   * @param {Mixed} defaultValue -
   */
  get(query: string | IMetaQuery, defaultValue: any): any | false {
    const metadata = this.find(query);
    return metadata
      ? metadata.value
      : typeof defaultValue !== 'undefined'
      ? defaultValue
      : false;
  }

  /**
   * Marks the metadata to should be deleted.
   * @param {String} key -
   */
  remove(query: string | IMetaQuery): void {
    const metadata: IMetadata = this.find(query);

    if (metadata) {
      metadata._markAsDeleted = true;
    }
  }

  /**
   * Remove all meta data of the given group.
   * @param {string} group
   */
  removeAll(group: string = 'default'): void {
    this.metadata = this.metadata.map((meta) => ({
      ...meta,
      _markAsDeleted: true,
    }));
  }

  /**
   * Set the meta data to the stack.
   * @param {String} key -
   * @param {String} value -
   */
  set(query: IMetaQuery | IMetadata[] | string, metaValue?: any): void {
    if (Array.isArray(query)) {
      const metadata = query;

      metadata.forEach((meta: IMetadata) => {
        this.set(meta);
      });
      return;
    }
    const { key, value, ...extraColumns } = this.parseQuery(query);
    const metadata = this.find(query);
    const newValue = metaValue || value;

    if (metadata) {
      metadata.value = newValue;
      metadata._markAsUpdated = true;
    } else {
      this.metadata.push({
        value: newValue,
        key,
        ...extraColumns,
        _markAsInserted: true,
      });
    }
  }

  /**
   * Parses query query.
   * @param query
   * @param value
   */
  parseQuery(query: string | IMetaQuery): IMetaQuery {
    return typeof query !== 'object' ? { key: query } : { ...query };
  }

  /**
   * Format the metadata before saving to the database.
   * @param {string|number|boolean} value -
   * @param {string} valueType -
   * @return {string|number|boolean} -
   */
  static formatMetaValue(
    value: string | boolean | number,
    valueType: string
  ): string | number | boolean {
    let parsedValue;

    switch (valueType) {
      case 'number':
        parsedValue = `${value}`;
        break;
      case 'boolean':
        parsedValue = value ? '1' : '0';
        break;
      case 'json':
        parsedValue = JSON.stringify(parsedValue);
        break;
      default:
        parsedValue = value;
        break;
    }
    return parsedValue;
  }

  /**
   * Parse the metadata to the collection.
   * @param {Array} collection -
   */
  mapMetadataToCollection(metadata: IMetadata[], parseType: string = 'parse') {
    return metadata.map((model) =>
      this.mapMetadataToCollection(model, parseType)
    );
  }

  /**
   * Load metadata to the metable collection.
   * @param {Array} meta -
   */
  from(meta: []) {
    if (Array.isArray(meta)) {
      meta.forEach((m) => {
        this.from(m);
      });
      return;
    }
    this.metadata.push(meta);
  }

  /**
   *
   * @returns {array}
   */
  toArray(): IMetadata[] {
    return this.metadata;
  }

  /**
   * Static method to load metadata to the collection.
   * @param {Array} meta
   */
  static from(meta) {
    const collection = new MetableCollection();
    collection.from(meta);

    return collection;
  }

  /**
   * Reset the memorized metadata.
   */
  resetMetadata() {
    this.metadata = [];
  }
}
