import React from 'react';
import { Formik } from 'formik';
import { AppToaster } from '@/components';
import { CreateEstimatedExpenseFormSchema } from './EstimatedExpense.schema';
import EstimatedExpenseFormConent from './EstimatedExpenseFormConent';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues = {
  estimatedExpense: '',
  unitPrice: '',
  quantity: 1,
  charge: '% markup',
  percentage: '',
};

/**
 * Estimated expense form dialog.
 * @returns
 */
function EstimatedExpenseForm({
  //#withDialogActions
  closeDialog,
}) {
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
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
      validationSchema={CreateEstimatedExpenseFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={EstimatedExpenseFormConent}
    />
  );
}

export default compose(withDialogActions)(EstimatedExpenseForm);
