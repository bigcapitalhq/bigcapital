import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { useRef } from 'react';
import intl from 'react-intl-universal';
import { useInvoiceIsForeignCustomer, useInvoiceTotal } from './utils';
import type { InvoiceFormValues } from './utils';
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
import { useInvoiceFormContext } from './InvoiceFormProvider';

type InvoiceExchangeRateInputFieldRootProps = React.ComponentProps<
  typeof ExchangeRateInputGroup
>;

/**
 * Invoice exchange rate input field.
 * @returns {JSX.Element}
 */
const InvoiceExchangeRateInputFieldRoot = ({
  ...props
}: InvoiceExchangeRateInputFieldRootProps) => {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<InvoiceFormValues>();
  const isForeignCustomer = useInvoiceIsForeignCustomer();

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

/**
 * Invoice exchange rate input field.
 * @returns {JSX.Element}
 */
export const InvoiceExchangeRateInputField = compose(
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
)(InvoiceExchangeRateInputFieldRoot);

/**
 * Invoice project select.
 * @returns {JSX.Element}
 */
export function InvoiceProjectSelectButton({ label }: { label?: string }) {
  return <Button text={label ?? intl.get('select_project')} />;
}

/**
 * Syncs invoice auto-increment settings to invoice form once update.
 */
export const InvoiceNoSyncSettingsToForm = () => {
  const { invoiceSettings } = useInvoiceFormContext();
  const invoiceAutoIncrement = invoiceSettings?.autoIncrement as
    | boolean
    | undefined;
  const invoiceNextNumber = invoiceSettings?.nextNumber as number | undefined;
  const invoiceNumberPrefix = invoiceSettings?.numberPrefix as
    | string
    | undefined;
  const { setFieldValue } = useFormikContext<InvoiceFormValues>();

  useUpdateEffect(() => {
    // Do not update if the invoice auto-increment mode is disabled.
    if (!invoiceAutoIncrement) return;

    setFieldValue(
      'invoiceNo',
      transactionNumber(invoiceNumberPrefix, invoiceNextNumber),
    );
  }, [setFieldValue, invoiceNumberPrefix, invoiceNextNumber]);

  return null;
};

type InvoiceExchangeRateSyncProps = {
  openDialog: WithDialogActionsProps['openDialog'];
};

/**
 * Syncs the realtime exchange rate to the invoice form and shows up popup to the user
 * as an indication the entries rates have been re-calculated.
 * @returns {React.ReactNode}
 */
export const InvoiceExchangeRateSync = compose(withDialogActions)(({
  openDialog,
}: InvoiceExchangeRateSyncProps) => {
  const total = useInvoiceTotal();
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
