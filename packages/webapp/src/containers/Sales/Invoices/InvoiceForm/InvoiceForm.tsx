// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Formik, Form } from 'formik';
import { Intent } from '@blueprintjs/core';
import { sumBy, isEmpty, defaultTo } from 'lodash';
import { useHistory } from 'react-router-dom';
import { css } from '@emotion/css';
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
import withSettings from '@/containers/Settings/withSettings';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { AppToaster, Box } from '@/components';
import { compose, orderingLinesIndexes, transactionNumber } from '@/utils';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { InvoiceFormActions } from './InvoiceFormActions';
import {
  transformToEditForm,
  defaultInvoice,
  transformErrors,
  transformValueToRequest,
  resetFormState,
} from './utils';
import {
  InvoiceExchangeRateSync,
  InvoiceNoSyncSettingsToForm,
} from './components';
import { PageForm } from '@/components/PageForm';

/**
 * Invoice form.
 */
function InvoiceFormRoot({
  // #withSettings
  invoiceNextNumber,
  invoiceNumberPrefix,
  invoiceAutoIncrementMode,
  invoiceCustomerNotes,
  invoiceTermsConditions,

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
    saleInvoiceState,
  } = useInvoiceFormContext();

  // Invoice number.
  const invoiceNumber = transactionNumber(
    invoiceNumberPrefix,
    invoiceNextNumber,
  );
  // Form initial values.
  const initialValues = {
    ...(!isEmpty(invoice)
      ? { ...transformToEditForm(invoice) }
      : {
          ...defaultInvoice,
          // If the auto-increment mode is enabled, take the next invoice
          // number from the settings.
          ...(invoiceAutoIncrementMode && {
            invoice_no: invoiceNumber,
          }),
          entries: orderingLinesIndexes(defaultInvoice.entries),
          currency_code: base_currency,
          invoice_message: defaultTo(invoiceCustomerNotes, ''),
          terms_conditions: defaultTo(invoiceTermsConditions, ''),
          pdf_template_id: saleInvoiceState?.defaultTemplateId,
          ...newInvoice,
        }),
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
        resetFormState({ resetForm, initialValues, values });
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
    <Formik
      validationSchema={
        isNewMode ? CreateInvoiceFormSchema : EditInvoiceFormSchema
      }
      initialValues={initialValues}
      onSubmit={handleSubmit}
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
            <InvoiceFormTopBar />
            <InvoiceFormHeader />

            <Box p="18px 32px 0">
              <InvoiceFormActions />
              <InvoiceItemsEntriesEditorField />
            </Box>
            <InvoiceFormFooter />
          </PageForm.Body>

          <PageForm.Footer>
            <InvoiceFloatingActions />
          </PageForm.Footer>

          {/*---------- Dialogs ----------*/}
          <InvoiceFormDialogs />

          {/*---------- Effects ----------*/}
          <InvoiceNoSyncSettingsToForm />
          <InvoiceExchangeRateSync />
        </PageForm>
      </Form>
    </Formik>
  );
}

export const InvoiceForm = compose(
  withDashboardActions,
  withSettings(({ invoiceSettings }) => ({
    invoiceNextNumber: invoiceSettings?.nextNumber,
    invoiceNumberPrefix: invoiceSettings?.numberPrefix,
    invoiceAutoIncrementMode: invoiceSettings?.autoIncrement,
    invoiceCustomerNotes: invoiceSettings?.customerNotes,
    invoiceTermsConditions: invoiceSettings?.termsConditions,
  })),
  withCurrentOrganization(),
)(InvoiceFormRoot);
