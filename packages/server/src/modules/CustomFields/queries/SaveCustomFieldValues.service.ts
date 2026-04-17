import { Injectable, Inject } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField';
import { CustomFieldValue } from '../models/CustomFieldValue';

@Injectable()
export class SaveCustomFieldValuesService {
  constructor(
    private readonly uow: UnitOfWork,
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
    @Inject(CustomFieldValue.name)
    private readonly customFieldValueModel: TenantModelProxy<typeof CustomFieldValue>,
  ) {}

  async saveValues(
    resourceType: string,
    resourceId: number,
    customFields: Record<string, any>,
    trx?: any,
  ) {
    const execute = async (transaction) => {
      const fieldDefinitions = await this.customFieldModel()
        .query(transaction)
        .where('resource_name', resourceType)
        .where('active', true);

      const fieldMap = new Map(fieldDefinitions.map((f) => [f.fieldName, f]));

      for (const [fieldName, value] of Object.entries(customFields)) {
        const fieldDef = fieldMap.get(fieldName);
        if (!fieldDef) continue;

        const existing = await this.customFieldValueModel()
          .query(transaction)
          .where('custom_field_id', fieldDef.id)
          .where('resource_type', resourceType)
          .where('resource_id', resourceId)
          .first();

        if (existing) {
          await this.customFieldValueModel()
            .query(transaction)
            .findById(existing.id)
            .patch({ value: value != null ? String(value) : null });
        } else {
          await this.customFieldValueModel()
            .query(transaction)
            .insert({
              customFieldId: fieldDef.id,
              resourceType,
              resourceId,
              value: value != null ? String(value) : null,
            });
        }
      }
    };

    if (trx) {
      return execute(trx);
    }
    return this.uow.withTransaction(execute);
  }

  async deleteValues(resourceType: string, resourceId: number, trx?: any) {
    const execute = async (transaction) => {
      await this.customFieldValueModel()
        .query(transaction)
        .where('resource_type', resourceType)
        .where('resource_id', resourceId)
        .delete();
    };

    if (trx) {
      return execute(trx);
    }
    return this.uow.withTransaction(execute);
  }
}
