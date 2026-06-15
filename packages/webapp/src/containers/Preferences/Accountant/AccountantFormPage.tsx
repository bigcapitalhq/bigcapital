import { useEffect } from 'react';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import { Formik, FormikHelpers } from 'formik';
import { Intent } from '@blueprintjs/core';
import { flatten, unflatten } from 'flat';
import { AppToaster } from '@/components';
import {
  withDashboardActions,
  type WithDashboardActionsProps,
} from '@/containers/Dashboard/withDashboardActions';
import {
  withSettings,
  type WithSettingsProps,
} from '@/containers/Settings/withSettings';
import { AccountantForm } from './AccountantForm';
import { AccountantSchema } from './Accountant.schema';
import { useAccountantFormContext } from './AccountantFormProvider';
import { transferObjectOptionsToArray } from './utils';
import { transformToForm, transfromToSnakeCase } from '@/utils';
import { flow } from 'fp-ts/function';

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

interface AccountantFormValues {
  organization: {
    accountingBasis: string;
  };
  accounts: {
    accountCodeRequired: boolean;
    accountCodeUnique: boolean;
  };
  billPayments: {
    withdrawalAccount: string;
  };
  paymentReceives: {
    preferredDepositAccount: string;
    preferredAdvanceDeposit: string;
  };
}

interface AccountantFormPageInnerProps
  extends WithDashboardActionsProps,
    WithSettingsProps {}

function AccountantFormPageInner({
  changePreferencesPageTitle,
  allSettings,
}: AccountantFormPageInnerProps) {
  const { saveSettingMutate } = useAccountantFormContext();

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
    const options = flow(
      transfromToSnakeCase,
      transferObjectOptionsToArray,
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

export const AccountantFormPage = flow(
  withDashboardActions,
  withSettings(({ allSettings }) => ({
    allSettings,
  })),
)(AccountantFormPageInner);
