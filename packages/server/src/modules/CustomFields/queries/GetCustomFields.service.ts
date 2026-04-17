import { Injectable, Inject } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField';

@Injectable()
export class GetCustomFieldsService {
  constructor(
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  async getCustomFields(resourceName?: string) {
    let query = this.customFieldModel()
      .query()
      .orderBy('order', 'ASC');

    if (resourceName) {
      query = query.where('resource_name', resourceName);
    }

    return query;
  }
}
