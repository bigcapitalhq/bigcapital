import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { pick } from 'lodash';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from 'components';
import intl from 'react-intl-universal';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import AccountantForm from './AccountantForm';
import { AccountantSchema } from './Accountant.schema';
import { useAccountantFormContext } from './AccountantFormProvider';
import { transformToOptions } from './utils';
import { compose, transformGeneralSettings } from 'utils';

import 'style/pages/Preferences/Accounting.scss';

// Accountant preferences.
function AccountantFormPage({
  //# withDashboardActions
  changePreferencesPageTitle,

  // #withSettings
  organizationSettings,
  paymentReceiveSettings,
  accountsSettings,
  billPaymentSettings,
}) {
  const { saveSettingMutate } = useAccountantFormContext();

  const accountantSettings = {
    ...billPaymentSettings,
    ...accountsSettings,
    ...pick(organizationSettings, ['accountingBasis']),
    ...pick(paymentReceiveSettings, ['preferredDepositAccount', 'preferredAdvanceDeposit']),
  };

  const initialValues = {
    ...transformGeneralSettings(accountantSettings),
  };

  useEffect(() => {
    changePreferencesPageTitle(intl.get('accountant'));
  }, [changePreferencesPageTitle]);

  const handleFormSubmit = (values, { setSubmitting }) => {
    const options = transformToOptions(values);

    setSubmitting(true);
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('the_accountant_preferences_has_been_saved'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };

    const onError = (errors) => {
      setSubmitting(false);
    };
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AccountantSchema}
      onSubmit={handleFormSubmit}
      component={AccountantForm}
    />
  );
}

export default compose(
  withSettings(
    ({
      organizationSettings,
      paymentReceiveSettings,
      accountsSettings,
      billPaymentSettings,
    }) => ({
      organizationSettings,
      paymentReceiveSettings,
      accountsSettings,
      billPaymentSettings,
    }),
  ),
  withDashboardActions,
)(AccountantFormPage);
