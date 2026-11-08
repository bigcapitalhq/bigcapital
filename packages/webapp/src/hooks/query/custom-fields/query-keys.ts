export const CUSTOM_FIELDS = 'CUSTOM_FIELDS';
export const CUSTOM_FIELD = 'CUSTOM_FIELD';

export const customFieldsKeys = {
  all: () => [CUSTOM_FIELDS] as const,
  list: (query?: Record<string, unknown>) => [CUSTOM_FIELDS, query] as const,
  detail: (id: number | null | undefined) => [CUSTOM_FIELD, id] as const,
};

export const CustomFieldsQueryKeys = {
  CUSTOM_FIELDS,
  CUSTOM_FIELD,
} as const;
