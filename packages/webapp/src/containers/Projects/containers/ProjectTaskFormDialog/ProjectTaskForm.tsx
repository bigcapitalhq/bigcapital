// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateProjectTaskFormSchema } from './ProjectTaskForm.schema';
import { TaskFormContent as ProjectTaskFormContent } from './ProjectTaskFormContent';
import { useProjectTaskFormContext } from './ProjectTaskFormProvider';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const defaultInitialValues = {
  name: '',
  estimate_hours: '',
  rate: '0.00',
};

/**
 * Project task form.
 * @returns
 */
function ProjectTaskFormInner({
  // #withDialogActions
  closeDialog,
}) {
  // task form dialog context.
  const {
    taskId,
    projectId,
    isNewMode,
    dialogName,
    projectTask,
    createProjectTaskMutate,
    editProjectTaskMutate,
  } = useProjectTaskFormContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...transformToForm(projectTask, defaultInitialValues),
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = { ...values };

    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'project_task.dialog.success_message'
            : 'project_task.dialog.edit_success_message',
        ),

        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = ({ data: { errors } }) => {
      setSubmitting(false);
    };
    if (isNewMode) {
      createProjectTaskMutate([projectId, form]).then(onSuccess).catch(onError);
    } else {
      editProjectTaskMutate([taskId, form]).then(onSuccess).catch(onError);
    }
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

export const ProjectTaskForm = compose(withDialogActions)(ProjectTaskFormInner);
