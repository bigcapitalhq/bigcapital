import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/TransactionsLocking/TransactionsLockingDialog.scss';
import { CreateUnlockingTransactionsFormSchema } from './UnlockingTransactionsForm.schema';
import { UnlockingTransactionsFormContent } from './UnlockingTransactionsFormContent';
import { useUnlockingTransactionsContext } from './UnlockingTransactionsFormProvider';
import type { UnlockingTransactionsFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues: UnlockingTransactionsFormValues = {
  module: '',
  reason: '',
};

interface UnlockingTransactionsFormProps extends WithDialogActionsProps {}

/**
 * Unlocking transactions form.
 */
function UnlockingTransactionsFormInner({
  closeDialog,
}: UnlockingTransactionsFormProps): React.ReactElement {
  const { dialogName, moduleName, cancelLockingTransactionMutate } =
    useUnlockingTransactionsContext();

  // Initial form values.
  const initialValues: UnlockingTransactionsFormValues = {
    ...defaultInitialValues,
    module: moduleName,
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: UnlockingTransactionsFormValues,
    { setSubmitting }: FormikHelpers<UnlockingTransactionsFormValues>,
  ) => {
    setSubmitting(true);

    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('unlocking_transactions.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      // errors read but unused (preserved from original).
      void errors;
      setSubmitting(false);
    };

    cancelLockingTransactionMutate(values).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateUnlockingTransactionsFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={UnlockingTransactionsFormContent}
    />
  );
}
export const UnlockingTransactionsForm = compose(withDialogActions)(
  UnlockingTransactionsFormInner,
);
