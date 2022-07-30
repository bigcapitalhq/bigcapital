import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { AppToaster } from '@/components';

import ProjectTimeEntryFormContent from './ProjectTimeEntryFormContent';
import { CreateProjectTimeEntryFormSchema } from './ProjectTimeEntryForm.schema';
import { useProjectTimeEntryFormContext } from './ProjectTimeEntryFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  // projectId: '',
  taskId: '',
  description: '',
  duration: '',
};

/**
 * Project Time entry form.
 * @returns
 */
function ProjectTimeEntryForm({
  // #withDialogActions
  closeDialog,
}) {
  // time entry form dialog context.
  const {
    dialogName,
    createProjectTimeEntryMutate,
    editProjectTimeEntryMutate,
  } = useProjectTimeEntryFormContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...values,
    };

    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          true
            ? 'project_time_entry.success_message'
            : 'project_time_entry.dialog.edit_success_message',
        ),

        intent: Intent.SUCCESS,
      });
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
    createProjectTimeEntryMutate([values.taskId, form])
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateProjectTimeEntryFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ProjectTimeEntryFormContent}
    />
  );
}

export default compose(withDialogActions)(ProjectTimeEntryForm);
