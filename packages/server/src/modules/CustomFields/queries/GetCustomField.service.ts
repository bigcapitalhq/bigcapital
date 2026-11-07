import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ServiceError } from '@/modules/Items/ServiceError';
import { CustomField } from '../models/CustomField.model';
import { CUSTOM_FIELD_ERRORS } from '../constants';

@Injectable()
export class GetCustomFieldService {
  constructor(
    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  /**
   * Retrieves the given custom field or throws not found.
   */
  public async getCustomField(customFieldId: number): Promise<CustomField> {
    const customField = await this.customFieldModel()
      .query()
      .findById(customFieldId);

    if (!customField) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_NOT_FOUND,
        'Custom field not found.',
      );
    }
    return customField;
  }
}
