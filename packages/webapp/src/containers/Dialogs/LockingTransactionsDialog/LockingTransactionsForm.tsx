import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/TransactionsLocking/TransactionsLockingDialog.scss';
import { CreateLockingTransactionsFormSchema } from './LockingTransactionsForm.schema';
import { LockingTransactionsFormContent } from './LockingTransactionsFormContent';
import { useLockingTransactionsContext } from './LockingTransactionsFormProvider';
import type { LockingTransactionsFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

const defaultInitialValues: LockingTransactionsFormValues = {
  module: '',
  lock_to_date: moment(new Date()).format('YYYY-MM-DD'),
  reason: '',
};

interface LockingTransactionsFormProps extends WithDialogActionsProps {}

/**
 * Locking Transactions Form.
 */
function LockingTransactionsFormInner({
  closeDialog,
}: LockingTransactionsFormProps): React.ReactElement {
  const {
    dialogName,
    moduleName,
    transactionLocking,
    isEnabled,
    createLockingTransactionMutate,
  } = useLockingTransactionsContext();

  // FIXME: deps array only includes `isEnabled` — ignores `transactionLocking`
  // and `moduleName`. Preserved from @ts-nocheck original.
  const initialValues = React.useMemo<LockingTransactionsFormValues>(
    () => ({
      ...(isEnabled
        ? {
            ...(transformToForm(
              transactionLocking,
              defaultInitialValues,
            ) as LockingTransactionsFormValues),
            module: moduleName,
          }
        : {
            ...defaultInitialValues,
            module: moduleName,
          }),
    }),
    [isEnabled],
  );

  // Handles the form submit.
  const handleFormSubmit = (
    values: LockingTransactionsFormValues,
    { setSubmitting }: FormikHelpers<LockingTransactionsFormValues>,
  ) => {
    setSubmitting(true);

    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('locking_transactions.dialog.success_message'),
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

    createLockingTransactionMutate(values).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateLockingTransactionsFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={LockingTransactionsFormContent}
    />
  );
}
export const LockingTransactionsForm = compose(withDialogActions)(
  LockingTransactionsFormInner,
);
