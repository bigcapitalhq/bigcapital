import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { BranchActivateFormContent } from './BranchActivateFormContent';
import { useBranchActivateContext } from './BranchActivateFormProvider';
import type { BranchActivateFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

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
    values: BranchActivateFormValues,
    { setSubmitting }: FormikHelpers<BranchActivateFormValues>,
  ) => {
    const form = { ...values };
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
    // @ts-expect-error — latent bug preserved: hook expects a number|string id, original code passed an object.
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

export const BranchActivateForm = compose(withDialogActions)(
  BranchActivateFormInner,
);
