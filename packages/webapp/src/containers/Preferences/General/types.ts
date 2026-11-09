export interface GeneralFormAddress {
  address1?: string;
  address2?: string;
  city?: string;
  postalCode?: string;
  stateProvince?: string;
  phone?: string;
}

/**
 * General preferences form values.
 *
 * Keys are camelCase to match the organization metadata API
 * (`GET/PUT /api/organization`), so values hydrate and persist as-is.
 */
export interface GeneralFormValues {
  name: string;
  industry?: string;
  location?: string;
  baseCurrency: string;
  language: string;
  fiscalYear: string;
  dateFormat: string;
  timezone: string;
  taxNumber?: string;
  address: GeneralFormAddress;
}
