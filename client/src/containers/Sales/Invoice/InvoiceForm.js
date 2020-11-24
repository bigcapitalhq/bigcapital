import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { pick, sumBy, omit } from 'lodash';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import {
  CreateInvoiceFormSchema,
  EditInvoiceFormSchema,
} from './InvoiceForm.schema';

import InvoiceFormHeader from './InvoiceFormHeader';
import EditableItemsEntriesTable from 'containers/Entries/EditableItemsEntriesTable';
import InvoiceFloatingActions from './InvoiceFloatingActions';
import InvoiceFormFooter from './InvoiceFormFooter';
import InvoiceNumberChangeWatcher from './InvoiceNumberChangeWatcher';

import withInvoiceActions from './withInvoiceActions';
import withInvoiceDetail from './withInvoiceDetail';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withMediaActions from 'containers/Media/withMediaActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster } from 'components';

import useMedia from 'hooks/useMedia';
import { ERROR } from 'common/errors';

import {
  compose,
  repeatValue,
  defaultToTransform,
  orderingLinesIndexes,
} from 'utils';
import { useHistory } from 'react-router-dom';

const MIN_LINES_NUMBER = 4;

const defaultInvoice = {
  index: 0,
  item_id: '',
  rate: '',
  discount: 0,
  quantity: '',
  description: '',
};

const defaultInitialValues = {
  customer_id: '',
  invoice_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment(new Date()).format('YYYY-MM-DD'),
  status: 'SEND',
  invoice_no: '',
  reference_no: '',
  invoice_message: '',
  terms_conditions: '',
  entries: [...repeatValue(defaultInvoice, MIN_LINES_NUMBER)],
};

/**
 * Invoice form.
 */
function InvoiceForm({
  // #WithMedia
  requestSubmitMedia,
  requestDeleteMedia,

  // #WithInvoiceActions
  requestSubmitInvoice,
  requestEditInvoice,

  // #withDashboard
  changePageTitle,
  changePageSubtitle,

  // #withSettings
  invoiceNextNumber,
  invoiceNumberPrefix,

  // #withInvoiceDetail
  invoice,

  // #own Props
  invoiceId,
  onCancelForm,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();

  const [submitPayload, setSubmitPayload] = useState({});
  const isNewMode = !invoiceId;

  const invoiceNumber = invoiceNumberPrefix
    ? `${invoiceNumberPrefix}-${invoiceNextNumber}`
    : invoiceNextNumber;

  useEffect(() => {
    const transactionNumber = invoice ? invoice.invoice_no : invoiceNumber;

    if (invoice && invoice.id) {
      changePageTitle(formatMessage({ id: 'edit_invoice' }));
    } else {
      changePageTitle(formatMessage({ id: 'new_invoice' }));
    }
    changePageSubtitle(
      defaultToTransform(transactionNumber, `No. ${transactionNumber}`, ''),
    );
  }, [
    changePageTitle,
    changePageSubtitle,
    invoice,
    invoiceNumber,
    formatMessage,
  ]);

  const initialValues = useMemo(
    () => ({
      ...(invoice
        ? {
            ...pick(invoice, Object.keys(defaultInitialValues)),
            entries: [
              ...invoice.entries.map((invoice) => ({
                ...pick(invoice, Object.keys(defaultInvoice)),
              })),
              ...repeatValue(
                defaultInvoice,
                Math.max(MIN_LINES_NUMBER - invoice.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            invoice_no: invoiceNumber,
            entries: orderingLinesIndexes(defaultInitialValues.entries),
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
      entries: entries.map((entry) => ({ ...omit(entry, ['total']) })),
    };
    // Handle the request success.
    const onSuccess = () => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_invocie_has_been_successfully_created'
              : 'the_invoice_has_been_successfully_edited',
          },
          { number: values.invoice_no },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      resetForm();

      if (submitPayload.redirect) {
        history.push('/invoices');
      }
    };
    // Handle the request error.
    const onError = (errors) => {
      if (errors) {
        handleErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };

    if (invoice && invoice.id) {
      requestEditInvoice(invoice.id, form).then(onSuccess).catch(onError);
    } else {
      requestSubmitInvoice(form).then(onSuccess).catch(onError);
    }
  };

  const handleCancelClick = useCallback(
    (payload) => {
      history.goBack();
    },
    [history],
  );

  const handleSubmitClick = useCallback(() => {
    setSubmitPayload({ redirect: true });
  }, [setSubmitPayload]);

  const handleSubmitAndNewClick = useCallback(() => {
    setSubmitPayload({ redirect: false });
  }, [setSubmitPayload]);

  const handleInvoiceNumberChanged = useCallback(
    (invoiceNumber) => {
      changePageSubtitle(
        defaultToTransform(invoiceNumber, `No. ${invoiceNumber}`, ''),
      );
    },
    [changePageSubtitle],
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_INVOICE)}>
      <Formik
        validationSchema={
          isNewMode ? CreateInvoiceFormSchema : EditInvoiceFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InvoiceFormHeader
              onInvoiceNumberChanged={handleInvoiceNumberChanged}
            />
            <InvoiceNumberChangeWatcher invoiceNumber={invoiceNumber} />
            <EditableItemsEntriesTable
              defaultEntry={defaultInvoice}
              filterSellableItems={true}
            />
            <InvoiceFormFooter />
            <InvoiceFloatingActions
              isSubmitting={isSubmitting}
              invoice={invoice}
              onCancelClick={handleCancelClick}
              onSubmitClick={handleSubmitClick}
              onSubmitAndNewClick={handleSubmitAndNewClick}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default compose(
  withInvoiceActions,
  withDashboardActions,
  withMediaActions,
  withInvoiceDetail(),

  withSettings(({ invoiceSettings }) => ({
    invoiceNextNumber: invoiceSettings?.nextNumber,
    invoiceNumberPrefix: invoiceSettings?.numberPrefix,
  })),
)(InvoiceForm);
