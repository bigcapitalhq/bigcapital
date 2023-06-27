// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { omit } from 'lodash';

import '@/style/pages/CashFlow/CashflowTransactionForm.scss';

import { AppToaster } from '@/components';

import MoneyInFormContent from './MoneyInFormContent';
import { CreateMoneyInFormSchema } from './MoneyInForm.schema';

import { useMoneyInDialogContext } from './MoneyInDialogProvider';

import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { compose, transactionNumber } from '@/utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  amount: '',
  transaction_number: '',
  transaction_type: '',
  reference_no: '',
  cashflow_account_id: '',
  credit_account_id: '',
  currency_code: '',
  description: '',
  branch_id: '',
  publish: '',
  exchange_rate: 1,
};

function MoneyInForm({
  // #withDialogActions
  closeDialog,

  // #withCurrentOrganization
  organization: { base_currency },

  // #withSettings
  transactionNextNumber,
  transactionNumberPrefix,
  transactionIncrementMode,
}) {
  const {
    dialogName,
    accountId,
    accountType,
    createCashflowTransactionMutate,
    submitPayload,
  } = useMoneyInDialogContext();

  // transaction number.
  const transactionNo = transactionNumber(
    transactionNumberPrefix,
    transactionNextNumber,
  );

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    currency_code: base_currency,
    transaction_type: accountType,
    ...(transactionIncrementMode && {
      transaction_number: transactionNo,
    }),
    cashflow_account_id: accountId,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...omit(values, ['currency_code']),
      publish: true,
    };
    setSubmitting(true);
    createCashflowTransactionMutate(form)
      .then(() => {
        closeDialog(dialogName);

        AppToaster.show({
          message: intl.get('cash_flow_transaction_success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div>
      <Formik
        validationSchema={CreateMoneyInFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <MoneyInFormContent />
      </Formik>
    </div>
  );
}

export default compose(
  withDialogActions,
  withCurrentOrganization(),
  withSettings(({ cashflowSetting }) => ({
    transactionNextNumber: cashflowSetting?.nextNumber,
    transactionNumberPrefix: cashflowSetting?.numberPrefix,
    transactionIncrementMode: cashflowSetting?.autoIncrement,
  })),
)(MoneyInForm);
