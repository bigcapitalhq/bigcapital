// @ts-nocheck
import { Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateProjectExpenseFormSchema } from './ProjectExpenseForm.schema';
import { ProjectExpenseFormContent } from './ProjectExpenseFormContent';
import { useProjectExpenseFormContext } from './ProjectExpenseFormProvider';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

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
 * Project expense form.
 * @returns
 */
function ProjectExpenseFormInner({
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
    const onError = ({ data: { errors } }) => {
      setSubmitting(false);
    };
  };
  return (
    <Formik
      validationSchema={CreateProjectExpenseFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ProjectExpenseFormContent}
    />
  );
}

export const ProjectExpenseForm = compose(withDialogActions)(
  ProjectExpenseFormInner,
);
