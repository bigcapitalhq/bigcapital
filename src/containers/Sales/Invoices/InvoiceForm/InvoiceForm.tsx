import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { sumBy, isEmpty } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { CLASSES } from '@/common/classes';
import {
  getCreateInvoiceFormSchema,
  getEditInvoiceFormSchema,
} from './InvoiceForm.schema';

import InvoiceFormHeader from './InvoiceFormHeader';
import InvoiceItemsEntriesEditorField from './InvoiceItemsEntriesEditorField';
import InvoiceFloatingActions from './InvoiceFloatingActions';
import InvoiceFormFooter from './InvoiceFormFooter';
import InvoiceFormDialogs from './InvoiceFormDialogs';
import InvoiceFormTopBar from './InvoiceFormTopBar';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withMediaActions from '@/containers/Media/withMediaActions';
import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { AppToaster } from '@/components';
import { compose, orderingLinesIndexes, transactionNumber } from '@/utils';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import {
  transformToEditForm,
  defaultInvoice,
  transformErrors,
  transformValueToRequest,
} from './utils';

/**
 * Invoice form.
 */
function InvoiceForm({
  // #withSettings
  invoiceNextNumber,
  invoiceNumberPrefix,
  invoiceIncrementMode,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const history = useHistory();

  // Invoice form context.
  const {
    isNewMode,
    invoice,
    estimateId,
    newInvoice,
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
        ? { ...transformToEditForm(invoice) }
        : {
            ...defaultInvoice,
            ...(invoiceIncrementMode && {
              invoice_no: invoiceNumber,
            }),
            entries: orderingLinesIndexes(defaultInvoice.entries),
            currency_code: base_currency,
            ...newInvoice,
          }),
    }),
    [invoice, newInvoice, invoiceNumber, invoiceIncrementMode, base_currency],
  );

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
        message: intl.get('quantity_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    // Transformes the values of the form to request.
    const form = {
      ...transformValueToRequest(values),
      delivered: submitPayload.deliver,
      from_estimate_id: estimateId,
    };

    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_invoice_has_been_created_successfully'
            : 'the_invoice_has_been_edited_successfully',
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
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    if (!isEmpty(invoice)) {
      editInvoiceMutate([invoice.id, form]).then(onSuccess).catch(onError);
    } else {
      createInvoiceMutate(form).then(onSuccess).catch(onError);
    }
  };

  // Create invoice form schema.
  const CreateInvoiceFormSchema = getCreateInvoiceFormSchema();

  // Edit invoice form schema.
  const EditInvoiceFormSchema = getEditInvoiceFormSchema();

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
          <InvoiceFormTopBar />
          <InvoiceFormHeader />
          <InvoiceItemsEntriesEditorField />
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
    invoiceIncrementMode: invoiceSettings?.autoIncrement,
  })),
  withCurrentOrganization(),
)(InvoiceForm);
