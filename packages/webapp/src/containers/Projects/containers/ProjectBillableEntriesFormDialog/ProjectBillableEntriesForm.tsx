// @ts-nocheck

import { Formik } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { ProjectBillableEntriesFormSchema } from './ProjectBillableEntriesForm.schema';
import { ProjectBillableEntriesFormContent } from './ProjectBillableEntriesFormContent';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues = {};

/**
 * project billable entries form.
 * @returns
 */
function ProjectBillableEntriesFormInner({
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
      validationSchema={ProjectBillableEntriesFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ProjectBillableEntriesFormContent}
    />
  );
}

export const ProjectBillableEntriesForm = compose(withDialogActions)(
  ProjectBillableEntriesFormInner,
);
