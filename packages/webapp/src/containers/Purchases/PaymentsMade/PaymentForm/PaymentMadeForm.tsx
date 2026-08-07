import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Formik, Form, type FormikHelpers } from 'formik';
import { defaultTo } from 'lodash';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { PaymentMadeDialogs } from './PaymentMadeDialogs';
import { PaymentMadeFloatingActions } from './PaymentMadeFloatingActions';
import { PaymentMadeFooter } from './PaymentMadeFooter';
import {
  EditPaymentMadeFormSchema,
  CreatePaymentMadeFormSchema,
} from './PaymentMadeForm.schema';
import { PaymentMadeFormBody } from './PaymentMadeFormBody';
import { PaymentMadeFormHeader as PaymentMadeHeader } from './PaymentMadeFormHeader';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import { PaymentMadeFormTopBar } from './PaymentMadeFormTopBar';
import { PaymentMadeInnerProvider } from './PaymentMadeInnerProvider';
import {
  defaultPaymentMade,
  transformToEditForm,
  transformErrors,
  transformFormToRequest,
  getPaymentExcessAmountFromValues,
  type PaymentMadeFormValues,
  type PaymentMadeErrorResponse,
  type PaymentMadeEditEntry,
} from './utils';
import type {
  CreateBillPaymentBody,
  EditBillPaymentBody,
} from '@bigcapital/sdk-ts';
import { AppToaster, Box } from '@/components';
import { PageForm } from '@/components/PageForm';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { compose, orderingLinesIndexes } from '@/utils';

type WithDialogActionsProps = {
  openDialog: (name: string, payload?: Record<string, unknown>) => void;
};

type PaymentMadeFormRootProps = WithDialogActionsProps;

/**
 * Payment made form component.
 */
function PaymentMadeFormInner({ openDialog }: PaymentMadeFormRootProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const history = useHistory();

  // Payment made form context.
  const {
    isNewMode,
    paymentMadeId,
    paymentMadeEditPage,
    paymentEntriesEditPage,
    submitPayload,
    createPaymentMadeMutate,
    editPaymentMadeMutate,
    isExcessConfirmed,
    billPaymentSettings,
  } = usePaymentMadeFormContext();

  const preferredPaymentAccount = parseInt(
    (billPaymentSettings?.withdrawalAccount as string | undefined) ?? '',
  ) as number | undefined;

  // Form initial values.
  const initialValues: PaymentMadeFormValues = useMemo(
    () => ({
      ...(!isNewMode
        ? transformToEditForm(
            paymentMadeEditPage ?? {},
            (paymentEntriesEditPage ?? []) as PaymentMadeEditEntry[],
          )
        : {
            ...defaultPaymentMade,
            paymentAccountId: defaultTo(preferredPaymentAccount, ''),
            currencyCode: baseCurrency ?? '',
            entries: orderingLinesIndexes(defaultPaymentMade.entries),
          }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isNewMode, paymentMadeEditPage, paymentEntriesEditPage],
  );

  // Handle the form submit.
  const handleSubmitForm = (
    values: PaymentMadeFormValues,
    {
      setSubmitting,
      resetForm,
      setFieldError,
    }: FormikHelpers<PaymentMadeFormValues>,
  ) => {
    setSubmitting(true);

    if (Number(values.amount) <= 0) {
      AppToaster.show({
        message: intl.get('you_cannot_make_payment_with_zero_total_amount'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const excessAmount = getPaymentExcessAmountFromValues(values);

    // Show the confirmation popup if the excess amount bigger than zero and
    // has not been confirmed yet.
    if (excessAmount > 0 && !isExcessConfirmed) {
      openDialog('payment-made-excessed-payment');
      setSubmitting(false);

      return;
    }
    // Transformes the form values to request body.
    const form = transformFormToRequest(values);

    // Triggers once the save request success.
    const onSaved = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_payment_made_has_been_created_successfully'
            : 'the_payment_made_has_been_edited_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      submitPayload.redirect && history.push('/payments-made');
      submitPayload.resetForm && resetForm();
    };

    const onError = ({
      data: { errors },
    }: {
      data: { errors?: PaymentMadeErrorResponse[] };
    }) => {
      if (errors) {
        transformErrors(errors, { setFieldError });
      }
      setSubmitting(false);
    };
    if (!isNewMode) {
      return editPaymentMadeMutate([
        paymentMadeId as number,
        form as unknown as EditBillPaymentBody,
      ])
        .then(onSaved)
        .catch(onError);
    } else {
      return createPaymentMadeMutate(form as unknown as CreateBillPaymentBody)
        .then(onSaved)
        .catch(onError);
    }
  };

  return (
    <Formik<PaymentMadeFormValues>
      initialValues={initialValues}
      validationSchema={
        isNewMode ? CreatePaymentMadeFormSchema : EditPaymentMadeFormSchema
      }
      onSubmit={handleSubmitForm}
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
          <PageForm.Body>
            <PaymentMadeInnerProvider>
              <PaymentMadeFormTopBar />
              <PaymentMadeHeader />

              <Box p="18px 32px 0">
                <PaymentMadeFormBody />
              </Box>
              <PaymentMadeFooter />
            </PaymentMadeInnerProvider>
          </PageForm.Body>

          <PageForm.Footer>
            <PaymentMadeFloatingActions />
          </PageForm.Footer>

          {/* --------- Dialogs --------- */}
          <PaymentMadeDialogs />
        </PageForm>
      </Form>
    </Formik>
  );
}

export const PaymentMadeForm = compose(withDialogActions)(PaymentMadeFormInner);
