// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { useFormikContext } from 'formik';
import * as R from 'ramda';
import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { useCreditNoteIsForeignCustomer, useCreditNoteSubtotal } from './utils';
import withSettings from '@/containers/Settings/withSettings';
import { transactionNumber } from '@/utils';
import {
  useSyncExRateToForm,
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
} from '@/containers/Entries/withExRateItemEntriesPriceRecalc';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

/**
 * Credit note exchange rate input field.
 * @returns {JSX.Element}
 */
function CreditNoteExchangeRateInputFieldRoot({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();
  const isForeignCustomer = useCreditNoteIsForeignCustomer();

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

export const CreditNoteExchangeRateInputField = R.compose(
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
)(CreditNoteExchangeRateInputFieldRoot);

/**
 * Syncs credit note auto-increment settings to form.
 * @return {React.ReactNode}
 */
export const CreditNoteSyncIncrementSettingsToForm = R.compose(
  withSettings(({ creditNoteSettings }) => ({
    creditAutoIncrement: creditNoteSettings?.autoIncrement,
    creditNextNumber: creditNoteSettings?.nextNumber,
    creditNumberPrefix: creditNoteSettings?.numberPrefix,
  })),
)(({ creditAutoIncrement, creditNextNumber, creditNumberPrefix }) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    // Do not update if the credit note auto-increment mode is disabled.
    if (!creditAutoIncrement) return;

    setFieldValue(
      'credit_note_number',
      transactionNumber(creditNumberPrefix, creditNextNumber),
    );
  }, [setFieldValue, creditNumberPrefix, creditNextNumber]);

  return null;
});

/**
 * Syncs the realtime exchange rate to the credit note form and shows up popup to the user
 * as an indication the entries rates have been re-calculated.
 * @returns {React.ReactNode}
 */
export const CreditNoteExchangeRateSync = R.compose(withDialogActions)(
  ({ openDialog }) => {
    const subtotal = useCreditNoteSubtotal();
    const timeout = useRef();

    useSyncExRateToForm({
      onSynced: () => {
        // If the total bigger then zero show alert to the user after adjusting entries.
        if (subtotal > 0) {
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
