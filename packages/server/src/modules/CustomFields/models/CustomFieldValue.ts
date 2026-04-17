import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class CustomFieldValue extends TenantBaseModel {
  public customFieldId!: number;
  public resourceType!: string;
  public resourceId!: number;
  public value?: string;

  static get tableName() {
    return 'custom_field_values';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get virtualAttributes() {
    return [];
  }

  static get modifiers() {
    return {
      resource(query, resourceType: string, resourceId: number) {
        query.where('resource_type', resourceType).where('resource_id', resourceId);
      },
      customField(query, customFieldId: number) {
        query.where('custom_field_id', customFieldId);
      },
    };
  }

  static get relationMappings() {
    return {};
  }
}
