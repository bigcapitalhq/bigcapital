import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { sumBy, pick, defaultTo } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import { AppToaster } from 'components';
import PaymentMadeHeader from './PaymentMadeFormHeader';
import PaymentMadeFloatingActions from './PaymentMadeFloatingActions';
import PaymentMadeFooter from './PaymentMadeFooter';
import PaymentMadeFormBody from './PaymentMadeFormBody';
import { PaymentMadeInnerProvider } from './PaymentMadeInnerProvider';

import withSettings from 'containers/Settings/withSettings';
import {
  EditPaymentMadeFormSchema,
  CreatePaymentMadeFormSchema,
} from './PaymentMadeForm.schema';
import { compose, orderingLinesIndexes } from 'utils';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import { defaultPaymentMade, transformToEditForm, ERRORS } from './utils';

/**
 * Payment made form component.
 */
function PaymentMadeForm({
  // #withSettings
  preferredPaymentAccount,
  baseCurrency,
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
            currency_code: baseCurrency,
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

    // Filters entries that have no `bill_id` or `payment_amount`.
    const entries = values.entries
      .filter((item) => item.bill_id && item.payment_amount)
      .map((entry) => ({
        ...pick(entry, ['payment_amount', 'bill_id']),
      }));
    // Total payment amount of entries.
    const totalPaymentAmount = sumBy(entries, 'payment_amount');

    if (totalPaymentAmount <= 0) {
      AppToaster.show({
        message: intl.get('you_cannot_make_payment_with_zero_total_amount'),
        intent: Intent.WARNING,
      });
      return;
    }
    const form = { ...values, entries };

    // Triggers once the save request success.
    const onSaved = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_payment_made_has_been_edited_successfully'
            : 'the_payment_made_has_been_created_successfully',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      submitPayload.redirect && history.push('/payment-mades');
      submitPayload.resetForm && resetForm();
    };

    const onError = ({
      response: {
        error: {
          data: { errors },
        },
      },
    }) => {
      const getError = (errorType) => errors.find((e) => e.type === errorType);

      if (getError(ERRORS.PAYMENT_NUMBER_NOT_UNIQUE)) {
        setFieldError(
          'payment_number',
          intl.get('payment_number_is_not_unique'),
        );
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
  withSettings(({ billPaymentSettings, organizationSettings }) => ({
    paymentNextNumber: billPaymentSettings?.next_number,
    paymentNumberPrefix: billPaymentSettings?.number_prefix,
    preferredPaymentAccount: parseInt(billPaymentSettings?.withdrawalAccount),
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(PaymentMadeForm);
