// @ts-nocheck
import React from 'react';
import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as R from 'ramda';
import {
  FFormGroup,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  FormattedMessage as T,
  FInputGroup,
} from '@/components';

import withSettings from '@/containers/Settings/withSettings';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Receipt number field of receipt form.
 */
export const ReceiptFormReceiptNumberField = R.compose(
  withDialogActions,
  withSettings(({ receiptSettings }) => ({
    receiptAutoIncrement: receiptSettings?.autoIncrement,
  })),
)(
  ({
    // #withDialogActions
    openDialog,

    // #withSettings
    receiptAutoIncrement,
  }) => {
    const { values, setFieldValue } = useFormikContext();

    const handleReceiptNumberChange = () => {
      openDialog('receipt-number-form', {});
    };

    const handleReceiptNoBlur = (event) => {
      const newValue = event.target.value;

      // Show the confirmation dialog if the value has changed and auto-increment
      // mode is enabled.
      if (values.receipt_number !== newValue && receiptAutoIncrement) {
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
        setFieldValue('receipt_number', newValue);
        setFieldValue('receipt_number_manually', newValue);
      }
    };

    return (
      <FFormGroup
        name={'receipt_number'}
        label={<T id={'receipt'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'receipt_number'}
            minimal={true}
            value={values.receipt_number}
            asyncControl={true}
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
            inputProps={{
              leftIcon: <Icon icon={'date-range'} />,
            }}
          />
        </ControlGroup>
      </FFormGroup>
    );
  },
);

ReceiptFormReceiptNumberField.displayName = 'ReceiptFormReceiptNumberField';
