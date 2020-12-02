import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

const Schema = Yup.object().shape({
  name: Yup.string()
    .required()
    .label(formatMessage({ id: 'organization_name_' })),
  financial_date_start: Yup.date()
    .required()
    .label(formatMessage({ id: 'date_start_' })),
  industry: Yup.string()
    .nullable()
    .label(formatMessage({ id: 'organization_industry_' })),
  location: Yup.string()
    .nullable()
    .label(formatMessage({ id: 'location' })),
  base_currency: Yup.string()
    .required()
    .label(formatMessage({ id: 'base_currency_' })),
  fiscal_year: Yup.string()
    .required()
    .label(formatMessage({ id: 'fiscal_year_' })),
  language: Yup.string()
    .required()
    .label(formatMessage({ id: 'language' })),
  time_zone: Yup.string()
    .required()
    .label(formatMessage({ id: 'time_zone_' })),
  date_format: Yup.string()
    .required()
    .label(formatMessage({ id: 'date_format_' })),
});

export const PreferencesGeneralSchema = Schema;
