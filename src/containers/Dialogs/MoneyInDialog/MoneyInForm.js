import React from 'react';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { omit } from 'lodash';
import intl from 'react-intl-universal';

import 'style/pages/CashFlow/CashflowTransactionForm.scss';

import { AppToaster } from 'components';

import MoneyInFormContent from './MoneyInFormContent';
import { CreateMoneyInFormSchema } from './MoneyInForm.schema';

import { useMoneyInDailogContext } from './MoneyInDialogProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { compose } from 'utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  amount: '',
  transaction_number: '',
  transaction_type: '',
  reference_no: '',
  cashflow_account_id: '',
  credit_account_id: '',
  description: '',
  published: '',
};

function MoneyInForm({
  // #withDialogActions
  closeDialog,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const {
    dialogName,
    accountId,
    accountType,
    createCashflowTransactionMutate,
    submitPayload,
  } = useMoneyInDailogContext();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    currency_code: base_currency,
    transaction_type: accountType,
    cashflow_account_id: accountId,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...omit(values, ['currency_code']),
      published: submitPayload.publish,
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
        setSubmitting(true);
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
)(MoneyInForm);
