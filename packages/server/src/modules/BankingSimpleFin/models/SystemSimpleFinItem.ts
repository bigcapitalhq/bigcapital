import { BaseModel } from '@/models/Model';
import { Model } from 'objection';

export class SystemSimpleFinItem extends BaseModel {
  tenantId: number;
  simplefinItemId: string;

  /**
   * Table name.
   */
  static get tableName() {
    return 'simplefin_items';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { TenantModel } = require('../../System/models/TenantModel');

    return {
      /**
       * System SimpleFIN item belongs to a tenant.
       */
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: TenantModel,
        join: {
          from: 'simplefin_items.tenantId',
          to: 'tenants.id',
        },
      },
    };
  }
}
