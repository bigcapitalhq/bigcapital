// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  name: Yup.string()
    .required()
    .label(intl.get('organization_name_')),
  tax_number: Yup.string()
    .nullable()
    .label(intl.get('organization_tax_number_')),
  industry: Yup.string()
    .nullable()
    .label(intl.get('organization_industry_')),
  location: Yup.string()
    .nullable()
    .label(intl.get('location')),
  base_currency: Yup.string()
    .required()
    .label(intl.get('base_currency_')),
  fiscal_year: Yup.string()
    .required()
    .label(intl.get('fiscal_year_')),
  language: Yup.string()
    .required()
    .label(intl.get('language')),
  timezone: Yup.string()
    .required()
    .label(intl.get('time_zone_')),
  date_format: Yup.string()
    .required()
    .label(intl.get('date_format_')),
});

export const PreferencesGeneralSchema = Schema;
