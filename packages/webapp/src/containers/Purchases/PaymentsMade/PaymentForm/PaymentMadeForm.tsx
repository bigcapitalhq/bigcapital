// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
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

import { PaymentMadeInnerProvider } from './PaymentMadeInnerProvider';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import { compose, orderingLinesIndexes } from '@/utils';

import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import {
  EditPaymentMadeFormSchema,
  CreatePaymentMadeFormSchema,
} from './PaymentMadeForm.schema';
import {
  defaultPaymentMade,
  transformToEditForm,
  transformErrors,
  transformFormToRequest,
} from './utils';

/**
 * Payment made form component.
 */
function PaymentMadeForm({
  // #withSettings
  preferredPaymentAccount,

  // #withCurrentOrganization
  organization: { base_currency },
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
    { setSubmitting, resetForm, setFieldError },
  ) => {
    setSubmitting(true);
    // Total payment amount of entries.
    const totalPaymentAmount = sumBy(values.entries, 'payment_amount');

    if (totalPaymentAmount <= 0) {
      AppToaster.show({
        message: intl.get('you_cannot_make_payment_with_zero_total_amount'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    // Transforms the form values to request body.
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
      editPaymentMadeMutate([paymentMadeId, form]).then(onSaved).catch(onError);
    } else {
      createPaymentMadeMutate(form).then(onSaved).catch(onError);
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
)(PaymentMadeForm);
