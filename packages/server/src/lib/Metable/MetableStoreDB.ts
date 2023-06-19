import { IMetadata, IMetableStoreStorage } from '@/interfaces';
import MetableStore from './MetableStore';
import { isBlank, parseBoolean } from 'utils';
import MetableConfig from './MetableConfig';
import config from '@/data/options'
export default class MetableDBStore
  extends MetableStore
  implements IMetableStoreStorage {
  repository: any;
  KEY_COLUMN: string;
  VALUE_COLUMN: string;
  TYPE_COLUMN: string;
  extraQuery: Function;
  loaded: Boolean;
  config: MetableConfig;

  /**
   * Constructor method.
   */
  constructor() {
    super();

    this.loaded = false;
    this.KEY_COLUMN = 'key';
    this.VALUE_COLUMN = 'value';
    this.TYPE_COLUMN = 'type';
    this.repository = null;

    this.extraQuery = (meta) => {
      return {
        key: meta[this.KEY_COLUMN],
        ...this.transformMetaExtraColumns(meta),
      };
    };
    this.config = new MetableConfig(config);
  }

  /**
   * Transforms meta query.
   * @param {IMetadata} meta
   */
  private transformMetaExtraColumns(meta: IMetadata) {
    return this.extraColumns.reduce((obj, column) => {
      const metaValue = meta[column];

      if (!isBlank(metaValue)) {
        obj[column] = metaValue;
      }
      return obj;
    }, {});
  }

  /**
   * Set repository entity of this metadata collection.
   * @param {Object} repository -
   */
  setRepository(repository) {
    this.repository = repository;
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
    const updated = metadata.filter((m) => m._markAsUpdated === true);
    const opers = [];

    updated.forEach((meta) => {
      const updateOper = this.repository
        .update(
          { [this.VALUE_COLUMN]: meta.value },
          { ...this.extraQuery(meta) }
        )
        .then(() => {
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
    const deleted = metadata.filter(
      (m: IMetadata) => m._markAsDeleted === true
    );
    const opers: Promise<void> = [];

    if (deleted.length > 0) {
      deleted.forEach((meta) => {
        const deleteOper = this.repository
          .deleteBy({
            ...this.extraQuery(meta),
          })
          .then(() => {
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
    const inserted = metadata.filter(
      (m: IMetadata) => m._markAsInserted === true
    );
    const opers: Promise<void> = [];

    inserted.forEach((meta) => {
      const insertData = {
        [this.KEY_COLUMN]: meta.key,
        [this.VALUE_COLUMN]: meta.value,
        ...this.transformMetaExtraColumns(meta),
      };
      const insertOper = this.repository.create(insertData).then(() => {
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
    const metadata = await this.repository.all();
    const mappedMetadata = this.mapMetadataCollection(metadata);

    this.resetMetadata();

    mappedMetadata.forEach((meta: IMetadata) => {
      this.metadata.push(meta);
    });
    this.loaded = true;
  }

  /**
   * Parse the metadata values after fetching it from the storage.
   * @param {String|Number|Boolean} value -
   * @param {String} valueType -
   * @return {String|Number|Boolean} -
   */
  static parseMetaValue(
    value: string,
    valueType: string | false
  ): string | boolean | number {
    let parsedValue: string | number | boolean;

    switch (valueType) {
      case 'number':
        parsedValue = parseFloat(value);
        break;
      case 'boolean':
        parsedValue = parseBoolean(value, false);
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
    const metaType = this.config.getMetaType(
      metadata[this.KEY_COLUMN],
      metadata['group'],
    );
    return {
      key: metadata[this.KEY_COLUMN],
      value: MetableDBStore.parseMetaValue(
        metadata[this.VALUE_COLUMN],
        metaType
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
    if (!this.loaded) {
      throw new Error(
        'You could not save the store before loaded from the storage.'
      );
    }
  }
}
