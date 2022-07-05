import React from 'react';
import { Formik } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import 'style/pages/ReconcileVendorCredit/ReconcileVendorCreditForm.scss';

import { AppToaster } from '@/components';
import { CreateReconcileVendorCreditFormSchema } from './ReconcileVendorCreditForm.schema';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import ReconcileVendorCreditFormContent from './ReconcileVendorCreditFormContent';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@/utils';

// Default form initial values.
const defaultInitialValues = {
  entries: [
    {
      bill_id: '',
      amount: '',
    },
  ],
};

/**
 * Reconcile vendor credit form.
 */
function ReconcileVendorCreditForm({
  // #withDialogActions
  closeDialog,
}) {
  const {
    dialogName,
    reconcileVendorCredits,
    createReconcileVendorCreditMutate,
    vendorCredit,
  } = useReconcileVendorCreditContext();

  // Initial form values.
  const initialValues = {
    entries: reconcileVendorCredits.map((entry) => ({
      ...entry,
      bill_id: entry.id,
      amount: '',
    })),
  };

  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    // Filters the entries.
    const entries = values.entries
      .filter((entry) => entry.bill_id && entry.amount)
      .map((entry) => transformToForm(entry, defaultInitialValues.entries[0]));

    const form = {
      ...values,
      entries: entries,
    };

    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('reconcile_vendor_credit.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      closeDialog(dialogName);
    };

    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      // if (errors) {
      //   transformErrors(errors, { setErrors });
      // }
      setSubmitting(false);
    };

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
export default compose(withDialogActions)(ReconcileVendorCreditForm);
