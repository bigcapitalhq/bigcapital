import { Model } from 'objection';
import { SystemModel } from './SystemModel';
import type { Extension } from './Extension.model';

export type ExtensionTenantStatus =
  | 'enabled'
  | 'disabled'
  | 'migrating'
  | 'failed';

/**
 * Per-tenant extension enablement and state.
 */
export class ExtensionTenant extends SystemModel {
  public id!: number;
  public extensionId!: string;
  public organizationId!: string;
  public version!: string;
  public status!: ExtensionTenantStatus;
  public settings?: Record<string, unknown>;
  public lastError?: string;
  public enabledAt?: string;
  public disabledAt?: string;
  public createdAt?: string;
  public updatedAt?: string;

  public extension?: Extension;

  /**
   * Table name.
   */
  static get tableName() {
    return 'extension_tenants';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Json schema.
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['extensionId', 'organizationId', 'version'],
      properties: {
        id: { type: 'integer' },
        extensionId: { type: 'string', maxLength: 128 },
        organizationId: { type: 'string', maxLength: 64 },
        version: { type: 'string', maxLength: 32 },
        status: {
          type: 'string',
          enum: ['enabled', 'disabled', 'migrating', 'failed'],
        },
        settings: { type: ['object', 'null'] },
        lastError: { type: ['string', 'null'] },
        enabledAt: { type: ['string', 'null'] },
        disabledAt: { type: ['string', 'null'] },
        createdAt: { type: ['string', 'null'] },
        updatedAt: { type: ['string', 'null'] },
      },
    };
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const { Extension } = require('./Extension.model');

    return {
      extension: {
        relation: Model.BelongsToOneRelation,
        modelClass: Extension,
        join: {
          from: 'extension_tenants.extensionId',
          to: 'extensions.extensionId',
        },
      },
    };
  }
}
