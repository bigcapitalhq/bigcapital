import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { sumBy, omit, isEmpty } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { CLASSES } from 'common/classes';
import {
  CreateInvoiceFormSchema,
  EditInvoiceFormSchema,
} from './InvoiceForm.schema';

import InvoiceFormHeader from './InvoiceFormHeader';
import InvoiceItemsEntriesEditorField from './InvoiceItemsEntriesEditorField';
import InvoiceFloatingActions from './InvoiceFloatingActions';
import InvoiceFormFooter from './InvoiceFormFooter';
import InvoiceFormDialogs from './InvoiceFormDialogs';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster } from 'components';
import { ERROR } from 'common/errors';
import { compose, orderingLinesIndexes, transactionNumber } from 'utils';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { transformToEditForm, defaultInvoice } from './utils';

/**
 * Invoice form.
 */
function InvoiceForm({
  // #withSettings
  invoiceNextNumber,
  invoiceNumberPrefix,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();

  // Invoice form context.
  const {
    isNewMode,
    invoice,
    createInvoiceMutate,
    editInvoiceMutate,
    submitPayload,
  } = useInvoiceFormContext();

  // Invoice number.
  const invoiceNumber = transactionNumber(
    invoiceNumberPrefix,
    invoiceNextNumber,
  );

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(invoice)
        ? transformToEditForm(invoice)
        : {
            ...defaultInvoice,
            invoice_no: invoiceNumber,
            entries: orderingLinesIndexes(defaultInvoice.entries),
          }),
    }),
    [invoice, invoiceNumber],
  );

  // Handle form errors.
  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.SALE_INVOICE_NUMBER_IS_EXISTS)) {
      setErrors({
        invoice_no: formatMessage({ id: 'sale_invoice_number_is_exists' }),
      });
    }
  };

  // Handles form submit.
  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);

    const entries = values.entries.filter(
      (item) => item.item_id && item.quantity,
    );
    const totalQuantity = sumBy(entries, (entry) => parseInt(entry.quantity));

    // Throw danger toaster in case total quantity equals zero.
    if (totalQuantity === 0) {
      AppToaster.show({
        message: formatMessage({ id: 'quantity_cannot_be_zero_or_empty' }),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...values,
      delivered: submitPayload.deliver,
      entries: entries.map((entry) => ({ ...omit(entry, ['total']) })),
    };
    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_invoice_has_been_created_successfully'
              : 'the_invoice_has_been_edited_successfully',
          },
          { number: values.invoice_no },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/invoices');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };

    // Handle the request error.
    const onError = ({ response: { data: { errors } } }) => {
      if (errors) {
        handleErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };

    if (!isEmpty(invoice)) {
      editInvoiceMutate([invoice.id, form]).then(onSuccess).catch(onError);
    } else {
      createInvoiceMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_INVOICE,
      )}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateInvoiceFormSchema : EditInvoiceFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <InvoiceFormHeader />

          <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
            <InvoiceItemsEntriesEditorField />
          </div>
          <InvoiceFormFooter />
          <InvoiceFloatingActions />
          <InvoiceFormDialogs />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withDashboardActions,
  withMediaActions,
  withSettings(({ invoiceSettings }) => ({
    invoiceNextNumber: invoiceSettings?.nextNumber,
    invoiceNumberPrefix: invoiceSettings?.numberPrefix,
  })),
)(InvoiceForm);
