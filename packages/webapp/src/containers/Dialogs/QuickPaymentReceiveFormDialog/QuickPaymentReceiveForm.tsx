import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateQuickPaymentReceiveFormSchema } from './QuickPaymentReceive.schema';
import { QuickPaymentReceiveFormContent } from './QuickPaymentReceiveFormContent';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import {
  defaultInitialValues,
  transformErrors,
  transformInvoiceToForm,
} from './utils';
import type { QuickPaymentReceiveFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose, transactionNumber } from '@/utils';

/**
 * Quick payment receive form.
 */
interface QuickPaymentReceiveFormProps extends WithDialogActionsProps {}

function QuickPaymentReceiveFormInner({
  closeDialog,
}: QuickPaymentReceiveFormProps): React.ReactElement {
  const {
    dialogName,
    invoice,
    createPaymentReceiveMutate,
    paymentReceiveSettings,
  } = useQuickPaymentReceiveContext();

  const paymentReceiveNextNumber = paymentReceiveSettings?.nextNumber as
    | number
    | undefined;
  const paymentReceiveNumberPrefix = paymentReceiveSettings?.numberPrefix as
    | string
    | undefined;
  const paymentReceiveAutoIncrement = paymentReceiveSettings?.autoIncrement as
    | boolean
    | undefined;
  const preferredDepositAccount =
    paymentReceiveSettings?.preferredDepositAccount as
      | string
      | number
      | undefined;

  // Payment receive number.
  const nextPaymentNumber = transactionNumber(
    paymentReceiveNumberPrefix,
    paymentReceiveNextNumber,
  );

  // Initial form values
  const initialValues: QuickPaymentReceiveFormValues = {
    ...defaultInitialValues,
    ...(paymentReceiveAutoIncrement && {
      paymentReceiveNo: nextPaymentNumber,
    }),
    depositAccountId: defaultTo(preferredDepositAccount, ''),
    ...transformInvoiceToForm(invoice),
  } as QuickPaymentReceiveFormValues;

  // Handles the form submit.
  const handleFormSubmit = (
    values: QuickPaymentReceiveFormValues,
    {
      setSubmitting,
      setFieldError,
    }: FormikHelpers<QuickPaymentReceiveFormValues>,
  ) => {
    const {
      paymentReceiveNo: _paymentReceiveNo,
      invoiceId: _invoiceId,
      ...rest
    } = values;
    void _paymentReceiveNo;
    void _invoiceId;
    const entries = [
      {
        invoiceId: values.invoiceId,
        paymentAmount: values.amount,
      },
    ];
    const form = {
      ...rest,
      ...(!paymentReceiveAutoIncrement && {
        paymentReceiveNo: values.paymentReceiveNo,
      }),
      entries,
    };

    // Handle request response success.
    const onSaved = () => {
      AppToaster.show({
        message: intl.get('the_payment_received_transaction_has_been_created'),
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
      if (errors) {
        transformErrors(errors, { setFieldError });
      }
      setSubmitting(false);
    };
    // SDK `CreatePaymentReceivedBody` is loosely typed (`paymentDate: Record<
    // string, never>`, `entries: string[]`) which doesn't structurally overlap
    // with the form's specific shape. Runtime sends the correct payload.
    // @ts-expect-error — SDK body shape too loose to assign without `as unknown as`.
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

export const QuickPaymentReceiveForm = compose(withDialogActions)(
  QuickPaymentReceiveFormInner,
);
