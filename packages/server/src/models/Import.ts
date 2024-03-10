import TenantModel from 'models/TenantModel';

export default class Import extends TenantModel {
  mapping!: string;

  /**
   * Table name.
   */
  static get tableName() {
    return 'imports';
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['mappingParsed'];
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }

  public get mappingParsed() {
    try {
      return JSON.parse(this.mapping);
    } catch {
      return [];
    }
  }
}
