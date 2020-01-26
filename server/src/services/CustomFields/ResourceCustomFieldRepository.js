import Resource from '@/models/Resource';
import ResourceField from '@/models/ResourceField';
import ResourceFieldMetadata from '@/models/ResourceFieldMetadata';
import ResourceFieldMetadataCollection from '@/collection/ResourceFieldMetadataCollection';

export default class ResourceCustomFieldRepository {
  /**
   * Class constructor.
   */
  constructor(model) {
    if (typeof model === 'function') {
      this.resourceName = model.name;
    } else if (typeof model === 'string') {
      this.resourceName = model;
    }
    // Custom fields of the given resource.
    this.customFields = [];
    this.filledCustomFields = {};

    // metadata of custom fields of the given resource.
    this.fieldsMetadata = {};
    this.resource = {};
  }

  /**
   * Fetches metadata of custom fields of the given resource.
   * @param {Integer} id - Resource item id.
   */
  async fetchCustomFieldsMetadata(id) {
    if (typeof id === 'undefined') {
      throw new Error('Please define the resource item id.');
    }
    if (!this.resource) {
      throw new Error('Target resource model is not found.');
    }
    const metadata = await ResourceFieldMetadata.query()
      .where('resource_id', this.resource.id)
      .where('resource_item_id', id);

    this.fieldsMetadata[id] = metadata;
  }

  /**
   * Load resource.
   */
  async loadResource() {
    const resource = await Resource.query().where('name', this.resourceName).first();

    if (!resource) {
      throw new Error('There is no stored resource in the storage with the given model name.');
    }
    this.setResource(resource);
  }

  /**
   * Load metadata of the resource.
   */
  async loadResourceCustomFields() {
    if (typeof this.resource.id === 'undefined') {
      throw new Error('Please fetch resource details before fetch custom fields of the resource.');
    }
    const customFields = await ResourceField.query()
      .where('resource_id', this.resource.id)
      .modify('whereNotPredefined');

    this.setResourceCustomFields(customFields);
  }

  /**
   * Sets resource model.
   * @param {Resource} resource -
   */
  setResource(resource) {
    this.resource = resource;
  }

  /**
   * Sets resource custom fields collection.
   * @param {Array} customFields -
   */
  setResourceCustomFields(customFields) {
    this.customFields = customFields;
  }

  /**
   * Retrieve metadata of the resource custom fields.
   * @param {Integer} itemId -
   */
  getMetadata(itemId) {
    return this.fieldsMetadata[itemId] || this.fieldsMetadata;
  }

  /**
   * Fill metadata of the custom fields that associated to the resource.
   * @param {Inter} id - Resource item id.
   * @param {Array} attributes -
   */
  fillCustomFields(id, attributes) {
    if (typeof this.filledCustomFields[id] === 'undefined') {
      this.filledCustomFields[id] = [];
    }
    attributes.forEach((attr) => {
      this.filledCustomFields[id].push(attr);

      if (!this.fieldsMetadata[id]) {
        this.fieldsMetadata[id] = new ResourceFieldMetadataCollection();
      }
      this.fieldsMetadata[id].setMeta(attr.key, attr.value, {
        resource_id: this.resource.id,
        resource_item_id: id,
      });
    });
  }

  /**
   * Saves the instered, updated and deleted  custom fields metadata.
   * @param {Integer} id - Optional resource item id.
   */
  async saveCustomFields(id) {
    if (id) {
      if (typeof this.fieldsMetadata[id] === 'undefined') {
        throw new Error('There is no resource item with the given id.');
      }
      await this.fieldsMetadata[id].saveMeta();
    } else {
      const opers = [];
      this.fieldsMetadata.forEach((metadata) => {
        const oper = metadata.saveMeta();
        opers.push(oper);
      });
      await Promise.all(opers);
    }
  }

  /**
   * Validates the exist custom fields.
   */
  validateExistCustomFields() {

  }

  toArray() {
    return this.fieldsMetadata.toArray();
  }

  async load() {
    await this.loadResource();
    await this.loadResourceCustomFields();
  }

  static forgeMetadataCollection() {

  }
}
