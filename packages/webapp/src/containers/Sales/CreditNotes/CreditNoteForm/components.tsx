import { useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';
import {
  useCreditNoteIsForeignCustomer,
  useCreditNoteSubtotal,
  type CreditNoteFormValues,
} from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { ExchangeRateInputGroup } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import {
  useSyncExRateToForm,
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
} from '@/containers/Entries/withExRateItemEntriesPriceRecalc';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { transactionNumber, compose } from '@/utils';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';

type CreditNoteExchangeRateInputFieldRootProps = React.ComponentProps<
  typeof ExchangeRateInputGroup
>;

/**
 * Credit note exchange rate input field.
 */
const CreditNoteExchangeRateInputFieldRoot = ({
  ...props
}: CreditNoteExchangeRateInputFieldRootProps) => {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<CreditNoteFormValues>();
  const isForeignCustomer = useCreditNoteIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      {...props}
      name={'exchangeRate'}
      fromCurrency={values.currencyCode}
      toCurrency={baseCurrency ?? ''}
      formGroupProps={{ label: ' ', inline: true }}
      withPopoverRecalcConfirm
    />
  );
};

export const CreditNoteExchangeRateInputField = compose(
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
)(CreditNoteExchangeRateInputFieldRoot);

type CreditNoteSyncIncrementSettingsProps = Record<string, never>;

/**
 * Syncs credit note auto-increment settings to form.
 */
export const CreditNoteSyncIncrementSettingsToForm =
  ({}: CreditNoteSyncIncrementSettingsProps) => {
    const { creditNoteSettings } = useCreditNoteFormContext();
    const creditAutoIncrement = creditNoteSettings?.autoIncrement as
      | boolean
      | undefined;
    const creditNextNumber = creditNoteSettings?.nextNumber as
      | number
      | undefined;
    const creditNumberPrefix = creditNoteSettings?.numberPrefix as
      | string
      | undefined;
    const { setFieldValue } = useFormikContext<CreditNoteFormValues>();

    useEffect(() => {
      // Do not update if the credit note auto-increment mode is disabled.
      if (!creditAutoIncrement) return;

      setFieldValue(
        'creditNoteNumber',
        transactionNumber(creditNumberPrefix, creditNextNumber),
      );
    }, [
      setFieldValue,
      creditNumberPrefix,
      creditNextNumber,
      creditAutoIncrement,
    ]);

    return null;
  };

type CreditNoteExchangeRateSyncProps = {
  openDialog: WithDialogActionsProps['openDialog'];
};

/**
 * Syncs the realtime exchange rate to the credit note form and shows up popup to the user
 * as an indication the entries rates have been re-calculated.
 */
export const CreditNoteExchangeRateSync = compose(withDialogActions)(({
  openDialog,
}: CreditNoteExchangeRateSyncProps) => {
  const subtotal = useCreditNoteSubtotal();
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useSyncExRateToForm({
    onSynced: () => {
      // If the total bigger then zero show alert to the user after adjusting entries.
      if (subtotal > 0) {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          openDialog(DialogsName.InvoiceExchangeRateChangeNotice);
        }, 500);
      }
    },
  });
  return null;
});
