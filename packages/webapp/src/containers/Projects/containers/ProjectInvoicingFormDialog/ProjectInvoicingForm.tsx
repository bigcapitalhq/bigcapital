// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateProjectInvoicingFormSchema } from './ProjectInvoicingForm.schema';
import { ProjectInvoicingFormContent } from './ProjectInvoicingFormContent';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  time: false,
  unbilled: false,
  bills: false,
};

/**
 * project invoicing form.
 * @returns
 */
function ProjectInvoicingFormInner({
  // #withDialogActions
  closeDialog,
}) {
  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {};

    // Handle request response errors.
    const onError = ({ data: { errors } }) => {
      setSubmitting(false);
    };
  };

  return (
    <Formik
      validationSchema={CreateProjectInvoicingFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ProjectInvoicingFormContent}
    />
  );
}

export const ProjectInvoicingForm = compose(withDialogActions)(
  ProjectInvoicingFormInner,
);
