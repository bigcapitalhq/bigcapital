import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Formik, Form, FormikHelpers } from 'formik';
import { sumBy, isEmpty, defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import {
  InvoiceExchangeRateSync,
  InvoiceNoSyncSettingsToForm,
} from './components';
import { InvoiceFloatingActions } from './InvoiceFloatingActions';
import {
  getCreateInvoiceFormSchema,
  getEditInvoiceFormSchema,
} from './InvoiceForm.schema';
import { InvoiceFormActions } from './InvoiceFormActions';
import { InvoiceFormDialogs } from './InvoiceFormDialogs';
import { InvoiceFormFooter } from './InvoiceFormFooter';
import { InvoiceFormHeader } from './InvoiceFormHeader';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { InvoiceFormTopBar } from './InvoiceFormTopBar';
import { InvoiceItemsEntriesEditorField } from './InvoiceItemsEntriesEditorField';
import {
  transformToEditForm,
  defaultInvoice,
  transformErrors,
  transformValueToRequest,
  resetFormState,
} from './utils';
import type { InvoiceFormValues } from './utils';
import { AppToaster, Box } from '@/components';
import { PageForm } from '@/components/PageForm';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { compose, orderingLinesIndexes, transactionNumber } from '@/utils';

type InvoiceFormRootProps = Record<string, never>;

/**
 * Invoice form.
 */
function InvoiceFormRoot({}: InvoiceFormRootProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

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
    invoiceSettings,
  } = useInvoiceFormContext();

  const invoiceNextNumber = invoiceSettings?.nextNumber as number | undefined;
  const invoiceNumberPrefix = invoiceSettings?.numberPrefix as
    | string
    | undefined;
  const invoiceAutoIncrementMode = invoiceSettings?.autoIncrement as
    | boolean
    | undefined;
  const invoiceCustomerNotes = invoiceSettings?.customerNotes as
    | string
    | undefined;
  const invoiceTermsConditions = invoiceSettings?.termsConditions as
    | string
    | undefined;

  // Invoice number.
  const invoiceNumber = transactionNumber(
    invoiceNumberPrefix,
    invoiceNextNumber,
  );
  // Form initial values.
  const isEditMode = !isEmpty(invoice) && !!invoice;
  const initialValues: InvoiceFormValues = isEditMode
    ? transformToEditForm(invoice)
    : {
        ...defaultInvoice,
        // If the auto-increment mode is enabled, take the next invoice
        // number from the settings.
        ...(invoiceAutoIncrementMode && {
          invoiceNo: invoiceNumber,
        }),
        entries: orderingLinesIndexes(defaultInvoice.entries),
        currencyCode: baseCurrency ?? '',
        invoiceMessage: defaultTo(invoiceCustomerNotes, ''),
        termsConditions: defaultTo(invoiceTermsConditions, ''),
        pdfTemplateId: saleInvoiceState?.defaultTemplateId ?? '',
        ...(Array.isArray(newInvoice) ? {} : newInvoice),
      };
  // Handles form submit.
  const handleSubmit = (
    values: InvoiceFormValues,
    { setSubmitting, setErrors, resetForm }: FormikHelpers<InvoiceFormValues>,
  ) => {
    setSubmitting(true);

    const entries = values.entries.filter(
      (item) => item.itemId && item.quantity,
    );
    const totalQuantity = sumBy(entries, (entry) =>
      parseInt(String(entry.quantity)),
    );

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
      delivered: submitPayload?.deliver ?? false,
      fromEstimateId: estimateId ? Number(estimateId) : undefined,
    };
    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isNewMode
            ? 'the_invoice_has_been_created_successfully'
            : 'the_invoice_has_been_edited_successfully',
          { number: values.invoiceNo },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload?.redirect) {
        history.push('/invoices');
      }
      if (submitPayload?.resetForm) {
        resetFormState({ resetForm, initialValues, values });
      }
    };
    // Handle the request error.
    const onError = ({
      data: { errors },
    }: {
      data: { errors: Array<{ type: string }> };
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };
    if (isEditMode && invoice) {
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
    <Formik<InvoiceFormValues>
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

export const InvoiceForm = compose(withDashboardActions)(InvoiceFormRoot);
