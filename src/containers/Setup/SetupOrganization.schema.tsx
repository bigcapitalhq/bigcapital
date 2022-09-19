// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

// Retrieve the setup organization form validation.
export const getSetupOrganizationValidation = () =>
  Yup.object().shape({
    name: Yup.string()
      .required()
      .label(intl.get('organization_name_')),
    location: Yup.string()
      .required()
      .label(intl.get('setup.organization.location')),
    baseCurrency: Yup.string().required().label(intl.get('base_currency_')),
    language: Yup.string().required().label(intl.get('language')),
    fiscalYear: Yup.string().required().label(intl.get('fiscal_year_')),
    timezone: Yup.string().required().label(intl.get('time_zone_')),
  });
