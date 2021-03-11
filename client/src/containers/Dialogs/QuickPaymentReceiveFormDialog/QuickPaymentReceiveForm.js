import React from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { pick } from 'lodash';

import { AppToaster } from 'components';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import { CreateQuickPaymentReceiveFormSchema } from './QuickPaymentReceive.schema';
import QuickPaymentReceiveFormContent from './QuickPaymentReceiveFormContent';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { defaultInitialValues, transformErrors } from './utils';
import { compose } from 'utils';

/**
 * Quick payment receive form.
 */
function QuickPaymentReceiveForm({
  // #withDialogActions
  closeDialog,
}) {
  const { formatMessage } = useIntl();
  const {
    dialogName,
    invoice,
    createPaymentReceiveMutate,
  } = useQuickPaymentReceiveContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...invoice,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setFieldError }) => {
    const entries = [values]
      .filter((entry) => entry.id && entry.payment_amount)
      .map((entry) => ({
        invoice_id: entry.id,
        ...pick(entry, ['payment_amount']),
      }));

    const form = {
      ...values,
      customer_id: values.customer.id,
      entries,
    };

    // Handle request response success.
    const onSaved = (response) => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_payment_receive_transaction_has_been_created',
        }),
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

    createPaymentReceiveMutate(form).then(onSaved).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateQuickPaymentReceiveFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={QuickPaymentReceiveFormContent}
    />
  );
}

export default compose(withDialogActions)(QuickPaymentReceiveForm);
