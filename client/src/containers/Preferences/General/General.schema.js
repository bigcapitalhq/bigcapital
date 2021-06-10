import * as Yup from 'yup';
import { get } from 'react-intl-universal';

const Schema = Yup.object().shape({
  name: Yup.string()
    .required()
    .label(get({ id: 'organization_name_' })),
  financial_date_start: Yup.date()
    .required()
    .label(get({ id: 'date_start_' })),
  industry: Yup.string()
    .nullable()
    .label(get({ id: 'organization_industry_' })),
  location: Yup.string()
    .nullable()
    .label(get({ id: 'location' })),
  base_currency: Yup.string()
    .required()
    .label(get({ id: 'base_currency_' })),
  fiscal_year: Yup.string()
    .required()
    .label(get({ id: 'fiscal_year_' })),
  language: Yup.string()
    .required()
    .label(get({ id: 'language' })),
  time_zone: Yup.string()
    .required()
    .label(get({ id: 'time_zone_' })),
  date_format: Yup.string()
    .required()
    .label(get({ id: 'date_format_' })),
});

export const PreferencesGeneralSchema = Schema;
