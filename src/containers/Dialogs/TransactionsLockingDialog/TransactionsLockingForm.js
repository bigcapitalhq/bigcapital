import React from 'react';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import intl from 'react-intl-universal';

import '../../../style/pages/TransactionsLocking/TransactionsLockingDialog.scss'

import { AppToaster } from 'components';
import { CreateTransactionsLockingFormSchema } from './TransactionsLockingForm.schema';

import { useTransactionLockingContext } from './TransactionsLockingFormProvider';
import TransactionsLockingFormContent from './TransactionsLockingFormContent';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  reason: '',
};

/**
 * Transactions Locking From.
 */
function TransactionsLockingForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName } = useTransactionLockingContext();
  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {};

  return (
    <Formik
      validationSchema={CreateTransactionsLockingFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={TransactionsLockingFormContent}
    />
  );
}
export default compose(withDialogActions)(TransactionsLockingForm);
