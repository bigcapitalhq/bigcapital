import { Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import type { PaymentReceiveFormValues } from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FInputGroup,
  FormattedMessage as T,
  FFormGroup,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
} from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface PaymentReceivePaymentNoFieldProps
  extends Pick<WithDialogActionsProps, 'openDialog'> {}

/**
 * Payment receive number field.
 */
export const PaymentReceivePaymentNoField = compose(withDialogActions)(({
  openDialog,
}: PaymentReceivePaymentNoFieldProps) => {
  const { values, setFieldValue } =
    useFormikContext<PaymentReceiveFormValues>();
  const { paymentReceiveSettings } = usePaymentReceiveFormContext();
  const paymentReceiveAutoIncrement = paymentReceiveSettings?.autoIncrement as
    | boolean
    | undefined;

  const handleClickOpenDialog = () => {
    openDialog('payment-receive-number-form');
  };

  const handlePaymentNoBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (values.paymentReceiveNo !== newValue && paymentReceiveAutoIncrement) {
      openDialog('payment-receive-number-form', {
        initialFormValues: {
          onceManualNumber: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
    if (!paymentReceiveAutoIncrement) {
      setFieldValue('paymentReceiveNo', newValue);
      setFieldValue('paymentReceiveNoManually', newValue);
    }
  };
  return (
    <FFormGroup
      name={'paymentReceiveNo'}
      label={intl.get('payment_received_no')}
      inline={true}
      labelInfo={<FieldRequiredHint />}
    >
      <ControlGroup fill={true}>
        <FInputGroup
          name={'paymentReceiveNo'}
          fill={true}
          asyncControl={true}
          onBlur={handlePaymentNoBlur}
          fastField={true}
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
});

PaymentReceivePaymentNoField.displayName = 'PaymentReceivePaymentNoField';
