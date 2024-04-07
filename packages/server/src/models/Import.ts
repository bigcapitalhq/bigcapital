import TenantModel from '../models/TenantModel';

export default class Import extends TenantModel {
  resource!: string;
  mapping!: string;
  columns!: string;
  params!: Record<string, any>;

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

  /**
   * Detarmines whether the import is mapped.
   * @returns {boolean}
   */
  public get isMapped() {
    return Boolean(this.mapping);
  }

  public get columnsParsed() {
    try {
      return JSON.parse(this.columns);
    } catch {
      return [];
    }
  }

  public get paramsParsed() {
    try {
      return JSON.parse(this.params);
    } catch {
      return [];
    }
  }

  public get mappingParsed() {
    try {
      return JSON.parse(this.mapping);
    } catch {
      return [];
    }
  }
}
