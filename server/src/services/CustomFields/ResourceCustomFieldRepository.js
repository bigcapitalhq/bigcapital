import Resource from '@/models/Resource';
import ResourceField from '@/models/ResourceField';
import ResourceFieldMetadata from '@/models/ResourceFieldMetadata';
import ModelBase from '@/models/Model';

export default class ResourceCustomFieldRepository {

  constructor(model) {
    if (typeof model === 'function') {
      this.resourceName = model.name;
    } else if (typeof model === 'string') {
      this.resourceName = model;
    }

    // Custom fields of the given resource.
    this.customFields = [];
    this.filledCustomFields = [];

    // metadata of custom fields of the given resource.
    this.metadata = {};
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

    this.metadata[id] = metadata;
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
    return this.metadata[itemId] || this.metadata;
  }

  fillCustomFields(id, attributes) {
    if (typeof this.filledCustomFields[id] === 'undefined') {
      this.filledCustomFields[id] = [];
    }
    attributes.forEach((attr) => {
      this.filledCustomFields[id].push(attr);
      this.fieldsMetadata[id].setMeta(attr.key, attr.value);
    });
  }

  saveCustomFields(id) {
    this.fieldsMetadata.saveMeta();
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
    await Promise.all([
      this.loadResource(),
      this.loadResourceCustomFields(),
    ]);
  }
}