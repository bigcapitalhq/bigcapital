import { Model, ModelObject } from 'objection';
import SystemModel from './SystemModel';

export class Import extends SystemModel {
  resource: string;
  tenantId: number;
  mapping!: string;
  columns!: string;
  params!: string;

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
    return ['createdAt', 'updatedAt'];
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

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Tenant = require('system/models/Tenant');

    return {
      /**
       * System user may belongs to tenant model.
       */
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tenant.default,
        join: {
          from: 'imports.tenantId',
          to: 'tenants.id',
        },
      },
    };
  }
}

export type ImportShape = ModelObject<Import>;
