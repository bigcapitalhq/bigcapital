import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/ReconcileVendorCredit/ReconcileVendorCreditForm.scss';
import { CreateReconcileVendorCreditFormSchema } from './ReconcileVendorCreditForm.schema';
import { ReconcileVendorCreditFormContent } from './ReconcileVendorCreditFormContent';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import type { ReconcileVendorCreditFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

// Default form initial values.
const defaultInitialValues = {
  entries: [
    {
      billId: '',
      amount: '',
    },
  ],
};

interface ReconcileVendorCreditFormProps extends WithDialogActionsProps {}

/**
 * Reconcile vendor credit form.
 */
function ReconcileVendorCreditFormInner({
  closeDialog,
}: ReconcileVendorCreditFormProps): React.ReactElement {
  const {
    dialogName,
    reconcileVendorCredits,
    createReconcileVendorCreditMutate,
    vendorCredit,
  } = useReconcileVendorCreditContext();

  // Initial form values.
  const initialValues: ReconcileVendorCreditFormValues = {
    entries: reconcileVendorCredits.map((entry) => ({
      ...entry,
      billId: entry.id ?? '',
      amount: '',
    })),
  };

  // Handle form submit.
  const handleFormSubmit = (
    values: ReconcileVendorCreditFormValues,
    { setSubmitting }: FormikHelpers<ReconcileVendorCreditFormValues>,
  ) => {
    setSubmitting(true);
    // Filters the entries.
    const entries = values.entries
      .filter(
        (entry) => entry.billId && entry.amount !== '' && entry.amount != null,
      )
      .map((entry) =>
        transformToForm(
          entry as unknown as Record<string, unknown>,
          defaultInitialValues.entries[0],
        ),
      );

    const form = {
      ...values,
      entries,
    };

    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('reconcile_vendor_credit.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      closeDialog(dialogName);
    };

    // Handle the request error.
    // FIXME: latent bug — original code had `transformErrors(errors, { setErrors })`
    // call commented out. Preserved as-is.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      void errors;
      setSubmitting(false);
    };

    // FIXME: latent bug — `vendorCredit` may be undefined when the query hasn't
    // resolved; original code reads `vendorCredit.id` directly.
    // @ts-expect-error — `vendorCredit` may be undefined at runtime.
    createReconcileVendorCreditMutate([vendorCredit.id, form])
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateReconcileVendorCreditFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ReconcileVendorCreditFormContent}
    />
  );
}
export const ReconcileVendorCreditForm = compose(withDialogActions)(
  ReconcileVendorCreditFormInner,
);
