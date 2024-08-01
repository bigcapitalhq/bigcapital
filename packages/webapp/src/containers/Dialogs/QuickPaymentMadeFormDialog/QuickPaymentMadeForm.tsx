// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import { omit } from 'lodash';
import { AppToaster } from '@/components';
import { CreateQuickPaymentMadeFormSchema } from './QuickPaymentMade.schema';
import { useQuickPaymentMadeContext } from './QuickPaymentMadeFormProvider';
import QuickPaymentMadeFormContent from './QuickPaymentMadeFormContent';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { defaultPaymentMade, transformBillToForm, transformErrors } from './utils';
import { compose } from '@/utils';

/**
 * Quick payment made form.
 */
function QuickPaymentMadeForm({
  // #withDialogActions
  closeDialog,
}) {
  const { bill, dialogName, createPaymentMadeMutate } =
    useQuickPaymentMadeContext();

  // Initial form values.
  const initialValues = {
    ...defaultPaymentMade,
    ...transformBillToForm(bill),
  };
  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setFieldError }) => {
    const entries = [
      {
        payment_amount: values.amount,
        bill_id: values.bill_id,
      },
    ];
    const form = {
      ...omit(values, ['bill_id']),
      entries,
    };

    // Handle request response success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('the_payment_made_has_been_created_successfully'),
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
        transformErrors(errors, { setFieldError });
      }
      setSubmitting(false);
    };
    createPaymentMadeMutate(form).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateQuickPaymentMadeFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={QuickPaymentMadeFormContent}
    />
  );
}

export default compose(withDialogActions)(QuickPaymentMadeForm);
