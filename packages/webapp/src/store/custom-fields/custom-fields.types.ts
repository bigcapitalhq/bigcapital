export interface CustomFieldsState {
  custom_fields: Record<string, unknown>;
}

export type CustomFieldsAction = {
  type: string;
  resource_slug?: string;
  custom_field?: unknown;
  resourceSlug?: string;
  fields?: Array<unknown>;
};

export const CUSTOM_FIELDS_RESOURCE_SET = 'CUSTOM_FIELDS_RESOURCE_SET' as const;
