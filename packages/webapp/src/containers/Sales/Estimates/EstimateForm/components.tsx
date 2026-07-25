import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import { useEstimateIsForeignCustomer, useEstimateSubtotal } from './utils';
import type { EstimateFormValues } from './utils';
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
import { compose } from '@/utils';
import { transactionNumber } from '@/utils';
import { useEstimateFormContext } from './EstimateFormProvider';

type EstimateExchangeRateInputFieldRootProps = Omit<
  React.ComponentProps<typeof ExchangeRateInputGroup>,
  'name' | 'fromCurrency' | 'toCurrency'
>;

/**
 * Estimate exchange rate input field.
 * @returns {JSX.Element}
 */
function EstimateExchangeRateInputFieldRoot({
  ...props
}: EstimateExchangeRateInputFieldRootProps) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<EstimateFormValues>();
  const isForeignCustomer = useEstimateIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      name={'exchangeRate'}
      fromCurrency={values.currencyCode ?? ''}
      toCurrency={baseCurrency ?? ''}
      formGroupProps={{ label: ' ', inline: true }}
      withPopoverRecalcConfirm
      {...props}
    />
  );
}

/**
 * Renders the estimate exchange rate input field with exchange rate
 * with item entries price re-calc once exchange rate change.
 * @returns {JSX.Element}
 */
export const EstimateExchangeRateInputField = compose(
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
)(EstimateExchangeRateInputFieldRoot);

type EstimateProjectSelectButtonProps = { label?: string };

/**
 * Estimate project select.
 * @returns {JSX.Element}
 */
export function EstimateProjectSelectButton({
  label,
}: EstimateProjectSelectButtonProps) {
  return <Button text={label ?? intl.get('select_project')} />;
}

type EstimateIncrementSyncSettingsToFormProps = Record<string, never>;

/**
 * Syncs the estimate auto-increment settings to estimate form.
 * @returns {React.ReactNode}
 */
export const EstimateIncrementSyncSettingsToForm =
  ({}: EstimateIncrementSyncSettingsToFormProps) => {
    const { estimatesSettings } = useEstimateFormContext();
    const estimateNextNumber = estimatesSettings?.nextNumber as
      | number
      | undefined;
    const estimateNumberPrefix = estimatesSettings?.numberPrefix as
      | string
      | undefined;
    const estimateAutoIncrement = estimatesSettings?.autoIncrement as
      | boolean
      | undefined;
    const { setFieldValue } = useFormikContext<EstimateFormValues>();

    useUpdateEffect(() => {
      // Do not update if the estimate auto-increment mode is disabled.
      if (!estimateAutoIncrement) return;

      setFieldValue(
        'estimateNumber',
        transactionNumber(estimateNumberPrefix, estimateNextNumber),
      );
    }, [
      setFieldValue,
      estimateNumberPrefix,
      estimateNextNumber,
      estimateAutoIncrement,
    ]);

    return null;
  };

type EstimateSyncAutoExRateToFormProps = {
  openDialog: WithDialogActionsProps['openDialog'];
};

/**
 * Syncs the auto exchange rate to the estimate form and shows up popup to user
 * as an indication the entries rates have been changed.
 * @returns {React.ReactNode}
 */
export const EstimateSyncAutoExRateToForm = compose(withDialogActions)(({
  openDialog,
}: EstimateSyncAutoExRateToFormProps) => {
  const subtotal = useEstimateSubtotal();
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
});
