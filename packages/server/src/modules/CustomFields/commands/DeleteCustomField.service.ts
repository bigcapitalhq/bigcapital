import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ServiceError } from '@/modules/Items/ServiceError';
import { CustomField } from '../models/CustomField.model';
import { GetCustomFieldService } from '../queries/GetCustomField.service';
import { CustomFieldValuesService } from '../CustomFieldValues.service';
import { CUSTOM_FIELD_ERRORS } from '../constants';

@Injectable()
export class DeleteCustomFieldService {
  constructor(
    private readonly getCustomFieldService: GetCustomFieldService,
    private readonly customFieldValuesService: CustomFieldValuesService,

    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  /**
   * Deletes the given custom field.
   */
  public async deleteCustomField(
    customFieldId: number,
    options: { force?: boolean } = {},
  ): Promise<CustomField> {
    const customField =
      await this.getCustomFieldService.getCustomField(customFieldId);

    // The field must be inactive before it can be deleted.
    if (customField.active) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_ACTIVE,
        'Deactivate the custom field before deleting it.',
      );
    }
    // Prevent accidental deletion of stored values.
    const valuesCount = await this.customFieldValuesService.countValues(
      customField.id,
    );
    if (valuesCount > 0 && !options.force) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_HAS_VALUES,
        'The custom field has stored values. Use force delete to remove them.',
        { valuesCount },
      );
    }
    await this.customFieldModel().query().findById(customFieldId).delete();

    return customField;
  }
}
