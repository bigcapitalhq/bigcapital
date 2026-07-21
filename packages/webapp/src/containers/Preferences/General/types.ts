export interface GeneralFormAddress {
  address1?: string;
  address2?: string;
  city?: string;
  postal_code?: string;
  state_province?: string;
  phone?: string;
}

/**
 * General preferences form values.
 *
 * NOTE: snake_case keys are preserved for `tax_number`, `base_currency`,
 * `fiscal_year`, `date_format`, and the nested `address` object because they
 * are read from / written to `organization.metadata`, which is a free-form
 * JSON blob stored as-is by the server. Renaming would silently break the
 * round-trip without a migration. The Address sub-interface mirrors the same
 * constraint.
 */
export interface GeneralFormValues {
  name: string;
  industry?: string;
  location?: string;
  base_currency: string;
  language: string;
  fiscal_year: string;
  date_format: string;
  timezone: string;
  tax_number?: string;
  address: GeneralFormAddress;
}
