// @ts-nocheck
import { useEffect, useRef } from 'react';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import {
  useInvoiceEntriesOnExchangeRateChange,
  useInvoiceIsForeignCustomer,
  useInvoiceTotal,
} from './utils';
import withSettings from '@/containers/Settings/withSettings';
import { useUpdateEffect } from '@/hooks';
import { transactionNumber } from '@/utils';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

/**
 * Re-calculate the item entries prices based on the old exchange rate.
 * @param {InvoiceExchangeRateInputFieldRoot} Component
 * @returns {JSX.Element}
 */
const withExchangeRateItemEntriesPriceRecalc = (Component) => (props) => {
  const { setFieldValue } = useFormikContext();
  const composeChangeExRate = useInvoiceEntriesOnExchangeRateChange();

  return (
    <Component
      onRecalcConfirm={({ exchangeRate, oldExchangeRate }) => {
        setFieldValue(
          'entries',
          composeChangeExRate(oldExchangeRate, exchangeRate),
        );
      }}
      {...props}
    />
  );
};

/**
 * Invoice exchange rate input field.
 * @returns {JSX.Element}
 */
const InvoiceExchangeRateInputFieldRoot = ({ ...props }) => {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();
  const { isAutoExchangeRateLoading } = useInvoiceFormContext();

  const isForeignCustomer = useInvoiceIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      name={'exchange_rate'}
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      isLoading={isAutoExchangeRateLoading}
      {...props}
    />
  );
};

/**
 * Invoice exchange rate input field.
 * @returns {JSX.Element}
 */
export const InvoiceExchangeRateInputField = R.compose(
  withExchangeRateItemEntriesPriceRecalc,
)(InvoiceExchangeRateInputFieldRoot);

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

/**
 * Syncs the fetched real-time exchange rate to the form.
 * @returns {JSX.Element}
 */
export const InvoiceExchangeRateSync = R.compose(withDialogActions)(
  ({ openDialog }) => {
    const { setFieldValue, values } = useFormikContext();
    const { autoExRateCurrency, autoExchangeRate } = useInvoiceFormContext();
    const composeEntriesOnExChange = useInvoiceEntriesOnExchangeRateChange();

    const total = useInvoiceTotal();
    const timeout = useRef();

    // Sync the fetched real-time exchanage rate to the form.
    useEffect(() => {
      if (autoExchangeRate?.exchange_rate && autoExRateCurrency) {
        setFieldValue('exchange_rate', autoExchangeRate?.exchange_rate + '');
        setFieldValue(
          'entries',
          composeEntriesOnExChange(
            values.exchange_rate,
            autoExchangeRate?.exchange_rate,
          ),
        );
        // If the total bigger then zero show alert to the user after adjusting entries.
        if (total > 0) {
          clearTimeout(timeout.current);
          timeout.current = setTimeout(() => {
            openDialog(DialogsName.InvoiceExchangeRateChange);
          }, 500);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoExchangeRate?.exchange_rate, autoExRateCurrency]);

    return null;
  },
);
