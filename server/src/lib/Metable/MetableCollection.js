
export default class MetableCollection {
  /**
   * Constructor method.
   */
  constructor() {
    this.metadata = [];
    this.KEY_COLUMN = 'key';
    this.VALUE_COLUMN = 'value';
    this.TYPE_COLUMN = 'type';
    this.model = null;
    this.extraColumns = [];

    this.extraQuery = (query, meta) => {
      query.where('key', meta[this.KEY_COLUMN]);
    };
  }

  /**
   * Set model of this metadata collection.
   * @param {Object} model -
   */
  setModel(model) {
    this.model = model;
  }

  /**
   * Sets a extra columns.
   * @param {Array} columns -
   */
  setExtraColumns(columns) {
    this.extraColumns = columns;
  }

  /**
   * Find the given metadata key.
   * @param {String} key -
   * @return {object} - Metadata object.
   */
  findMeta(payload) {
    const { key, extraColumns } = this.parsePayload(payload);

    return this.allMetadata().find((meta) => {
      const isSameKey = meta.key === key;
      const sameExtraColumns = this.extraColumns.some((extraColumn) => {
        return !extraColumns || (extraColumns[extraColumn] === meta[extraColumn]);
      });
      return isSameKey && sameExtraColumns;
    });
  }

  /**
   * Retrieve all metadata.
   */
  allMetadata() {
    return this.metadata.filter((meta) => !meta.markAsDeleted);
  }

  /**
   * Retrieve metadata of the given key.
   * @param {String} key -
   * @param {Mixied} defaultValue -
   */
  getMeta(payload, defaultValue) {
    const metadata = this.findMeta(payload);
    return metadata ? metadata.value : defaultValue || false;
  }

  /**
   * Markes the metadata to should be deleted.
   * @param {String} key -
   */
  removeMeta(key) {
    const metadata = this.findMeta(key);

    if (metadata) {
      metadata.markAsDeleted = true;
    }
  }

  /**
   * Remove all meta data of the given group.
   * @param {*} group
   */
  removeAllMeta(group = 'default') {
    this.metadata = this.metadata.map((meta) => ({
      ...meta,
      markAsDeleted: true,
    }));
  }

  setExtraQuery(callback) {
    this.extraQuery = callback;
  }

  /**
   * Set the meta data to the stack.
   * @param {String} key -
   * @param {String} value -
   */
  setMeta(payload, ...args) {
    if (Array.isArray(key)) {
      const metadata = key;

      metadata.forEach((meta) => {
        this.setMeta(meta.key, meta.value);
      });
      return;
    }
    const { key, value, ...extraColumns } = this.parsePayload(payload, args[0]);
    const metadata = this.findMeta(payload);

    if (metadata) {
      metadata.value = value;
      metadata.markAsUpdated = true;
    } else {
      this.metadata.push({
        value, key, ...extraColumns, markAsInserted: true,
      });
    }
  }

  parsePayload(payload, value) {
    return typeof payload !== 'object' ? { key: payload, value } : { ...payload };
  }

  /**
   * Saved the modified/deleted and inserted metadata.
   */
  async saveMeta() {
    const inserted = this.metadata.filter((m) => (m.markAsInserted === true));
    const updated = this.metadata.filter((m) => (m.markAsUpdated === true));
    const deleted = this.metadata.filter((m) => (m.markAsDeleted === true));
    const opers = [];

    if (deleted.length > 0) {
      deleted.forEach((meta) => {
        const deleteOper = this.model.query().onBuild((query, result) => {
          this.extraQuery(query, meta);
          return result;
        }).delete();
        opers.push(deleteOper);
      });
    }
    inserted.forEach((meta) => {
      const insertOper = this.model.query().insert({
        [this.KEY_COLUMN]: meta.key,
        [this.VALUE_COLUMN]: meta.value,
        ...this.extraColumns.reduce((obj, column) => {
          if (typeof meta[column] !== 'undefined') {
            obj[column] = meta[column];
          }
          return obj;
        }, {}),
      });
      opers.push(insertOper);
    });
    updated.forEach((meta) => {
      const updateOper = this.model.query().onBuild((query) => {
        this.extraQuery(query, meta);
      }).patch({
        [this.VALUE_COLUMN]: meta.value,
      });
      opers.push(updateOper);
    });
    await Promise.all(opers);
  }

  /**
   * Loads the metadata from the storage.
   * @param {String|Array} key -
   * @param {Boolean} force -
   */
  async load() {
    const metadata = await this.query();

    const metadataArray = this.mapMetadataCollection(metadata);
    metadataArray.forEach((meta) => {
      this.metadata.push(meta);
    });
  }

  /**
   * Format the metadata before saving to the database.
   * @param {String|Number|Boolean} value -
   * @param {String} valueType -
   * @return {String|Number|Boolean} -
   */
  static formatMetaValue(value, valueType) {
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
   * Mapping and parse metadata to collection entries.
   * @param {Meta} attr -
   * @param {String} parseType -
   */
  mapMetadata(attr, parseType = 'parse') {
    return {
      key: attr[this.KEY_COLUMN],
      value: (parseType === 'parse')
        ? MetableCollection.parseMetaValue(
          attr[this.VALUE_COLUMN],
          this.TYPE_COLUMN ? attr[this.TYPE_COLUMN] : false,
        )
        : MetableCollection.formatMetaValue(
          attr[this.VALUE_COLUMN],
          this.TYPE_COLUMN ? attr[this.TYPE_COLUMN] : false,
        ),
      ...this.extraColumns.map((extraCol) => ({
        [extraCol]: attr[extraCol] || null,
      })),
    };
  }

  /**
   * Parse the metadata to the collection.
   * @param {Array} collection -
   */
  mapMetadataToCollection(metadata, parseType = 'parse') {
    return metadata.map((model) => this.mapMetadataToCollection(model, parseType));
  }

  /**
   * Load metadata to the metable collection.
   * @param {Array} meta -
   */
  from(meta) {
    if (Array.isArray(meta)) {
      meta.forEach((m) => { this.from(m); });
      return;
    }
    this.metadata.push(meta);
  }

  toArray() {
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
}
