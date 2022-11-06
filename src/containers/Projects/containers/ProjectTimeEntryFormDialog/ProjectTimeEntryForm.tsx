// @ts-nocheck
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

import { compose, transformToForm } from '@/utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  task_id: '',
  project_id: '',
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
    isNewMode,
    timesheetId,
    projectTimeEntry,
    createProjectTimeEntryMutate,
    editProjectTimeEntryMutate,
  } = useProjectTimeEntryFormContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...transformToForm(projectTimeEntry, defaultInitialValues),
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
          isNewMode
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
    if (isNewMode) {
      createProjectTimeEntryMutate([values.task_id, form])
        .then(onSuccess)
        .catch(onError);
    } else {
      editProjectTimeEntryMutate([timesheetId, form])
        .then(onSuccess)
        .catch(onError);
    }
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
