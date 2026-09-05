import { Intent } from '@blueprintjs/core';
import { flatten, unflatten } from 'flat';
import { Formik, FormikHelpers } from 'formik';
import * as R from 'ramda';
import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { AccountantSchema } from './Accountant.schema';
import { AccountantForm } from './AccountantForm';
import { useAccountantFormContext } from './AccountantFormProvider';
import { transferObjectOptionsToArray } from './utils';
import type { AccountantFormValues } from './types';
import { AppToaster } from '@/components';
import {
  withDashboardActions,
  type WithDashboardActionsProps,
} from '@/containers/Dashboard/withDashboardActions';
import { compose, transformToForm, transfromToSnakeCase } from '@/utils';

import '@/style/pages/Preferences/Accounting.scss';

const defaultFormValues = flatten({
  organization: {
    accountingBasis: 'accrual',
  },
  accounts: {
    accountCodeRequired: false,
    accountCodeUnique: false,
  },
  billPayments: {
    withdrawalAccount: '',
  },
  paymentReceives: {
    preferredDepositAccount: '',
    preferredAdvanceDeposit: '',
  },
}) as AccountantFormValues;

interface AccountantFormPageInnerProps extends WithDashboardActionsProps {}

function AccountantFormPageInner({
  changePreferencesPageTitle,
}: AccountantFormPageInnerProps) {
  const { allSettings, saveSettingMutate } = useAccountantFormContext();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('accountant'));
  }, [changePreferencesPageTitle]);

  const initialValues = unflatten({
    ...defaultFormValues,
    ...transformToForm(flatten(allSettings), defaultFormValues),
  }) as AccountantFormValues;

  const handleFormSubmit = (
    values: AccountantFormValues,
    { setSubmitting }: FormikHelpers<AccountantFormValues>,
  ) => {
    const options = R.compose(
      transferObjectOptionsToArray,
      transfromToSnakeCase,
    )(values);
    setSubmitting(true);

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('the_accountant_preferences_has_been_saved'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };
    const onError = () => {
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

export const AccountantFormPage = compose(withDashboardActions)(
  AccountantFormPageInner,
);
