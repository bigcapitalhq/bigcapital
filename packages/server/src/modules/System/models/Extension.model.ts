import { Model } from 'objection';
import { SystemModel } from './SystemModel';

export type ExtensionTrustLevel = 'core' | 'native' | 'partner' | 'third_party';

export type ExtensionStatus = 'installed' | 'active' | 'failed' | 'disabled';

/**
 * An installed extension.
 *
 * This is the system-wide catalog entry. Per-tenant enablement lives in
 * `ExtensionTenant`.
 */
export class Extension extends SystemModel {
  public extensionId!: string;
  public name!: string;
  public version!: string;
  public manifest!: Record<string, unknown>;
  public trust!: ExtensionTrustLevel;
  public status!: ExtensionStatus;
  public checksum?: string;
  public installedAt?: string;
  public updatedAt?: string;

  /**
   * Table name.
   */
  static get tableName() {
    return 'extensions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['installedAt', 'updatedAt'];
  }

  /**
   * Json schema.
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['extensionId', 'name', 'version', 'manifest', 'trust'],
      properties: {
        id: { type: 'integer' },
        extensionId: { type: 'string', maxLength: 128 },
        name: { type: 'string', maxLength: 255 },
        version: { type: 'string', maxLength: 32 },
        manifest: { type: 'object' },
        trust: {
          type: 'string',
          enum: ['core', 'native', 'partner', 'third_party'],
        },
        status: {
          type: 'string',
          enum: ['installed', 'active', 'failed', 'disabled'],
        },
        checksum: { type: ['string', 'null'], maxLength: 64 },
        installedAt: { type: ['string', 'null'] },
        updatedAt: { type: ['string', 'null'] },
      },
    };
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const { ExtensionTenant } = require('./ExtensionTenant.model');

    return {
      tenants: {
        relation: Model.HasManyRelation,
        modelClass: ExtensionTenant,
        join: {
          from: 'extensions.extensionId',
          to: 'extension_tenants.extensionId',
        },
      },
    };
  }
}
