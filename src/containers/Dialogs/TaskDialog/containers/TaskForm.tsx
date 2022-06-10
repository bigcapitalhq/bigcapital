//@ts-nocheck
import React from 'react';

import { Formik } from 'formik';

import { CreateTaskFormSchema } from './TaskForm.schema';
import { useTaskFormContext } from './TaskFormProvider';
import TaskFormContent from './TaskFormContent';

import { AppToaster } from 'components';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const defaultInitialValues = {
  taks_name: '',
  task_house: '00:00',
  change: 'Hourly Rate',
  change_amount: '100000000',
  amount: '',
};

/**
 * Task form.
 * @returns
 */
function TaskForm({
  // #withDialogActions
  closeDialog,
}) {
  // task form dialog context.
  const { dialogName } = useTaskFormContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {};

    // Handle request response success.
    const onSuccess = (response) => {};

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
      validationSchema={CreateTaskFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={TaskFormContent}
    />
  );
}

export default compose(withDialogActions)(TaskForm);
