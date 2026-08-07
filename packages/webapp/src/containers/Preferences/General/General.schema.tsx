import intl from 'react-intl-universal';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  name: Yup.string().required().label(intl.get('organization_name_')),
  taxNumber: Yup.string()
    .nullable()
    .label(intl.get('organization_tax_number_')),
  industry: Yup.string().nullable().label(intl.get('organization_industry_')),
  location: Yup.string().nullable().label(intl.get('location')),
  baseCurrency: Yup.string().required().label(intl.get('base_currency_')),
  fiscalYear: Yup.string().required().label(intl.get('fiscal_year_')),
  language: Yup.string().required().label(intl.get('language')),
  timezone: Yup.string().required().label(intl.get('time_zone_')),
  dateFormat: Yup.string().required().label(intl.get('date_format_')),
});

export const PreferencesGeneralSchema = Schema;
