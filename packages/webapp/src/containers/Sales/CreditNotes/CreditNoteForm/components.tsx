// @ts-nocheck
import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import * as R from 'ramda';
import { ExchangeRateInputGroup } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import { useCreditNoteIsForeignCustomer } from './utils';
import withSettings from '@/containers/Settings/withSettings';
import { transactionNumber } from '@/utils';

/**
 * credit exchange rate input field.
 * @returns {JSX.Element}
 */
export function CreditNoteExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignCustomer = useCreditNoteIsForeignCustomer();

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
    if (!creditAutoIncrement) return;

    const creditNo = transactionNumber(creditNumberPrefix, creditNextNumber);
    setFieldValue('credit_note_number', creditNo);
  }, [setFieldValue, creditNumberPrefix, creditNextNumber]);

  return null;
});
