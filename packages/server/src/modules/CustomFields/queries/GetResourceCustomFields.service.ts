import { Injectable, Inject } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField';
import { CustomFieldValue } from '../models/CustomFieldValue';

@Injectable()
export class GetResourceCustomFieldsService {
  constructor(
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
    @Inject(CustomFieldValue.name)
    private readonly customFieldValueModel: TenantModelProxy<typeof CustomFieldValue>,
  ) {}

  async getResourceCustomFields(resourceType: string, resourceId: number) {
    const customFields = await this.customFieldModel()
      .query()
      .where('resource_name', resourceType)
      .where('active', true)
      .orderBy('order', 'ASC');

    const values = await this.customFieldValueModel()
      .query()
      .where('resource_type', resourceType)
      .where('resource_id', resourceId);

    const valuesMap = new Map(values.map((v) => [v.customFieldId, v.value]));

    const result: Record<string, any> = {};
    for (const field of customFields) {
      const value = valuesMap.get(field.id);
      result[field.fieldName] = value !== undefined ? value : field.defaultValue;
    }

    return result;
  }

  async getResourceCustomFieldsBulk(resourceType: string, resourceIds: number[]) {
    const customFields = await this.customFieldModel()
      .query()
      .where('resource_name', resourceType)
      .where('active', true)
      .orderBy('order', 'ASC');

    const values = await this.customFieldValueModel()
      .query()
      .where('resource_type', resourceType)
      .whereIn('resource_id', resourceIds);

    const valuesMap = new Map(
      values.map((v) => [`${v.customFieldId}:${v.resourceId}`, v.value]),
    );

    const result: Record<number, Record<string, any>> = {};
    for (const resourceId of resourceIds) {
      const resourceValues: Record<string, any> = {};
      for (const field of customFields) {
        const value = valuesMap.get(`${field.id}:${resourceId}`);
        resourceValues[field.fieldName] = value !== undefined ? value : field.defaultValue;
      }
      result[resourceId] = resourceValues;
    }

    return result;
  }
}
