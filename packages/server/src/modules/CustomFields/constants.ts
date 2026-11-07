export const CUSTOM_FIELD_RESOURCES = [
  'Customer',
  'Vendor',
  'Item',
  'SaleInvoice',
  'Bill',
  'Expense',
] as const;

export type CustomFieldResource = (typeof CUSTOM_FIELD_RESOURCES)[number];

export enum CustomFieldDataType {
  Text = 'text',
  Textarea = 'textarea',
  Number = 'number',
  Decimal = 'decimal',
  Date = 'date',
  Checkbox = 'checkbox',
  Email = 'email',
  Url = 'url',
  Phone = 'phone',
  Dropdown = 'dropdown',
  Multiselect = 'multiselect',
}

export const CUSTOM_FIELD_DATA_TYPES = Object.values(CustomFieldDataType);

export const CUSTOM_FIELD_ERRORS = {
  CUSTOM_FIELD_NOT_FOUND: 'CUSTOM_FIELD_NOT_FOUND',
  CUSTOM_FIELD_NAME_EXISTS: 'CUSTOM_FIELD_NAME_EXISTS',
  CUSTOM_FIELD_ACTIVE: 'CUSTOM_FIELD_ACTIVE',
  CUSTOM_FIELD_HAS_VALUES: 'CUSTOM_FIELD_HAS_VALUES',
  CUSTOM_FIELD_REQUIRED: 'CUSTOM_FIELD_REQUIRED',
  CUSTOM_FIELD_INVALID_VALUE: 'CUSTOM_FIELD_INVALID_VALUE',
  CUSTOM_FIELD_UNIQUE_VALUE: 'CUSTOM_FIELD_UNIQUE_VALUE',
  CUSTOM_FIELD_INVALID_OPTIONS: 'CUSTOM_FIELD_INVALID_OPTIONS',
  CUSTOM_FIELD_INVALID_DEFAULT_VALUE: 'CUSTOM_FIELD_INVALID_DEFAULT_VALUE',
  CUSTOM_FIELD_INVALID_FORMAT: 'CUSTOM_FIELD_INVALID_FORMAT',
};

/**
 * Maps the custom field data type to the dynamic listing field type.
 */
export const CUSTOM_FIELD_DATA_TYPE_TO_FILTER_TYPE: Record<
  CustomFieldDataType,
  string
> = {
  [CustomFieldDataType.Text]: 'text',
  [CustomFieldDataType.Textarea]: 'text',
  [CustomFieldDataType.Number]: 'number',
  [CustomFieldDataType.Decimal]: 'number',
  [CustomFieldDataType.Date]: 'date',
  [CustomFieldDataType.Checkbox]: 'boolean',
  [CustomFieldDataType.Email]: 'text',
  [CustomFieldDataType.Url]: 'text',
  [CustomFieldDataType.Phone]: 'text',
  [CustomFieldDataType.Dropdown]: 'enumeration',
  [CustomFieldDataType.Multiselect]: 'text',
};

/**
 * Data types that participate in the keyword search.
 */
export const CUSTOM_FIELD_SEARCHABLE_DATA_TYPES: CustomFieldDataType[] = [
  CustomFieldDataType.Text,
  CustomFieldDataType.Textarea,
  CustomFieldDataType.Email,
  CustomFieldDataType.Url,
  CustomFieldDataType.Phone,
  CustomFieldDataType.Dropdown,
];

/**
 * Data types that support a configurable input format.
 */
export const CUSTOM_FIELD_FORMATABLE_DATA_TYPES: CustomFieldDataType[] = [
  CustomFieldDataType.Text,
  CustomFieldDataType.Textarea,
];

/**
 * Data types that support min/max length.
 */
export const CUSTOM_FIELD_LENGTH_DATA_TYPES: CustomFieldDataType[] = [
  CustomFieldDataType.Text,
  CustomFieldDataType.Textarea,
  CustomFieldDataType.Email,
  CustomFieldDataType.Url,
  CustomFieldDataType.Phone,
];

/**
 * Data types that support min/max numeric values.
 */
export const CUSTOM_FIELD_NUMERIC_DATA_TYPES: CustomFieldDataType[] = [
  CustomFieldDataType.Number,
  CustomFieldDataType.Decimal,
];

/**
 * Data types that use the `options` configuration.
 */
export const CUSTOM_FIELD_OPTIONS_DATA_TYPES: CustomFieldDataType[] = [
  CustomFieldDataType.Dropdown,
  CustomFieldDataType.Multiselect,
];
