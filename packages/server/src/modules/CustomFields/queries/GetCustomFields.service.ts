import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField.model';
import { CustomFieldResource } from '../constants';

@Injectable()
export class GetCustomFieldsService {
  constructor(
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  /**
   * Retrieves custom field definitions.
   */
  public async getCustomFields(
    resourceName?: CustomFieldResource,
    options: { includeInactive?: boolean } = {},
  ): Promise<CustomField[]> {
    const { includeInactive = false } = options;
    const query = this.customFieldModel()
      .query()
      .select('custom_fields.*')
      .select(
        this.customFieldModel()
          .knex()
          .raw(
            '(SELECT COUNT(*) FROM CUSTOM_FIELD_VALUES CFV WHERE CFV.CUSTOM_FIELD_ID = CUSTOM_FIELDS.ID) as valuesCount',
          ),
      )
      .orderBy('custom_fields.sort_order', 'asc')
      .orderBy('custom_fields.id', 'asc');

    if (resourceName) {
      query.where('custom_fields.resource_name', resourceName);
    }
    if (!includeInactive) {
      query.where('custom_fields.active', true);
    }
    return query;
  }
}
