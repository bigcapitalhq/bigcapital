import React from 'react';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { omit } from 'lodash';
import intl from 'react-intl-universal';

import 'style/pages/CashFlow/CashflowTransactionForm.scss';

import { AppToaster } from 'components';
import { CreateOwnerContributionFormSchema } from './OwnerContributionForm.schema';
import OwnerContributionFormContent from './OwnerContributionFormContent';

import { useMoneyInDailogContext } from '../MoneyInDialogProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

import { compose } from 'utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  amount: '',
  transaction_number: '',
  transaction_type: 'owner_contribution',
  reference_no: '',
  cashflow_account_id: '',
  credit_account_id: '',
  description: '',
  published: '',
};

/**
 * Owner contribution form
 */
function OwnerContributionForm({
  // #withDialogActions
  closeDialog,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const {
    dialogName,
    accountId,
    submitPayload,
    createCashflowTransactionMutate,
  } = useMoneyInDailogContext();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    currency_code: base_currency,
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
    <Formik
      validationSchema={CreateOwnerContributionFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
    >
      <OwnerContributionFormContent />
    </Formik>
  );
}

export default compose(
  withDialogActions,
  withCurrentOrganization(),
)(OwnerContributionForm);
