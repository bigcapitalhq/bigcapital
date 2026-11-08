export const CUSTOM_FIELD_RESOURCES = [
  { value: 'Customer', labelKey: 'custom_fields.resource.customer' },
  { value: 'Vendor', labelKey: 'custom_fields.resource.vendor' },
  { value: 'Item', labelKey: 'custom_fields.resource.item' },
  {
    value: 'SaleInvoice',
    labelKey: 'custom_fields.resource.sale_invoice',
  },
  { value: 'Bill', labelKey: 'custom_fields.resource.bill' },
  { value: 'Expense', labelKey: 'custom_fields.resource.expense' },
] as const;

export const CUSTOM_FIELD_DATA_TYPES = [
  { value: 'text', labelKey: 'custom_fields.type.text' },
  { value: 'textarea', labelKey: 'custom_fields.type.textarea' },
  { value: 'number', labelKey: 'custom_fields.type.number' },
  { value: 'decimal', labelKey: 'custom_fields.type.decimal' },
  { value: 'date', labelKey: 'custom_fields.type.date' },
  { value: 'checkbox', labelKey: 'custom_fields.type.checkbox' },
  { value: 'email', labelKey: 'custom_fields.type.email' },
  { value: 'url', labelKey: 'custom_fields.type.url' },
  { value: 'phone', labelKey: 'custom_fields.type.phone' },
  { value: 'dropdown', labelKey: 'custom_fields.type.dropdown' },
  { value: 'multiselect', labelKey: 'custom_fields.type.multiselect' },
] as const;

export const CUSTOM_FIELD_OPTIONS_DATA_TYPES = ['dropdown', 'multiselect'];

export const CUSTOM_FIELD_TEXT_DATA_TYPES = [
  'text',
  'textarea',
  'email',
  'url',
  'phone',
];

export const CUSTOM_FIELD_NUMERIC_DATA_TYPES = ['number', 'decimal'];

export const getCustomFieldResourceLabel = (
  resource: string,
  intl: { get: (key: string) => string },
) => {
  const item = CUSTOM_FIELD_RESOURCES.find(
    (resourceItem) => resourceItem.value === resource,
  );
  return item ? intl.get(item.labelKey) : resource;
};

export const getCustomFieldDataTypeLabel = (
  dataType: string,
  intl: { get: (key: string) => string },
) => {
  const item = CUSTOM_FIELD_DATA_TYPES.find(
    (dataTypeItem) => dataTypeItem.value === dataType,
  );
  return item ? intl.get(item.labelKey) : dataType;
};
