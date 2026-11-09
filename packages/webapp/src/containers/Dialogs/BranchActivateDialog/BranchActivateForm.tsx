import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import { BranchActivateFormContent } from './BranchActivateFormContent';
import { useBranchActivateContext } from './BranchActivateFormProvider';
import type { BranchActivateFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface BranchActivateFormProps extends WithDialogActionsProps {}

/**
 * Branch activate form.
 */
function BranchActivateFormInner({
  closeDialog,
}: BranchActivateFormProps): React.ReactElement {
  const { activateBranches, dialogName } = useBranchActivateContext();

  // Initial form values
  const initialValues: BranchActivateFormValues = {};

  // Handles the form submit.
  const handleFormSubmit = (
    _values: BranchActivateFormValues,
    { setSubmitting }: FormikHelpers<BranchActivateFormValues>,
  ) => {
    setSubmitting(true);
    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('branch_activate.dialog_success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = () => {
      setSubmitting(false);
    };
    activateBranches().then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={BranchActivateFormContent}
    />
  );
}

export const BranchActivateForm = FF.pipe(
  BranchActivateFormInner,
  withDialogActions,
);
