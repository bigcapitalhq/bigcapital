import React from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import moment from 'moment';
import { omit, defaultTo } from 'lodash';

import { AppToaster } from 'components';
import { useRefundCreditNoteContext } from './RefundCreditNoteFormProvider';
import { CreateRefundCreditNoteFormSchema } from './RefundCreditNoteForm.schema';
import RefundCreditNoteFormContent from './RefundCreditNoteFormContent';

import withSettings from 'containers/Settings/withSettings';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose, transactionNumber } from 'utils';

const defaultInitialValues = {
  from_account_id: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  description: '',
  amount: '',
};

/**
 * Refund credit note form.
 */
function RefundCreditNoteForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName, creditNote, createRefundCreditNoteMutate } =
    useRefundCreditNoteContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...creditNote,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setFieldError }) => {
    const form = {
      ...omit(values, ['currency_code', 'formatted_amount']),
    };

    // Handle request response success.
    const onSaved = (response) => {
      AppToaster.show({
        message: intl.get('refund_credit_note.dialog.success_message'),
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
      setSubmitting(false);
    };
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
export default compose(withDialogActions)(RefundCreditNoteForm);
