import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class CustomField extends TenantBaseModel {
  public resourceName!: string;
  public fieldName!: string;
  public label!: string;
  public fieldType!: string;
  public options?: Record<string, any>;
  public required!: boolean;
  public order!: number;
  public active!: boolean;
  public defaultValue?: string;

  static get tableName() {
    return 'custom_fields';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get virtualAttributes() {
    return [];
  }

  static get modifiers() {
    return {
      active(query) {
        query.where('active', true);
      },
      resource(query, resourceName: string) {
        query.where('resource_name', resourceName);
      },
    };
  }

  static get relationMappings() {
    return {};
  }
}
