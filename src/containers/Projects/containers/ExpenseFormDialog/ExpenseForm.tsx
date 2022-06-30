import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { AppToaster } from 'components';
import { CreateExpenseFormSchema } from './ExpenseForm.schema';
import ExpenseFormContent from './ExpenseFormContent';
import { useExpenseFormContext } from './ExpenseFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const defaultInitialValues = {
  expenseName: '',
  estimatedExpense: '',
  expemseDate: moment(new Date()).format('YYYY-MM-DD'),
  expenseUnitPrice: '',
  expenseQuantity: 1,
  expenseCharge: '% markup',
  percentage: '',
  expenseTotal: '',
};

/**
 * Expense form.
 * @returns
 */
function ExpenseForm({
  //#withDialogActions
  closeDialog,
}) {
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {};

    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({});
    };

    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      setSubmitting(false);
    };
  };
  return (
    <Formik
      validationSchema={CreateExpenseFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ExpenseFormContent}
    />
  );
}

export default compose(withDialogActions)(ExpenseForm);
