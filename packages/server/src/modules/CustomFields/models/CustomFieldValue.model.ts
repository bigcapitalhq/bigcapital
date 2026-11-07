import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import type { CustomFieldResource } from '../constants';
import type { CustomField } from './CustomField.model';

export class CustomFieldValue extends TenantBaseModel {
  public readonly id: number;
  public customFieldId: number;
  public resourceName: CustomFieldResource;
  public resourceId: number;

  public valueText?: string | null;
  public valueNumber?: number | null;
  public valueBoolean?: boolean | null;
  public valueDate?: string | null;
  public valueJson?: unknown;

  public customField?: CustomField;

  public createdAt?: Date;
  public updatedAt?: Date;

  static get tableName() {
    return 'custom_field_values';
  }

  /**
   * JSON columns.
   */
  static get jsonAttributes() {
    return ['valueJson'];
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      resource(query, resourceName: string, resourceId: number) {
        query
          .where('resource_name', resourceName)
          .where('resource_id', resourceId);
      },
      customField(query, customFieldId: number) {
        query.where('custom_field_id', customFieldId);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { CustomField } = require('./CustomField.model');

    return {
      customField: {
        relation: Model.BelongsToOneRelation,
        modelClass: CustomField,
        join: {
          from: 'custom_field_values.custom_field_id',
          to: 'custom_fields.id',
        },
      },
    };
  }
}
