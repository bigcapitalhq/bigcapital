import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import { omit } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateVendorRefundCreditFormSchema } from './RefundVendorCreditForm.schema';
import { RefundVendorCreditFormContent } from './RefundVendorCreditFormContent';
import { useRefundVendorCreditContext } from './RefundVendorCreditFormProvider';
import type { RefundVendorCreditFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

const defaultInitialValues: RefundVendorCreditFormValues = {
  depositAccountId: '',
  date: moment(new Date()).format('YYYY-MM-DD'),
  referenceNo: '',
  description: '',
  amount: '',
  exchangeRate: 1,
};

interface RefundVendorCreditFormProps extends WithDialogActionsProps {}

/**
 * Refund Vendor credit form.
 */
function RefundVendorCreditFormInner({
  closeDialog,
}: RefundVendorCreditFormProps): React.ReactElement {
  const { vendorCredit, dialogName, createRefundVendorCreditMutate } =
    useRefundVendorCreditContext();

  // Initial form values
  const initialValues: RefundVendorCreditFormValues = {
    ...defaultInitialValues,
    ...(vendorCredit as unknown as RefundVendorCreditFormValues),
  };

  // Handles the form submit.
  const handleFormSubmit = (
    values: RefundVendorCreditFormValues,
    { setSubmitting }: FormikHelpers<RefundVendorCreditFormValues>,
  ) => {
    const form = {
      ...omit(values, ['currencyCode', 'creditsRemaining']),
    };

    // Handle request response success.
    const onSaved = () => {
      AppToaster.show({
        message: intl.get('refund_vendor_credit.dialog.success_message'),
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

    // FIXME: latent bug — `vendorCredit` may be undefined before the query
    // resolves; original code accessed `vendorCredit.id` directly.
    // @ts-expect-error — `vendorCredit` may be undefined at runtime.
    createRefundVendorCreditMutate([vendorCredit.id, form])
      .then(onSaved)
      .catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateVendorRefundCreditFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={RefundVendorCreditFormContent}
    />
  );
}

export const RefundVendorCreditForm = compose(withDialogActions)(
  RefundVendorCreditFormInner,
);
