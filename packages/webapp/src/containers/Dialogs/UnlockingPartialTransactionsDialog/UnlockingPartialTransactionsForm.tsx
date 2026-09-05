import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/TransactionsLocking/TransactionsLockingDialog.scss';
import { CreateUnLockingPartialTransactionsFormSchema } from './UnlockingPartialTransactionsForm.schema';
import { PartialUnlockingTransactionsFormContent as UnlockingPartialTransactionsFormContent } from './UnlockingPartialTransactionsFormContent';
import { useUnlockingPartialTransactionsContext } from './UnlockingPartialTransactionsFormProvider';
import type { UnlockingPartialTransactionsFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues: UnlockingPartialTransactionsFormValues = {
  module: '',
  unlockFromDate: moment(new Date()).format('YYYY-MM-DD'),
  unlockToDate: moment(new Date()).format('YYYY-MM-DD'),
  reason: '',
};

interface UnlockingPartialTransactionsFormProps
  extends WithDialogActionsProps {}

/**
 * Partial Unlocking transactions form.
 */
function UnlockingPartialTransactionsFormInner({
  closeDialog,
}: UnlockingPartialTransactionsFormProps): React.ReactElement {
  const { dialogName, moduleName, createUnlockingPartialTransactionsMutate } =
    useUnlockingPartialTransactionsContext();

  // Initial form values.
  const initialValues: UnlockingPartialTransactionsFormValues = {
    ...defaultInitialValues,
    module: moduleName,
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: UnlockingPartialTransactionsFormValues,
    { setSubmitting }: FormikHelpers<UnlockingPartialTransactionsFormValues>,
  ) => {
    setSubmitting(true);

    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          'unlocking_partial_transactions.dialog.success_message',
        ),
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

    createUnlockingPartialTransactionsMutate(values)
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateUnLockingPartialTransactionsFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={UnlockingPartialTransactionsFormContent}
    />
  );
}

export const UnlockingPartialTransactionsForm = compose(withDialogActions)(
  UnlockingPartialTransactionsFormInner,
);
