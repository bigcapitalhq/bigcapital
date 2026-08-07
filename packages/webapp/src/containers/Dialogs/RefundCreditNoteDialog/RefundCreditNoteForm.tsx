import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import { omit } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateRefundCreditNoteFormSchema } from './RefundCreditNoteForm.schema';
import { RefundCreditNoteFormContent } from './RefundCreditNoteFormContent';
import { useRefundCreditNoteContext } from './RefundCreditNoteFormProvider';
import type { RefundCreditNoteFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues: RefundCreditNoteFormValues = {
  fromAccountId: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
  referenceNo: '',
  description: '',
  amount: '',
  exchangeRate: 1,
};

interface RefundCreditNoteFormProps extends WithDialogActionsProps {}

/**
 * Refund credit note form.
 */
function RefundCreditNoteFormInner({
  closeDialog,
}: RefundCreditNoteFormProps): React.ReactElement {
  const { dialogName, creditNote, createRefundCreditNoteMutate } =
    useRefundCreditNoteContext();

  // Initial form values
  const initialValues: RefundCreditNoteFormValues = {
    ...defaultInitialValues,
    ...(creditNote as unknown as RefundCreditNoteFormValues),
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: RefundCreditNoteFormValues,
    { setSubmitting }: FormikHelpers<RefundCreditNoteFormValues>,
  ) => {
    const form = {
      ...omit(values, ['currencyCode', 'creditsRemaining']),
    };

    // Handle request response success.
    const onSaved = () => {
      AppToaster.show({
        message: intl.get('refund_credit_note.dialog.success_message'),
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
    // FIXME: latent bug — `creditNote` may be undefined before the query
    // resolves; original code accessed `creditNote.id` directly.
    // @ts-expect-error — `creditNote` may be undefined at runtime.
    createRefundCreditNoteMutate([creditNote.id, form])
      .then(onSaved)
      .catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateRefundCreditNoteFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={RefundCreditNoteFormContent}
    />
  );
}
export const RefundCreditNoteForm = compose(withDialogActions)(
  RefundCreditNoteFormInner,
);
