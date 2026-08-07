import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { ReceiptFormValues } from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FFormGroup,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  FormattedMessage as T,
  FInputGroup,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';
import { useReceiptFormContext } from './ReceiptFormProvider';

type ReceiptFormReceiptNumberFieldProps = {
  openDialog: WithDialogActionsProps['openDialog'];
};

/**
 * Receipt number field of receipt form.
 */
export const ReceiptFormReceiptNumberField = compose(withDialogActions)(({
  // #withDialogActions
  openDialog,
}: ReceiptFormReceiptNumberFieldProps) => {
  const { values, setFieldValue } = useFormikContext<ReceiptFormValues>();
  const { receiptSettings } = useReceiptFormContext();
  const receiptAutoIncrement = receiptSettings?.autoIncrement as
    | boolean
    | undefined;

  const handleReceiptNumberChange = () => {
    openDialog('receipt-number-form', {});
  };

  const handleReceiptNoBlur: React.FocusEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const newValue = event.target.value;

    // Show the confirmation dialog if the value has changed and auto-increment
    // mode is enabled.
    if (values.receiptNumber !== newValue && receiptAutoIncrement) {
      openDialog('receipt-number-form', {
        initialFormValues: {
          onceManualNumber: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
    // Setting the receipt number to the form will be manually in case
    // auto-increment is disable.
    if (!receiptAutoIncrement) {
      setFieldValue('receiptNumber', newValue);
      setFieldValue('receiptNumberManually', newValue);
    }
  };

  return (
    <FFormGroup
      name={'receiptNumber'}
      label={intl.get('receipt')}
      inline={true}
      labelInfo={<FieldRequiredHint />}
    >
      <ControlGroup fill={true}>
        <FInputGroup
          name={'receiptNumber'}
          value={values.receiptNumber}
          onBlur={handleReceiptNoBlur}
          onChange={() => {}}
        />
        <InputPrependButton
          buttonProps={{
            onClick: handleReceiptNumberChange,
            icon: <Icon icon={'settings-18'} />,
          }}
          tooltip={true}
          tooltipProps={{
            content: (
              <T id={'setting_your_auto_generated_payment_receive_number'} />
            ),
            position: Position.BOTTOM_LEFT,
          }}
        />
      </ControlGroup>
    </FFormGroup>
  );
});

ReceiptFormReceiptNumberField.displayName = 'ReceiptFormReceiptNumberField';
