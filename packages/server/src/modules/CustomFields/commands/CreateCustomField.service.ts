import { Inject, Injectable } from '@nestjs/common';
import { snakeCase } from 'lodash';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CustomField } from '../models/CustomField.model';
import { CreateCustomFieldDto } from '../dtos/CustomField.dto';
import { CustomFieldsValidator } from '../CustomFieldsValidator.service';
import {
  CUSTOM_FIELD_OPTIONS_DATA_TYPES,
  CustomFieldResource,
} from '../constants';

@Injectable()
export class CreateCustomFieldService {
  constructor(
    private readonly validator: CustomFieldsValidator,

    @Inject(CustomField.name)
    private readonly customFieldModel: TenantModelProxy<typeof CustomField>,
  ) {}

  /**
   * Generates a unique API field name for the given label/resource.
   */
  private async generateFieldName(
    resourceName: CustomFieldResource,
    label: string,
  ): Promise<string> {
    const base = `cf_${snakeCase(label).slice(0, 58)}`.replace(/_+$/, '');
    const normalizedBase = base === 'cf' ? 'cf_field' : base;
    let fieldName = normalizedBase;
    let counter = 2;

    while (true) {
      const exists = await this.customFieldModel()
        .query()
        .where('resource_name', resourceName)
        .where('field_name', fieldName)
        .first();

      if (!exists) {
        return fieldName;
      }
      fieldName = `${normalizedBase}_${counter}`;
      counter++;
    }
  }

  /**
   * Retrieves the next display order for the resource.
   */
  private async getNextSortOrder(
    resourceName: CustomFieldResource,
  ): Promise<number> {
    const result = await this.customFieldModel()
      .query()
      .where('resource_name', resourceName)
      .max('sort_order as maxOrder')
      .first();

    return Number((result as any)?.maxOrder ?? -1) + 1;
  }

  /**
   * Creates a new custom field definition.
   */
  public async createCustomField(
    createCustomFieldDTO: CreateCustomFieldDto,
  ): Promise<CustomField> {
    const fieldName = await this.generateFieldName(
      createCustomFieldDTO.resourceName,
      createCustomFieldDTO.label,
    );
    const dataType = createCustomFieldDTO.dataType;
    const options = CUSTOM_FIELD_OPTIONS_DATA_TYPES.includes(dataType)
      ? (createCustomFieldDTO.options ?? []).map((option) =>
          String(option).trim(),
        )
      : null;
    const sortOrder =
      createCustomFieldDTO.sortOrder ??
      (await this.getNextSortOrder(createCustomFieldDTO.resourceName));

    const fieldDefinition = {
      resourceName: createCustomFieldDTO.resourceName,
      fieldName,
      label: createCustomFieldDTO.label.trim(),
      dataType,
      helpText: createCustomFieldDTO.helpText ?? null,
      placeholder: createCustomFieldDTO.placeholder ?? null,
      required: createCustomFieldDTO.required ?? false,
      unique: createCustomFieldDTO.unique ?? false,
      active: createCustomFieldDTO.active ?? true,
      defaultValue: createCustomFieldDTO.defaultValue ?? null,
      options,
      inputFormat: createCustomFieldDTO.inputFormat ?? null,
      minLength: createCustomFieldDTO.minLength ?? null,
      maxLength: createCustomFieldDTO.maxLength ?? null,
      minValue: createCustomFieldDTO.minValue ?? null,
      maxValue: createCustomFieldDTO.maxValue ?? null,
      sortOrder,
    } as Partial<CustomField>;

    this.validator.validateDefinition(fieldDefinition);

    return this.customFieldModel()
      .query()
      .insertAndFetch(fieldDefinition as any);
  }
}
