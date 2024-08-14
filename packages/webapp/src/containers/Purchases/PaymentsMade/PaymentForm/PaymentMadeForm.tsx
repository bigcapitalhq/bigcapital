// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Formik, Form, FormikHelpers } from 'formik';
import { Intent } from '@blueprintjs/core';
import { sumBy, defaultTo } from 'lodash';
import { useHistory } from 'react-router-dom';

import { CLASSES } from '@/constants/classes';
import { AppToaster } from '@/components';
import PaymentMadeHeader from './PaymentMadeFormHeader';
import PaymentMadeFloatingActions from './PaymentMadeFloatingActions';
import PaymentMadeFooter from './PaymentMadeFooter';
import PaymentMadeFormBody from './PaymentMadeFormBody';
import PaymentMadeFormTopBar from './PaymentMadeFormTopBar';
import { PaymentMadeDialogs } from './PaymentMadeDialogs';

import { PaymentMadeInnerProvider } from './PaymentMadeInnerProvider';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import { compose, orderingLinesIndexes } from '@/utils';

import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import {
  EditPaymentMadeFormSchema,
  CreatePaymentMadeFormSchema,
} from './PaymentMadeForm.schema';
import {
  defaultPaymentMade,
  transformToEditForm,
  transformErrors,
  transformFormToRequest,
  getPaymentExcessAmountFromValues,
} from './utils';

/**
 * Payment made form component.
 */
function PaymentMadeForm({
  // #withSettings
  preferredPaymentAccount,

  // #withCurrentOrganization
  organization: { base_currency },

  // #withDialogActions
  openDialog,
}) {
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
  } = usePaymentMadeFormContext();

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(!isNewMode
        ? {
            ...transformToEditForm(paymentMadeEditPage, paymentEntriesEditPage),
          }
        : {
            ...defaultPaymentMade,
            payment_account_id: defaultTo(preferredPaymentAccount),
            currency_code: base_currency,
            entries: orderingLinesIndexes(defaultPaymentMade.entries),
          }),
    }),
    [isNewMode, paymentMadeEditPage, paymentEntriesEditPage],
  );

  // Handle the form submit.
  const handleSubmitForm = (
    values,
    { setSubmitting, resetForm, setFieldError }: FormikHelpers<any>,
  ) => {
    setSubmitting(true);

    if (values.amount <= 0) {
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
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        transformErrors(errors, { setFieldError });
      }
      setSubmitting(false);
    };
    if (!isNewMode) {
      return editPaymentMadeMutate([paymentMadeId, form])
        .then(onSaved)
        .catch(onError);
    } else {
      return createPaymentMadeMutate(form).then(onSaved).catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_PAYMENT_MADE,
      )}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={
          isNewMode ? CreatePaymentMadeFormSchema : EditPaymentMadeFormSchema
        }
        onSubmit={handleSubmitForm}
      >
        <Form>
          <PaymentMadeInnerProvider>
            <PaymentMadeFormTopBar />
            <PaymentMadeHeader />
            <PaymentMadeFormBody />
            <PaymentMadeFooter />
            <PaymentMadeFloatingActions />
            <PaymentMadeDialogs />
          </PaymentMadeInnerProvider>
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withSettings(({ billPaymentSettings }) => ({
    paymentNextNumber: billPaymentSettings?.next_number,
    paymentNumberPrefix: billPaymentSettings?.number_prefix,
    preferredPaymentAccount: parseInt(billPaymentSettings?.withdrawalAccount),
  })),
  withCurrentOrganization(),
  withDialogActions,
)(PaymentMadeForm);
