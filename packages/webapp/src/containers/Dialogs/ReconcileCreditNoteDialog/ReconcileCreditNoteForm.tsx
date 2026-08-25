import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import '@/style/pages/ReconcileCreditNote/ReconcileCreditNoteForm.scss';
import { CreateReconcileCreditNoteFormSchema } from './ReconcileCreditNoteForm.schema';
import { ReconcileCreditNoteFormContent } from './ReconcileCreditNoteFormContent';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import { transformErrors } from './utils';
import type { ReconcileCreditNoteFormValues } from './types';
import type { ApplyCreditNoteToInvoicesBody } from '@bigcapital/sdk-ts';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

// Default form initial values.
const defaultInitialValues = {
  entries: [
    {
      invoiceId: '',
      amount: '',
    },
  ],
};

interface ReconcileCreditNoteFormProps extends WithDialogActionsProps {}

/**
 * Reconcile credit note form.
 */
function ReconcileCreditNoteFormInner({
  closeDialog,
}: ReconcileCreditNoteFormProps): React.ReactElement {
  const {
    dialogName,
    creditNoteId,
    reconcileCreditNotes,
    createReconcileCreditNoteMutate,
  } = useReconcileCreditNoteContext();

  // Initial form values.
  const initialValues: ReconcileCreditNoteFormValues = {
    entries: reconcileCreditNotes.map((entry) => ({
      ...entry,
      invoiceId: entry.id ?? '',
      amount: '',
    })),
  };

  // Handle form submit.
  const handleFormSubmit = (
    values: ReconcileCreditNoteFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ReconcileCreditNoteFormValues>,
  ) => {
    setSubmitting(true);

    // Filters the entries.
    const entries = values.entries
      .filter(
        (entry) =>
          entry.invoiceId && entry.amount !== '' && entry.amount != null,
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
        message: intl.get('reconcile_credit_note.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      closeDialog(dialogName);
    };
    // Handle the request error.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };

    // FIXME: latent bug preserved — `creditNoteId` is `number | null` but the
    // dialog only opens with a real id. Non-null assertion matches runtime.
    createReconcileCreditNoteMutate([
      creditNoteId!,
      form as ApplyCreditNoteToInvoicesBody,
    ])
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateReconcileCreditNoteFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ReconcileCreditNoteFormContent}
    />
  );
}

export const ReconcileCreditNoteForm = compose(withDialogActions)(
  ReconcileCreditNoteFormInner,
);
