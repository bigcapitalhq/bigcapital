//@ts-nocheck
import React from 'react';
import { Formik } from 'formik';
import { CreateProjectTaskFormSchema } from './ProjectTaskForm.schema';
import { useProjectTaskFormContext } from './ProjectTaskFormProvider';
import { AppToaster } from 'components';
import ProjectTaskFormContent from './ProjectTaskFormContent';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const defaultInitialValues = {
  taskName: '',
  taskHouse: '00:00',
  taskCharge: 'hourly_rate',
  taskamount: '',
};

/**
 * Project task form.
 * @returns
 */
function ProjectTaskForm({
  // #withDialogActions
  closeDialog,
}) {
  // task form dialog context.
  const { dialogName } = useProjectTaskFormContext();

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
      validationSchema={CreateProjectTaskFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ProjectTaskFormContent}
    />
  );
}

export default compose(withDialogActions)(ProjectTaskForm);
