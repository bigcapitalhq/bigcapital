import { isEmail, isURL } from 'class-validator';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { CustomField } from './models/CustomField.model';
import {
  CUSTOM_FIELD_DATA_TYPE_TO_FILTER_TYPE,
  CUSTOM_FIELD_ERRORS,
  CUSTOM_FIELD_FORMATABLE_DATA_TYPES,
  CUSTOM_FIELD_LENGTH_DATA_TYPES,
  CUSTOM_FIELD_NUMERIC_DATA_TYPES,
  CUSTOM_FIELD_OPTIONS_DATA_TYPES,
  CustomFieldDataType,
} from './constants';

export interface IValueStorageColumns {
  valueText?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
  valueDate?: string | null;
  valueJson?: unknown;
}

@Injectable()
export class CustomFieldsValidator {
  /**
   * Validates the custom field definition config.
   * @param {Partial<CustomField>} field
   */
  public validateDefinition(field: Partial<CustomField>): void {
    const dataType = field.dataType;

    if (!dataType) {
      return;
    }
    // Options validation.
    if (CUSTOM_FIELD_OPTIONS_DATA_TYPES.includes(dataType)) {
      this.validateOptions(field.options);
    }
    // Input format validation.
    if (field.inputFormat) {
      try {
        new RegExp(field.inputFormat);
      } catch {
        throw new ServiceError(
          CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_FORMAT,
          'The input format is not a valid regular expression.',
        );
      }
    }
    // Length validation.
    if (
      CUSTOM_FIELD_LENGTH_DATA_TYPES.includes(dataType) &&
      field.minLength != null &&
      field.maxLength != null
    ) {
      if (Number(field.minLength) > Number(field.maxLength)) {
        throw new ServiceError(
          CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
          'The minimum length cannot be greater than the maximum length.',
        );
      }
    }
    // Numeric range validation.
    if (
      CUSTOM_FIELD_NUMERIC_DATA_TYPES.includes(dataType) &&
      field.minValue != null &&
      field.maxValue != null
    ) {
      if (Number(field.minValue) > Number(field.maxValue)) {
        throw new ServiceError(
          CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
          'The minimum value cannot be greater than the maximum value.',
        );
      }
    }
    // Default value validation.
    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      this.normalizeValue(field as CustomField, field.defaultValue);
    }
  }

  /**
   * Validates dropdown/multiselect options.
   * @param {unknown} options
   */
  public validateOptions(options: unknown): void {
    if (!Array.isArray(options) || options.length === 0) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_OPTIONS,
        'At least one option is required for dropdown and multi-select fields.',
      );
    }
    const normalized = options.map((option) => String(option).trim());

    if (normalized.some((option) => option.length === 0)) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_OPTIONS,
        'Options cannot be empty.',
      );
    }
    if (new Set(normalized).size !== normalized.length) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_OPTIONS,
        'Options must be unique.',
      );
    }
  }

  /**
   * Normalizes and validates a value against the given field definition.
   * @param {CustomField} field
   * @param {unknown} rawValue
   * @returns {unknown}
   */
  public normalizeValue(field: CustomField, rawValue: unknown): unknown {
    const dataType = field.dataType;

    switch (dataType) {
      case CustomFieldDataType.Number:
      case CustomFieldDataType.Decimal:
        return this.normalizeNumber(field, rawValue);

      case CustomFieldDataType.Date:
        return this.normalizeDate(field, rawValue);

      case CustomFieldDataType.Checkbox:
        return this.normalizeBoolean(field, rawValue);

      case CustomFieldDataType.Email:
        return this.normalizeEmail(field, rawValue);

      case CustomFieldDataType.Url:
        return this.normalizeUrl(field, rawValue);

      case CustomFieldDataType.Phone:
        return this.normalizePhone(field, rawValue);

      case CustomFieldDataType.Dropdown:
        return this.normalizeDropdown(field, rawValue);

      case CustomFieldDataType.Multiselect:
        return this.normalizeMultiselect(field, rawValue);

      case CustomFieldDataType.Textarea:
        return this.normalizeText(field, rawValue, 36000);

      case CustomFieldDataType.Text:
      default:
        return this.normalizeText(field, rawValue, 255);
    }
  }

  /**
   * Normalizes text-like values.
   */
  private normalizeText(
    field: CustomField,
    rawValue: unknown,
    defaultMaxLength: number,
  ): string {
    const value = String(rawValue ?? '').trim();
    const maxLength = field.maxLength ?? defaultMaxLength;

    if (field.minLength != null && value.length < field.minLength) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        `The value must be at least ${field.minLength} characters.`,
        { fieldKey: field.fieldName },
      );
    }
    if (value.length > maxLength) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        `The value must be at most ${maxLength} characters.`,
        { fieldKey: field.fieldName },
      );
    }
    if (
      field.inputFormat &&
      CUSTOM_FIELD_FORMATABLE_DATA_TYPES.includes(field.dataType) &&
      !new RegExp(field.inputFormat).test(value)
    ) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_FORMAT,
        'The value does not match the configured input format.',
        { fieldKey: field.fieldName },
      );
    }
    return value;
  }

  /**
   * Normalizes numeric values.
   */
  private normalizeNumber(field: CustomField, rawValue: unknown): number {
    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'The value must be a valid number.',
        { fieldKey: field.fieldName },
      );
    }
    if (
      field.dataType === CustomFieldDataType.Number &&
      !Number.isInteger(value)
    ) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'The value must be a whole number.',
        { fieldKey: field.fieldName },
      );
    }
    if (field.minValue != null && value < Number(field.minValue)) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        `The value must be greater than or equal to ${field.minValue}.`,
        { fieldKey: field.fieldName },
      );
    }
    if (field.maxValue != null && value > Number(field.maxValue)) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        `The value must be less than or equal to ${field.maxValue}.`,
        { fieldKey: field.fieldName },
      );
    }
    return value;
  }

  /**
   * Normalizes date values to `YYYY-MM-DD`.
   */
  private normalizeDate(field: CustomField, rawValue: unknown): string {
    const value = moment(rawValue as moment.MomentInput, true);

    if (!value.isValid()) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'The value must be a valid date.',
        { fieldKey: field.fieldName },
      );
    }
    return value.format('YYYY-MM-DD');
  }

  /**
   * Normalizes checkbox values.
   */
  private normalizeBoolean(field: CustomField, rawValue: unknown): boolean {
    if (typeof rawValue === 'boolean') {
      return rawValue;
    }
    const normalized = String(rawValue).trim().toLowerCase();

    if (['true', '1'].includes(normalized)) {
      return true;
    }
    if (['false', '0'].includes(normalized)) {
      return false;
    }
    throw new ServiceError(
      CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
      'The value must be a boolean.',
      { fieldKey: field.fieldName },
    );
  }

  /**
   * Normalizes email values.
   */
  private normalizeEmail(field: CustomField, rawValue: unknown): string {
    const value = this.normalizeText(field, rawValue, 255);

    if (!isEmail(value)) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'The value must be a valid email address.',
        { fieldKey: field.fieldName },
      );
    }
    return value;
  }

  /**
   * Normalizes URL values.
   */
  private normalizeUrl(field: CustomField, rawValue: unknown): string {
    const value = this.normalizeText(field, rawValue, 2048);

    if (!isURL(value)) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'The value must be a valid URL.',
        { fieldKey: field.fieldName },
      );
    }
    return value;
  }

  /**
   * Normalizes phone values.
   */
  private normalizePhone(field: CustomField, rawValue: unknown): string {
    const value = this.normalizeText(field, rawValue, 50);

    if (!/^[+()\d\s.\-]{3,50}$/.test(value)) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'The value must be a valid phone number.',
        { fieldKey: field.fieldName },
      );
    }
    return value;
  }

  /**
   * Normalizes dropdown values.
   */
  private normalizeDropdown(field: CustomField, rawValue: unknown): string {
    const value = String(rawValue ?? '').trim();
    const options = (field.options ?? []).map((option) => String(option));

    if (!options.includes(value)) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'The value must be one of the configured options.',
        { fieldKey: field.fieldName },
      );
    }
    return value;
  }

  /**
   * Normalizes multi-select values.
   */
  private normalizeMultiselect(
    field: CustomField,
    rawValue: unknown,
  ): string[] {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    const options = (field.options ?? []).map((option) => String(option));
    const normalized = values.map((value) => String(value ?? '').trim());

    if (normalized.length > 30) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'A multi-select field accepts at most 30 options.',
        { fieldKey: field.fieldName },
      );
    }
    if (normalized.some((value) => !options.includes(value))) {
      throw new ServiceError(
        CUSTOM_FIELD_ERRORS.CUSTOM_FIELD_INVALID_VALUE,
        'All values must be one of the configured options.',
        { fieldKey: field.fieldName },
      );
    }
    return [...new Set(normalized)];
  }

  /**
   * Converts a normalized value to database storage columns.
   */
  public toStorageColumns(
    field: CustomField,
    value: unknown,
  ): IValueStorageColumns | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    switch (field.dataType) {
      case CustomFieldDataType.Number:
      case CustomFieldDataType.Decimal:
        return { valueNumber: Number(value) };

      case CustomFieldDataType.Date:
        return { valueDate: String(value) };

      case CustomFieldDataType.Checkbox:
        return { valueBoolean: Boolean(value) };

      case CustomFieldDataType.Multiselect:
        return { valueJson: value };

      case CustomFieldDataType.Text:
      case CustomFieldDataType.Textarea:
      case CustomFieldDataType.Email:
      case CustomFieldDataType.Url:
      case CustomFieldDataType.Phone:
      case CustomFieldDataType.Dropdown:
      default:
        return { valueText: String(value) };
    }
  }

  /**
   * Converts a storage row back to a typed value.
   */
  public fromStorageRow(row): unknown {
    const dataType = row.customField?.dataType;

    switch (dataType) {
      case CustomFieldDataType.Number:
      case CustomFieldDataType.Decimal:
        return row.valueNumber != null ? Number(row.valueNumber) : null;

      case CustomFieldDataType.Date:
        return row.valueDate
          ? moment(row.valueDate).format('YYYY-MM-DD')
          : null;

      case CustomFieldDataType.Checkbox:
        return row.valueBoolean != null ? Boolean(row.valueBoolean) : null;

      case CustomFieldDataType.Multiselect:
        return row.valueJson ?? null;

      case CustomFieldDataType.Text:
      case CustomFieldDataType.Textarea:
      case CustomFieldDataType.Email:
      case CustomFieldDataType.Url:
      case CustomFieldDataType.Phone:
      case CustomFieldDataType.Dropdown:
      default:
        return row.valueText ?? null;
    }
  }

  /**
   * Maps the data type to the dynamic listing field type.
   */
  public getFilterFieldType(dataType: CustomFieldDataType): string {
    return CUSTOM_FIELD_DATA_TYPE_TO_FILTER_TYPE[dataType] ?? 'text';
  }

  /**
   * Returns the storage column used for a field.
   */
  public getStorageColumn(dataType: CustomFieldDataType): string {
    switch (dataType) {
      case CustomFieldDataType.Number:
      case CustomFieldDataType.Decimal:
        return 'value_number';

      case CustomFieldDataType.Date:
        return 'value_date';

      case CustomFieldDataType.Checkbox:
        return 'value_boolean';

      case CustomFieldDataType.Multiselect:
        return 'value_json';

      default:
        return 'value_text';
    }
  }
}
