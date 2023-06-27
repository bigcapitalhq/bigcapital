

export default {
  METADATA_GROUP: 'default',
  KEY_COLUMN: 'key',
  VALUE_COLUMN: 'value',
  TYPE_COLUMN: 'type',

  extraColumns: [],
  metadata: [],
  shouldReload: true,
  extraMetadataQuery: () => {},

  /**
   * Set the value column key to query from.
   * @param {String} name -
   */
  setKeyColumnName(name) {
    this.KEY_COLUMN = name;
  },

  /**
   * Set the key column name to query from.
   * @param {String} name -
   */
  setValueColumnName(name) {
    this.VALUE_COLUMN = name;
  },

  /**
   * Set extra columns to be added to the rows.
   * @param {Array} columns -
   */
  setExtraColumns(columns) {
    this.extraColumns = columns;
  },
 
  /**
   * Metadata database query.
   * @param {Object} query -
   * @param {String} groupName -
   */
  whereQuery(query, key) {
    const groupName = this.METADATA_GROUP;

    if (groupName) {
      query.where('group', groupName);
    }
    if (key) {
      if (Array.isArray(key)) {
        query.whereIn('key', key);
      } else {
        query.where('key', key);
      }
    }
  },

  /**
   * Loads the metadata from the storage.
   * @param {String|Array} key -
   * @param {Boolean} force -
   */
  async load(force = false) {
    if (this.shouldReload || force) {
      const metadataCollection = await this.query((query) => {
        this.whereQuery(query);
        this.extraMetadataQuery(query);
      }).fetchAll();

      this.shouldReload = false;
      this.metadata = [];

      const metadataArray = this.mapMetadataCollection(metadataCollection);
      metadataArray.forEach((metadata) => { this.metadata.push(metadata); });
    }
  },

  /**
   * Fetches all the metadata that associate with the current group.
   */
  async allMeta(force = false) {
    await this.load(force);
    return this.metadata;
  },

  /**
   * Find the given metadata key.
   * @param {String} key -
   * @return {object} - Metadata object.
   */
  findMeta(key) {
    return this.metadata.find((meta) => meta.key === key);
  },

  /**
   * Fetch the metadata of the current group.
   * @param {*} key -
   */
  async getMeta(key, defaultValue, force = false) {
    await this.load(force);

    const metadata = this.findMeta(key);
    return metadata ? metadata.value : defaultValue || false;
  },

  /**
   * Marks the metadata to should be deleted.
   * @param {String} key -
   */
  async removeMeta(key) {
    await this.load();
    const metadata = this.findMeta(key);

    if (metadata) {
      metadata.markAsDeleted = true;
    }
    this.shouldReload = true;
  

  /**
   * Remove all meta data of the given group.
   * @param {*} group
   */
  removeAllMeta(group = 'default') {
    this.metadata.map((meta) => ({
      ...(meta.group !== group) ? { markAsDeleted: true } : {},
      ...meta,
    }));
    this.shouldReload = true;
  },

  /**
   * Set the meta data to the stack.
   * @param {String} key -
   * @param {String} value -
   */
  async setMeta(key, value, payload) {
    if (Array.isArray(key)) {
      const metadata = key;
      metadata.forEach((meta) => {
        this.setMeta(meta.key, meta.value);
      });
      return;
    }

    await this.load();
    const metadata = this.findMeta(key);

    if (metadata) {
      metadata.value = value;
      metadata.markAsUpdated = true;
    } else {
      this.metadata.push({
        value, key, ...payload, markAsInserted: true,
      });
    }
  },

  /**
   * Saved the modified metadata.
   */
  async saveMeta() {
    const inserted = this.metadata.filter((m) => (m.markAsInserted === true));
    const updated = this.metadata.filter((m) => (m.markAsUpdated === true));
    const deleted = this.metadata.filter((m) => (m.markAsDeleted === true));

    const metadataDeletedKeys = deleted.map((m) => m.key);
    const metadataInserted = inserted.map((m) => this.mapMetadata(m, 'format'));
    const metadataUpdated = updated.map((m) => this.mapMetadata(m, 'format'));

    const batchUpdate = (collection) => knex.transaction((trx) => {
      const queries = collection.map((tuple) => {
        const query = knex(this.tableName);
        this.whereQuery(query, tuple.key);
        this.extraMetadataQuery(query);
        return query.update(tuple).transacting(trx);
      });
      return Promise.all(queries).then(trx.commit).catch(trx.rollback);
    });

    await Promise.all([
      knex.insert(metadataInserted).into(this.tableName),
      batchUpdate(metadataUpdated),
      metadataDeletedKeys.length > 0
        ? this.query('whereIn', this.KEY_COLUMN, metadataDeletedKeys).destroy({
          require: true,
        }) : null,
    ]);
    this.shouldReload = true;
  },

  /**
   * Purge all the cached metadata in the memory.
   */
  purgeMetadata() {
    this.metadata = [];
    this.shouldReload = true;
  },

  /**
   * Parses the metadata value.
   * @param {String} value -
   * @param {String} valueType -
   */
  parseMetaValue(value, valueType) {
    let parsedValue;

    switch (valueType) {
      case 'integer':
        parsedValue = parseInt(value, 10);
        break;
      case 'float':
        parsedValue = parseFloat(value);
        break;
      case 'boolean':
        parsedValue = Boolean(value);
        break;
      case 'json':
        parsedValue = JSON.parse(parsedValue);
        break;
      default:
        parsedValue = value;
        break;
    }
    return parsedValue;
  },

  /**
   * Format the metadata before saving to the database.
   * @param {String|Number|Boolean} value -
   * @param {String} valueType -
   * @return {String|Number|Boolean} -
   */
  formatMetaValue(value, valueType) {
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
  },

  mapMetadata(attr, parseType = 'parse') {
    return {
      key: attr[this.KEY_COLUMN],
      value: (parseType === 'parse')
        ? this.parseMetaValue(
          attr[this.VALUE_COLUMN],
          this.TYPE_COLUMN ? attr[this.TYPE_COLUMN] : false,
        )
        : this.formatMetaValue(
          attr[this.VALUE_COLUMN],
          this.TYPE_COLUMN ? attr[this.TYPE_COLUMN] : false,
        ),
      ...this.extraColumns.map((extraCol) => ({
        [extraCol]: attr[extraCol] || null,
      })),
    };
  },

  /**
   * Parse the metadata collection.
   * @param {Array} collection -
   */
  mapMetadataCollection(collection, parseType = 'parse') {
    return collection.map((model) => this.mapMetadata(model.attributes, parseType));
  },
};
