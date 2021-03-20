import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import moment from 'moment';
import { FormattedMessage as T, useIntl } from 'react-intl';

import 'style/pages/Setup/Organization.scss';

import SetupOrganizationForm from './SetupOrganizationForm';

import { useOrganizationSetup } from 'hooks/query';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withOrganizationActions from 'containers/Organization/withOrganizationActions';

import {
  compose,
  transfromToSnakeCase,
} from 'utils';

/**
 * Setup organization form.
 */
function SetupOrganizationPage({
  wizard,
  setOrganizationSetupCompleted,
}) {
  const { formatMessage } = useIntl();
  const { mutateAsync: organizationSetupMutate } = useOrganizationSetup();

  // Validation schema.
  const validationSchema = Yup.object().shape({
    organization_name: Yup.string()
      .required()
      .label(formatMessage({ id: 'organization_name_' })),
    financialDateStart: Yup.date()
      .required()
      .label(formatMessage({ id: 'date_start_' })),
    baseCurrency: Yup.string()
      .required()
      .label(formatMessage({ id: 'base_currency_' })),
    language: Yup.string()
      .required()
      .label(formatMessage({ id: 'language' })),
    fiscalYear: Yup.string()
      .required()
      .label(formatMessage({ id: 'fiscal_year_' })),
    timeZone: Yup.string()
      .required()
      .label(formatMessage({ id: 'time_zone_' })),
  });

  // Initial values.
  const defaultValues = {
    organization_name: '',
    financialDateStart: moment(new Date()).format('YYYY-MM-DD'),
    baseCurrency: '',
    language: 'en',
    fiscalYear: '',
    timeZone: '',
  };

  const initialValues = {
    ...defaultValues,
  };

  // Handle the form submit.
  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    organizationSetupMutate({ ...transfromToSnakeCase(values) })
      .then(() => {
        return setOrganizationSetupCompleted(true);
      })
      .then((response) => {
        setSubmitting(false);
        wizard.next();
      })
      .catch((erros) => {
        setSubmitting(false);
      });
  };

  return (
    <div className={'setup-organization'}>
      <div className={'setup-organization__title-wrap'}>
        <h1>
          <T id={'let_s_get_started'} />
        </h1>
        <p class="paragraph">
          <T id={'tell_the_system_a_little_bit_about_your_organization'} />
        </p>
      </div>

      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        component={SetupOrganizationForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default compose(
  withSettingsActions,
  withOrganizationActions,
)(SetupOrganizationPage);
