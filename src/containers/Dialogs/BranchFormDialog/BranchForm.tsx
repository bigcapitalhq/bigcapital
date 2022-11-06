// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from '@/components';
import { CreateBranchFormSchema } from './BranchForm.schema';
import { transformErrors } from './utils';

import BranchFormContent from './BranchFormContent';
import { useBranchFormContext } from './BranchFormProvider';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const defaultInitialValues = {
  name: '',
  code: '',
  address: '',
  phone_number: '',
  email: '',
  website: '',
  city: '',
  country: '',
};

function BranchForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName, branch, branchId, createBranchMutate, editBranchMutate } =
    useBranchFormContext();

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    ...transformToForm(branch, defaultInitialValues),
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = { ...values };

    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('branch.dialog.success_message'),
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
      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };

    if (branchId) {
      editBranchMutate([branchId, form]).then(onSuccess).catch(onError);
    } else {
      createBranchMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <Formik
      validationSchema={CreateBranchFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={BranchFormContent}
    />
  );
}
export default compose(withDialogActions)(BranchForm);
