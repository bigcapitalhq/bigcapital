// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { useInvoiceIsForeignCustomer } from './utils';
import withSettings from '@/containers/Settings/withSettings';
import { useUpdateEffect } from '@/hooks';
import { transactionNumber } from '@/utils';

/**
 * Invoice exchange rate input field.
 * @returns {JSX.Element}
 */
export function InvoiceExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignCustomer = useInvoiceIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      {...props}
    />
  );
}

/**
 * Invoice project select.
 * @returns {JSX.Element}
 */
export function InvoiceProjectSelectButton({ label }) {
  return <Button text={label ?? intl.get('select_project')} />;
}

/**
 * Syncs invoice auto-increment settings to invoice form once update.
 */
export const InvoiceNoSyncSettingsToForm = R.compose(
  withSettings(({ invoiceSettings }) => ({
    invoiceAutoIncrement: invoiceSettings?.autoIncrement,
    invoiceNextNumber: invoiceSettings?.nextNumber,
    invoiceNumberPrefix: invoiceSettings?.numberPrefix,
  })),
)(({ invoiceAutoIncrement, invoiceNextNumber, invoiceNumberPrefix }) => {
  const { setFieldValue } = useFormikContext();

  useUpdateEffect(() => {
    // Do not update if the invoice auto-increment mode is disabled.
    if (!invoiceAutoIncrement) return null;

    setFieldValue(
      'invoice_no',
      transactionNumber(invoiceNumberPrefix, invoiceNextNumber),
    );
  }, [setFieldValue, invoiceNumberPrefix, invoiceNextNumber]);

  return null;
});
