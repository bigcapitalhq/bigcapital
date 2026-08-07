import { Intent } from '@blueprintjs/core';
import { Formik, type FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { CreateQuickPaymentMadeFormSchema } from './QuickPaymentMade.schema';
import { QuickPaymentMadeFormContent } from './QuickPaymentMadeFormContent';
import { useQuickPaymentMadeContext } from './QuickPaymentMadeFormProvider';
import {
  defaultPaymentMade,
  transformBillToForm,
  transformErrors,
} from './utils';
import type { QuickPaymentMadeFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface QuickPaymentMadeFormProps extends WithDialogActionsProps {}

/**
 * Quick payment made form.
 */
function QuickPaymentMadeFormInner({
  closeDialog,
}: QuickPaymentMadeFormProps): React.ReactElement {
  const { bill, dialogName, createPaymentMadeMutate } =
    useQuickPaymentMadeContext();

  // Initial form values.
  const initialValues: QuickPaymentMadeFormValues = {
    ...defaultPaymentMade,
    ...transformBillToForm(bill),
  } as QuickPaymentMadeFormValues;
  // Handles the form submit.
  const handleFormSubmit = (
    values: QuickPaymentMadeFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<QuickPaymentMadeFormValues>,
  ) => {
    const { billId: _billId, ...rest } = values;
    void _billId;
    const entries = [
      {
        paymentAmount: values.amount,
        billId: values.billId,
      },
    ];
    const form = {
      ...rest,
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
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        transformErrors(errors, { setFieldError });
      }
      setSubmitting(false);
    };
    // SDK `CreateBillPaymentBody` is loosely typed (`paymentDate: Record<string,
    // never>`, `entries: string[]`) which doesn't structurally overlap with the
    // form's specific shape. Runtime sends the correct payload.
    // @ts-expect-error — SDK body shape too loose to assign without `as unknown as`.
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

export const QuickPaymentMadeForm = compose(withDialogActions)(
  QuickPaymentMadeFormInner,
);
