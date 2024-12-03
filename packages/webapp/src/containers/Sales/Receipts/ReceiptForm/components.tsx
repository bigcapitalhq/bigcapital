// @ts-nocheck
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as R from 'ramda';

import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { useReceiptIsForeignCustomer, useReceiptTotal } from './utils';
import { useUpdateEffect } from '@/hooks';
import { transactionNumber } from '@/utils';
import withSettings from '@/containers/Settings/withSettings';
import {
  useSyncExRateToForm,
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
} from '@/containers/Entries/withExRateItemEntriesPriceRecalc';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

/**
 * Receipt exchange rate input field.
 * @returns {JSX.Element}
 */
function ReceiptExchangeRateInputFieldRoot({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const isForeignCustomer = useReceiptIsForeignCustomer();
  const { values } = useFormikContext();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      name={'exchange_rate'}
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      formGroupProps={{ label: ' ', inline: true }}
      withPopoverRecalcConfirm
      {...props}
    />
  );
}

export const ReceiptExchangeRateInputField = R.compose(
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
)(ReceiptExchangeRateInputFieldRoot);

/**
 * Receipt project select.
 * @returns {JSX.Element}
 */
export function ReceiptProjectSelectButton({ label }) {
  return <Button text={label ?? intl.get('select_project')} />;
}

/**
 * Syncs receipt auto-increment settings to form.
 * @return {React.ReactNode}
 */
export const ReceiptSyncIncrementSettingsToForm = R.compose(
  withSettings(({ receiptSettings }) => ({
    receiptAutoIncrement: receiptSettings?.autoIncrement,
    receiptNextNumber: receiptSettings?.nextNumber,
    receiptNumberPrefix: receiptSettings?.numberPrefix,
  })),
)(({ receiptAutoIncrement, receiptNextNumber, receiptNumberPrefix }) => {
  const { setFieldValue } = useFormikContext();

  useUpdateEffect(() => {
    // Do not update if the receipt auto-increment mode is disabled.
    if (!receiptAutoIncrement) return;

    setFieldValue(
      'receipt_number',
      transactionNumber(receiptNumberPrefix, receiptNextNumber),
    );
  }, [
    setFieldValue,
    receiptNumberPrefix,
    receiptAutoIncrement,
    receiptNextNumber,
  ]);

  return null;
});

/**
 * Syncs the auto exchange rate to the receipt form and shows up popup to user
 * as an indication the entries rates have been changed.
 * @returns {React.ReactNode}
 */
export const ReceiptSyncAutoExRateToForm = R.compose(withDialogActions)(
  ({
    // #withDialogActions
    openDialog,
  }) => {
    const total = useReceiptTotal();
    const timeout = useRef();

    useSyncExRateToForm({
      onSynced: () => {
        // If the total bigger then zero show alert to the user after adjusting entries.
        if (total > 0) {
          clearTimeout(timeout.current);
          timeout.current = setTimeout(() => {
            openDialog(DialogsName.InvoiceExchangeRateChangeNotice);
          }, 500);
        }
      },
    });
    return null;
  },
);
