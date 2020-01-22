
export default class MetableCollection {
  constructor() {
    this.metadata = [];
    this.KEY_COLUMN = 'key';
    this.VALUE_COLUMN = 'value';
    this.TYPE_COLUMN = 'type';
    this.model = null;
  }

  /**
   * Set model of this metadata collection.
   * @param {Object} model -
   */
  setModel(model) {
    this.model = model;
  }

  /**
   * Find the given metadata key.
   * @param {String} key -
   * @return {object} - Metadata object.
   */
  findMeta(key) {
    return this.allMetadata().find((meta) => meta.key === key);
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
  getMeta(key, defaultValue) {
    const metadata = this.findMeta(key);
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
    this.metadata.forEach(meta => {
      meta.markAsDeleted = true;
    });
  }

  /**
   * Set the meta data to the stack.
   * @param {String} key -
   * @param {String} value -
   */
  setMeta(key, value, payload) {
    if (Array.isArray(key)) {
      const metadata = key;

      metadata.forEach((meta) => {
        this.setMeta(meta.key, meta.value);
      });
      return;
    }
    const metadata = this.findMeta(key);

    if (metadata) {
      metadata.value = value;
      metadata.markAsUpdated = true;
    } else {
      this.metadata.push({
        value, key, ...payload, markAsInserted: true,
      });
    }
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
      const deleteOper = this.model.query()
        .whereIn('key', deleted.map((meta) => meta.key)).delete();

      opers.push(deleteOper);
    }
    inserted.forEach((meta) => {
      const insertOper = this.model.query().insert({
        [this.KEY_COLUMN]: meta.key,
        [this.VALUE_COLUMN]: meta.value,
      });
      opers.push(insertOper);
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
