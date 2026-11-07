import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField.model';
import { EditCustomFieldDto } from '../dtos/CustomField.dto';
import { GetCustomFieldService } from '../queries/GetCustomField.service';
import { CustomFieldsValidator } from '../CustomFieldsValidator.service';
import { CUSTOM_FIELD_OPTIONS_DATA_TYPES } from '../constants';

@Injectable()
export class EditCustomFieldService {
  constructor(
    private readonly getCustomFieldService: GetCustomFieldService,
    private readonly validator: CustomFieldsValidator,

    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  /**
   * Edits the given custom field definition.
   */
  public async editCustomField(
    customFieldId: number,
    editCustomFieldDTO: EditCustomFieldDto,
  ): Promise<CustomField> {
    const oldCustomField =
      await this.getCustomFieldService.getCustomField(customFieldId);

    const patch: Partial<CustomField> = {};

    if (editCustomFieldDTO.label !== undefined) {
      patch.label = editCustomFieldDTO.label.trim();
    }
    if (editCustomFieldDTO.helpText !== undefined) {
      patch.helpText = editCustomFieldDTO.helpText || null;
    }
    if (editCustomFieldDTO.placeholder !== undefined) {
      patch.placeholder = editCustomFieldDTO.placeholder || null;
    }
    if (editCustomFieldDTO.required !== undefined) {
      patch.required = editCustomFieldDTO.required;
    }
    if (editCustomFieldDTO.unique !== undefined) {
      patch.unique = editCustomFieldDTO.unique;
    }
    if (editCustomFieldDTO.active !== undefined) {
      patch.active = editCustomFieldDTO.active;
    }
    if (editCustomFieldDTO.defaultValue !== undefined) {
      patch.defaultValue = editCustomFieldDTO.defaultValue;
    }
    if (editCustomFieldDTO.options !== undefined) {
      patch.options = CUSTOM_FIELD_OPTIONS_DATA_TYPES.includes(
        oldCustomField.dataType,
      )
        ? editCustomFieldDTO.options.map((option) => String(option).trim())
        : null;
    }
    if (editCustomFieldDTO.inputFormat !== undefined) {
      patch.inputFormat = editCustomFieldDTO.inputFormat || null;
    }
    if (editCustomFieldDTO.minLength !== undefined) {
      patch.minLength = editCustomFieldDTO.minLength ?? null;
    }
    if (editCustomFieldDTO.maxLength !== undefined) {
      patch.maxLength = editCustomFieldDTO.maxLength ?? null;
    }
    if (editCustomFieldDTO.minValue !== undefined) {
      patch.minValue = editCustomFieldDTO.minValue ?? null;
    }
    if (editCustomFieldDTO.maxValue !== undefined) {
      patch.maxValue = editCustomFieldDTO.maxValue ?? null;
    }
    if (editCustomFieldDTO.sortOrder !== undefined) {
      patch.sortOrder = editCustomFieldDTO.sortOrder;
    }
    const mergedDefinition = {
      ...oldCustomField,
      ...patch,
    } as CustomField;

    this.validator.validateDefinition(mergedDefinition);

    return this.customFieldModel()
      .query()
      .patchAndFetchById(customFieldId, {
        ...patch,
        options:
          patch.options === undefined ? oldCustomField.options : patch.options,
      } as any);
  }
}
