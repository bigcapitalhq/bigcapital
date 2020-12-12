import { Model } from 'objection';
import {
  IMetadata,
  IMetableStoreStorage,
} from 'interfaces';
import MetableStore from './MetableStore';
import { isBlank } from 'utils';

export default class MetableDBStore extends MetableStore implements IMetableStoreStorage{
  model: Model;
  KEY_COLUMN: string;
  VALUE_COLUMN: string;
  TYPE_COLUMN: string;
  extraQuery: Function;
  loaded: Boolean;
 
  /**
   * Constructor method.
   */
  constructor() {
    super();

    this.loaded = false;
    this.KEY_COLUMN = 'key';
    this.VALUE_COLUMN = 'value';
    this.TYPE_COLUMN = 'type';
    this.model = null;

    this.extraQuery = (query, meta) => {
      const whereQuery = {
        key: meta[this.KEY_COLUMN],
        ...this.transfromMetaExtraColumns(meta),
      };
      query.where(whereQuery);
    };
  }

  /**
   * Transformes meta query.
   * @param {IMetadata} meta 
   */
  private transfromMetaExtraColumns(meta: IMetadata) {
    return this.extraColumns.reduce((obj, column) => {
      const metaValue = meta[column];

      if (!isBlank(metaValue)) {
        obj[column] = metaValue;
      }
      return obj;
    }, {});
  }

  /**
   * Set model of this metadata collection.
   * @param {Object} model -
   */
  setModel(model: Model) {
    this.model = model;
  }
  
  /**
   * Sets a extra query callback.
   * @param callback 
   */
  setExtraQuery(callback) {
    this.extraQuery = callback;
  }

  /**
   * Saves the modified, deleted and insert metadata.
   */
  save() {
    this.validateStoreIsLoaded();

    return Promise.all([
      this.saveUpdated(this.metadata),
      this.saveDeleted(this.metadata),
      this.saveInserted(this.metadata),
    ]);
  }
  
  /**
   * Saves the updated metadata.
   * @param {IMetadata[]} metadata -
   * @returns {Promise}
   */
  saveUpdated(metadata: IMetadata[]) {
    const updated = metadata.filter((m) => (m._markAsUpdated === true));
    const opers = [];

    updated.forEach((meta) => {
      const updateOper = this.model.query().onBuild((query) => {
        this.extraQuery(query, meta);
      }).patch({
        [this.VALUE_COLUMN]: meta.value,
      }).then(() => {
        meta._markAsUpdated = false;
      });
      opers.push(updateOper);
    });
    return Promise.all(opers);
  }

  /**
   * Saves the deleted metadata.
   * @param {IMetadata[]} metadata -
   * @returns {Promise}
   */
  saveDeleted(metadata: IMetadata[]) {
    const deleted = metadata.filter((m: IMetadata) => (m._markAsDeleted === true));
    const opers: Promise<void> = [];

    if (deleted.length > 0) {
      deleted.forEach((meta) => {
        const deleteOper = this.model.query().onBuild((query) => {
          this.extraQuery(query, meta);
        }).delete().then(() => {
          meta._markAsDeleted = false;
        });
        opers.push(deleteOper);
      });
    }
    return Promise.all(opers);
  }

  /**
   * Saves the inserted metadata.
   * @param {IMetadata[]} metadata -
   * @returns {Promise}
   */
  saveInserted(metadata: IMetadata[]) {
    const inserted = metadata.filter((m: IMetadata) => (m._markAsInserted === true));
    const opers: Promise<void> = [];

    inserted.forEach((meta) => {
      const insertData = {
        [this.KEY_COLUMN]: meta.key,
        [this.VALUE_COLUMN]: meta.value,
        ...this.transfromMetaExtraColumns(meta),
      };
      
      const insertOper = this.model.query()
        .insert(insertData)
        .then(() => {
          meta._markAsInserted = false;
        });
      opers.push(insertOper);
    });
    return Promise.all(opers);
  }

  /**
   * Loads the metadata from the storage.
   * @param {String|Array} key -
   * @param {Boolean} force -
   */
  async load() {
    const metadata = await this.model.query();
    const mappedMetadata = this.mapMetadataCollection(metadata);

    mappedMetadata.forEach((meta: IMetadata) => {
      this.metadata.push(meta);
    });
    this.loaded = true;
  }

  /**
   * Format the metadata before saving to the database.
   * @param {String|Number|Boolean} value -
   * @param {String} valueType -
   * @return {String|Number|Boolean} -
   */
  static formatMetaValue(value: string|number|boolean, valueType: string|false) {
    let parsedValue: string|number|boolean;

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
   * Mapping and parse metadata to collection entries.
   * @param {Meta} attr -
   * @param {String} parseType -
   */
  mapMetadata(metadata: IMetadata) {
    return {
      key: metadata[this.KEY_COLUMN],
      value: MetableDBStore.formatMetaValue(
        metadata[this.VALUE_COLUMN],
        this.TYPE_COLUMN ? metadata[this.TYPE_COLUMN] : false,
      ),
      ...this.extraColumns.reduce((obj, extraCol: string) => {
        obj[extraCol] = metadata[extraCol] || null;
        return obj;
      }, {}),
    };
  }

  /**
   * Parse the metadata to the collection.
   * @param {Array} collection -
   */
  mapMetadataCollection(metadata: IMetadata[]) {
    return metadata.map((model) => this.mapMetadata(model));
  }

  /**
   * Throw error in case the store is not loaded yet.
   */
  private validateStoreIsLoaded() {
    if (!this.loaded)  {
      throw new Error('You could not save the store before loaded from the storage.');
    }
  }
}
