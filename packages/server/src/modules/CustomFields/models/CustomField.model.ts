import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import type { CustomFieldDataType, CustomFieldResource } from '../constants';

export class CustomField extends TenantBaseModel {
  public readonly id: number;
  public resourceName: CustomFieldResource;
  public fieldName: string;
  public label: string;
  public dataType: CustomFieldDataType;
  public helpText?: string | null;
  public placeholder?: string | null;
  public required: boolean;
  public unique: boolean;
  public active: boolean;
  public defaultValue?: unknown;
  public options?: string[] | null;
  public inputFormat?: string | null;
  public minLength?: number | null;
  public maxLength?: number | null;
  public minValue?: number | null;
  public maxValue?: number | null;
  public sortOrder: number;
  public valuesCount?: number;

  public createdAt?: Date;
  public updatedAt?: Date;

  static get tableName() {
    return 'custom_fields';
  }

  /**
   * JSON columns.
   */
  static get jsonAttributes() {
    return ['options', 'defaultValue'];
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
      active(query) {
        query.where('active', true);
      },
      resource(query, resourceName: string) {
        query.where('resource_name', resourceName);
      },
      ordered(query) {
        query.orderBy('sort_order', 'asc').orderBy('id', 'asc');
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { CustomFieldValue } = require('./CustomFieldValue.model');

    return {
      values: {
        relation: Model.HasManyRelation,
        modelClass: CustomFieldValue,
        join: {
          from: 'custom_fields.id',
          to: 'custom_field_values.custom_field_id',
        },
      },
    };
  }
}
