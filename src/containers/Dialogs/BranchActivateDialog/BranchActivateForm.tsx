// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from '@/components';
import { useBranchActivateContext } from './BranchActivateFormProvider';
import BranchActivateFormContent from './BranchActivateFormContent';

import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';

/**
 * Branch activate form.
 */
function BranchActivateForm({
  // #withDialogActions
  closeDialog,
}) {
  const { activateBranches, dialogName } = useBranchActivateContext();

  // Initial form values
  const initialValues = {};

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...values,
    };
    setSubmitting(true);
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('branch_activate.dialog_success_message'),
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
      if (errors) {
      }
      setSubmitting(false);
    };
    activateBranches(form).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={BranchActivateFormContent}
    />
  );
}

export default compose(withDialogActions)(BranchActivateForm);
