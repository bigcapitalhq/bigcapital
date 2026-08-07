import { InputGroup, Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FFormGroup, Icon, InputPrependButton } from '@/components';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useUpdateEffect } from '@/hooks';
import { useSettingCashFlow } from '@/hooks/query';
import { transactionNumber } from '@/utils';
import { compose } from '@/utils';

/**
 * Minimal slice of the cashflow transaction form values used by the shared
 * transaction-number field components. Both `MoneyInFormValues` and the
 * forthcoming `MoneyOutFormValues` satisfy this shape.
 */
interface CashflowTransactionNoFormValues {
  transactionNumber: string;
  transactionNumberManually?: string;
}

/**
 * Syncs cashflow auto-increment settings to the form once update.
 */
export const MoneyInOutSyncIncrementSettingsToForm = compose(withDialogActions)(
  () => {
    const { setFieldValue } =
      useFormikContext<CashflowTransactionNoFormValues>();
    const { data: cashflowSetting } = useSettingCashFlow();

    const transactionAutoIncrement = cashflowSetting?.autoIncrement as
      | boolean
      | undefined;
    const transactionNextNumber = cashflowSetting?.nextNumber as
      | string
      | number
      | undefined;
    const transactionNumberPrefix = cashflowSetting?.numberPrefix as
      | string
      | undefined;

    useUpdateEffect(() => {
      // Do not update if the invoice auto-increment is disabled.
      if (!transactionAutoIncrement) return;

      const newTransactionNumber = transactionNumber(
        transactionNumberPrefix,
        transactionNextNumber,
      );
      setFieldValue('transactionNumber', newTransactionNumber);
    }, [setFieldValue, transactionNumberPrefix, transactionNextNumber]);

    return null;
  },
);

interface MoneyInOutTransactionNoFieldProps
  extends Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Money In/Out transaction number field.
 */
export const MoneyInOutTransactionNoField = compose(withDialogActions)(({
  openDialog,
}: MoneyInOutTransactionNoFieldProps) => {
  const { values, setFieldValue } =
    useFormikContext<CashflowTransactionNoFormValues>();
  const { data: cashflowSetting } = useSettingCashFlow();

  const transactionAutoIncrement = cashflowSetting?.autoIncrement as
    | boolean
    | undefined;

  // Handle tranaction number changing.
  const handleTransactionNumberChange = () => {
    openDialog('transaction-number-form');
  };
  // Handle transaction no. field blur.
  const handleTransactionNoBlur = (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;

    if (values.transactionNumber !== newValue && transactionAutoIncrement) {
      openDialog('transaction-number-form', {
        initialFormValues: {
          onceManualNumber: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
    if (!transactionAutoIncrement) {
      setFieldValue('transactionNumber', values.transactionNumber);
      setFieldValue('transactionNumberManually', values.transactionNumber);
    }
  };

  // Spread props onto InputGroup to bypass the strict excess-property check
  // that fires when typing the JSX literal directly (InputGroup's class-component
  // typing is incompatible with the project's @types/react for inline literals).
  const inputGroupProps = {
    minimal: true,
    value: values.transactionNumber,
    asyncControl: true,
    onBlur: handleTransactionNoBlur,
  };

  return (
    <FFormGroup
      name={'transactionNumber'}
      label={intl.get('transaction_number')}
    >
      <ControlGroup fill={true}>
        <InputGroup {...inputGroupProps} />
        <InputPrependButton
          buttonProps={{
            onClick: handleTransactionNumberChange,
            icon: <Icon icon={'settings-18'} />,
          }}
          tooltip={true}
          tooltipProps={{
            content: (
              <T
                id={'cash_flow.setting_your_auto_generated_transaction_number'}
              />
            ),
            position: Position.BOTTOM_LEFT,
          }}
        />
      </ControlGroup>
    </FFormGroup>
  );
});
