import React from 'react';
import intl from 'react-intl-universal';

import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';

import { AppToaster } from 'components';
import { CreateNotifyContactViaSMSFormSchema } from './NotifyContactViaSMSForm.schema';

import NotifyContactViaSMSFormContent from './NotifyContactViaSMSFormContent';

import withDialogActions from 'containers/Dialog/withDialogActions';

import { useNotifyContactViaSMSContext } from './NotifyContactViaSMSFormProvider';

import { transformToForm, compose } from 'utils';

const defaultInitialValues = {
  customer_name: '',
  customer_personal_phone: '',
  sms_message: '',
};

function NotifyContactViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    invoiceId,
    invoiceSMSDetail,
    dialogName,
    createNotifyInvoiceBySMSMutate,
  } = useNotifyContactViaSMSContext();

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...transformToForm(invoiceSMSDetail, defaultInitialValues),
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('notify_via_sms.dialog.success_message'),
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
    createNotifyInvoiceBySMSMutate([invoiceId, values])
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateNotifyContactViaSMSFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={NotifyContactViaSMSFormContent}
    />
  );
}
export default compose(withDialogActions)(NotifyContactViaSMSForm);
