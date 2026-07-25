import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Formik, Form, type FormikHelpers } from 'formik';
import { isEmpty, defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { PaymentReceiveSyncIncrementSettingsToForm } from './components';
import { PaymentReceiveFormFloatingActions as PaymentReceiveFloatingActions } from './PaymentReceiveFloatingActions';
import {
  EditPaymentReceiveFormSchema,
  CreatePaymentReceiveFormSchema,
} from './PaymentReceiveForm.schema';
import { PaymentReceiveFormAlerts } from './PaymentReceiveFormAlerts';
import { PaymentReceiveFormBody } from './PaymentReceiveFormBody';
import { PaymentReceiveFormDialogs } from './PaymentReceiveFormDialogs';
import { PaymentReceiveFormFooter } from './PaymentReceiveFormFooter';
import { PaymentReceiveFormHeader as PaymentReceiveHeader } from './PaymentReceiveFormHeader';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { PaymentReceiveFormTopBar } from './PaymentReceiveFormTopBar';
import { PaymentReceiveInnerProvider } from './PaymentReceiveInnerProvider';
import {
  defaultPaymentReceive,
  transformToEditForm,
  transformFormToRequest,
  transformErrors,
  resetFormState,
  getExceededAmountFromValues,
  type PaymentReceiveFormValues,
  type PaymentReceiveErrorResponse,
  type PaymentReceiveEditEntry,
} from './utils';
import type {
  CreatePaymentReceivedBody,
  EditPaymentReceivedBody,
} from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { PageForm } from '@/components/PageForm';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { transactionNumber, compose } from '@/utils';

type WithDialogActionsProps = {
  openDialog: (name: string, payload?: Record<string, unknown>) => void;
};

type PaymentReceiveFormRootProps = WithDialogActionsProps;

/**
 * Payment Receive form.
 */
function PaymentReceiveFormRoot({ openDialog }: PaymentReceiveFormRootProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const history = useHistory();

  const {
    isNewMode,
    paymentReceiveEditPage,
    paymentEntriesEditPage,
    paymentReceiveId,
    submitPayload,
    editPaymentReceiveMutate,
    createPaymentReceiveMutate,
    isExcessConfirmed,
    paymentReceivedState,
    paymentReceiveSettings,
  } = usePaymentReceiveFormContext();

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
      | number
      | string
      | undefined;

  const nextPaymentNumber = transactionNumber(
    paymentReceiveNumberPrefix,
    paymentReceiveNextNumber,
  );

  const initialValues: PaymentReceiveFormValues = {
    ...(!isEmpty(paymentReceiveEditPage)
      ? transformToEditForm(
          paymentReceiveEditPage,
          (paymentEntriesEditPage ?? []) as PaymentReceiveEditEntry[],
        )
      : {
          ...defaultPaymentReceive,
          ...(paymentReceiveAutoIncrement && {
            paymentReceiveNo: nextPaymentNumber,
          }),
          depositAccountId: defaultTo(preferredDepositAccount, ''),
          currencyCode: baseCurrency ?? '',
          pdfTemplateId: paymentReceivedState?.defaultTemplateId ?? '',
        }),
  };

  const handleSubmitForm = (
    values: PaymentReceiveFormValues,
    {
      setSubmitting,
      resetForm,
      setFieldError,
    }: FormikHelpers<PaymentReceiveFormValues>,
  ) => {
    setSubmitting(true);
    const exceededAmount = getExceededAmountFromValues(values);

    if (Number(values.amount) <= 0) {
      AppToaster.show({
        message: intl.get('you_cannot_make_payment_with_zero_total_amount'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    if (exceededAmount > 0 && !isExcessConfirmed) {
      setSubmitting(false);
      openDialog('payment-received-excessed-payment');
      return;
    }
    const form = transformFormToRequest(values);

    const onSaved = () => {
      setSubmitting(false);
      AppToaster.show({
        message: intl.get(
          paymentReceiveId
            ? 'the_payment_received_transaction_has_been_edited'
            : 'the_payment_received_transaction_has_been_created',
        ),
        intent: Intent.SUCCESS,
      });

      if (submitPayload.redirect) {
        history.push('/payments-received');
      }
      if (submitPayload.resetForm) {
        resetFormState({ resetForm, initialValues, values });
      }
    };
    const onError = ({
      data: { errors },
    }: {
      data: { errors?: PaymentReceiveErrorResponse[] };
    }) => {
      if (errors) {
        transformErrors(errors, { setFieldError });
      }
      setSubmitting(false);
    };

    if (paymentReceiveId) {
      return editPaymentReceiveMutate([
        paymentReceiveId,
        form as unknown as EditPaymentReceivedBody,
      ])
        .then(onSaved)
        .catch(onError);
    } else {
      return createPaymentReceiveMutate(
        form as unknown as CreatePaymentReceivedBody,
      )
        .then(onSaved)
        .catch(onError);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmitForm}
      validationSchema={
        isNewMode
          ? CreatePaymentReceiveFormSchema
          : EditPaymentReceiveFormSchema
      }
    >
      <Form
        className={css({
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        })}
      >
        <PageForm flex={1}>
          <PaymentReceiveInnerProvider>
            <PageForm.Body>
              <PaymentReceiveFormTopBar />
              <PaymentReceiveHeader />
              <PaymentReceiveFormBody />
              <PaymentReceiveFormFooter />
            </PageForm.Body>

            <PageForm.Footer>
              <PaymentReceiveFloatingActions />
            </PageForm.Footer>

            {/* ------- Effects ------- */}
            <PaymentReceiveSyncIncrementSettingsToForm />

            {/* ------- Alerts & Dialogs ------- */}
            <PaymentReceiveFormAlerts />
            <PaymentReceiveFormDialogs />
          </PaymentReceiveInnerProvider>
        </PageForm>
      </Form>
    </Formik>
  );
}

export const PaymentReceivedForm = compose(withDialogActions)(
  PaymentReceiveFormRoot,
);
