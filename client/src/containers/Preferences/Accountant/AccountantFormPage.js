import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Formik } from 'formik';
import { pick } from 'lodash';
import { Intent } from '@blueprintjs/core';
import { CLASSES } from 'common/classes';
import { AppToaster } from 'components';
import { useIntl } from 'react-intl';

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
  const { formatMessage } = useIntl();

  const { saveSettingMutate } = useAccountantFormContext();

  const accountantSettings = {
    ...billPaymentSettings,
    ...accountsSettings,
    ...pick(organizationSettings, ['accountingBasis']),
    ...pick(paymentReceiveSettings, ['depositAccount', 'advanceDeposit']),
  };

  const initialValues = {
    ...transformGeneralSettings(accountantSettings),
  };

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'accountant' }));
  }, [changePreferencesPageTitle]);

  const handleFormSubmit = (values, { setSubmitting }) => {
    const options = transformToOptions(values);
    setSubmitting(true);
    const onSuccess = () => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_accountant_preferences_has_been_saved',
        }),
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
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <div className={classNames(CLASSES.CARD)}>
        <Formik
          initialValues={initialValues}
          validationSchema={AccountantSchema}
          onSubmit={handleFormSubmit}
          component={AccountantForm}
        />
      </div>
    </div>
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
