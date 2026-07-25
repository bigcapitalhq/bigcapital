import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import { useReceiptIsForeignCustomer, useReceiptTotal } from './utils';
import type { ReceiptFormValues } from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { ExchangeRateInputGroup } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import {
  useSyncExRateToForm,
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
} from '@/containers/Entries/withExRateItemEntriesPriceRecalc';
import { useUpdateEffect } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { transactionNumber } from '@/utils';
import { compose } from '@/utils';
import { useReceiptFormContext } from './ReceiptFormProvider';

type ReceiptExchangeRateInputFieldRootProps = React.ComponentProps<
  typeof ExchangeRateInputGroup
>;

/**
 * Receipt exchange rate input field.
 * @returns {JSX.Element}
 */
const ReceiptExchangeRateInputFieldRoot = ({
  ...props
}: ReceiptExchangeRateInputFieldRootProps) => {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<ReceiptFormValues>();
  const isForeignCustomer = useReceiptIsForeignCustomer();

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

export const ReceiptExchangeRateInputField = compose(
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
)(ReceiptExchangeRateInputFieldRoot);

/**
 * Receipt project select.
 * @returns {JSX.Element}
 */
export function ReceiptProjectSelectButton({ label }: { label?: string }) {
  return <Button text={label ?? intl.get('select_project')} />;
}

type ReceiptSyncIncrementSettingsToFormProps = Record<string, never>;

/**
 * Syncs receipt auto-increment settings to form.
 * @return {React.ReactNode}
 */
export const ReceiptSyncIncrementSettingsToForm =
  ({}: ReceiptSyncIncrementSettingsToFormProps) => {
    const { receiptSettings } = useReceiptFormContext();
    const receiptAutoIncrement = receiptSettings?.autoIncrement as
      | boolean
      | undefined;
    const receiptNextNumber = receiptSettings?.nextNumber as number | undefined;
    const receiptNumberPrefix = receiptSettings?.numberPrefix as
      | string
      | undefined;
    const { setFieldValue } = useFormikContext<ReceiptFormValues>();

    useUpdateEffect(() => {
      // Do not update if the receipt auto-increment mode is disabled.
      if (!receiptAutoIncrement) return;

      setFieldValue(
        'receiptNumber',
        transactionNumber(receiptNumberPrefix, receiptNextNumber),
      );
    }, [
      setFieldValue,
      receiptNumberPrefix,
      receiptAutoIncrement,
      receiptNextNumber,
    ]);

    return null;
  };

type ReceiptSyncAutoExRateToFormProps = {
  openDialog: WithDialogActionsProps['openDialog'];
};

/**
 * Syncs the auto exchange rate to the receipt form and shows up popup to user
 * as an indication the entries rates have been changed.
 * @returns {React.ReactNode}
 */
export const ReceiptSyncAutoExRateToForm = compose(withDialogActions)(({
  openDialog,
}: ReceiptSyncAutoExRateToFormProps) => {
  const total = useReceiptTotal();
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useSyncExRateToForm({
    onSynced: () => {
      // If the total bigger then zero show alert to the user after adjusting entries.
      if (total > 0) {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          openDialog(DialogsName.InvoiceExchangeRateChangeNotice);
        }, 500);
      }
    },
  });
  return null;
});
