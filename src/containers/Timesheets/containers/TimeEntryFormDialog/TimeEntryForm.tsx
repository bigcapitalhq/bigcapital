// @ts-nocheck
import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { AppToaster } from 'components';

import TimeEntryFormContent from './TimeEntryFormContent';
import { CreateTimeEntryFormSchema } from './TimeEntryForm.schema';
import { useTimeEntryFormContext } from './TimeEntryFormProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  projectId: '',
  taskId: '',
  description: '',
  duration: '',
};

/**
 * Time entry form.
 * @returns
 */
function TimeEntryForm({
  // #withDialogActions
  closeDialog,
}) {
  // time entry form dialog context.
  const { dialogName } = useTimeEntryFormContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {};

    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({});
      closeDialog(dialogName);
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
      validationSchema={CreateTimeEntryFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={TimeEntryFormContent}
    />
  );
}

export default compose(withDialogActions)(TimeEntryForm);
