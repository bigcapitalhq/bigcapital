// @ts-nocheck
import React, { useMemo } from 'react';
import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as R from 'ramda';

import { FInputGroup, FormattedMessage as T } from '@/components';
import {
  FFormGroup,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from '@/components';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withSettings from '@/containers/Settings/withSettings';

/**
 * Payment receive number field.
 */
export const PaymentReceivePaymentNoField = R.compose(
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceiveAutoIncrement: paymentReceiveSettings?.autoIncrement,
  })),
  withDialogActions,
)(
  ({
    // #withDialogActions
    openDialog,

    // #withSettings
    paymentReceiveAutoIncrement,
  }) => {
    const { values, setFieldValue } = useFormikContext();

    // Handle click open payment receive number dialog.
    const handleClickOpenDialog = () => {
      openDialog('payment-receive-number-form');
    };
    // Handle payment number field blur.
    const handlePaymentNoBlur = (event) => {
      const newValue = event.target.value;

      // Show the confirmation dialog if the value has changed and auto-increment
      // mode is enabled.
      if (
        values.payment_receive_no !== newValue &&
        paymentReceiveAutoIncrement
      ) {
        openDialog('payment-receive-number-form', {
          initialFormValues: {
            onceManualNumber: newValue,
            incrementMode: 'manual-transaction',
          },
        });
      }
      // Setting the payment number to the form will be manually in case
      // auto-increment is disable.
      if (!paymentReceiveAutoIncrement) {
        setFieldValue('payment_receive_no', newValue);
        setFieldValue('payment_receive_no_manually', newValue);
      }
    };
    return (
      <FFormGroup
        name={'payment_receive_no'}
        label={<T id={'payment_received_no'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <ControlGroup fill={true}>
          <FInputGroup
            name={'payment_receive_no'}
            minimal={true}
            value={values.payment_receive_no}
            asyncControl={true}
            onBlur={handlePaymentNoBlur}
            onChange={() => {}}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleClickOpenDialog,
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
  },
);

PaymentReceivePaymentNoField.displayName = 'PaymentReceivePaymentNoField';
