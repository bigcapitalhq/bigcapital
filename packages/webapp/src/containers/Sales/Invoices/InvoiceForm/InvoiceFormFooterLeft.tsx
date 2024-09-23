// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import {
  FFormGroup,
  FEditableText,
  FormattedMessage as T,
  Box,
  Group,
  Stack,
} from '@/components';
import { VisaIcon } from '@/icons/Visa';
import { MastercardIcon } from '@/icons/Mastercard';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { PaymentOptionsButtonPopver } from '@/containers/PaymentMethods/SelectPaymentMethodPopover';

export function InvoiceFormFooterLeft() {
  const { paymentServices } = useInvoiceFormContext();
  const history = useHistory();

  const handleSetupPaymentsClick = () => {
    history.push('/preferences/payment-methods');
  };

  return (
    <Stack spacing={20}>
      {/* --------- Invoice message --------- */}
      <InvoiceMsgFormGroup
        name={'invoice_message'}
        label={<T id={'invoice_message'} />}
      >
        <FEditableText
          name={'invoice_message'}
          placeholder={intl.get('invoice_form.invoice_message.placeholder')}
          fastField
          multiline
        />
      </InvoiceMsgFormGroup>

      {/* --------- Terms and conditions --------- */}
      <TermsConditsFormGroup
        label={<T id={'invoice_form.label.terms_conditions'} />}
        name={'terms_conditions'}
      >
        <FEditableText
          name={'terms_conditions'}
          placeholder={intl.get(
            'invoice_form.terms_and_conditions.placeholder',
          )}
          multiline
          fastField
        />
      </TermsConditsFormGroup>

      {/* --------- Payment Options --------- */}
      <PaymentOptionsFormGroup
        label={'Payment Options'}
        name={'payment_method_id'}
      >
        <PaymentOptionsText>
          Select an online payment option to get paid faster{' '}
          <Group spacing={6} style={{ marginLeft: 8 }}>
            <VisaIcon />
            <MastercardIcon />
          </Group>
          {isEmpty(paymentServices) ? (
            <PaymentOptionsButton
              intent={Intent.PRIMARY}
              onClick={handleSetupPaymentsClick}
              small
              minimal
            >
              Setup payment gateways
            </PaymentOptionsButton>
          ) : (
            <PaymentOptionsButtonPopver paymentMethods={paymentServices}>
              <PaymentOptionsButton intent={Intent.PRIMARY} small minimal>
                Payment Options
              </PaymentOptionsButton>
            </PaymentOptionsButtonPopver>
          )}
        </PaymentOptionsText>
      </PaymentOptionsFormGroup>
    </Stack>
  );
}

const InvoiceMsgFormGroup = styled(FFormGroup)`
  &.bp4-form-group {
    .bp4-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp4-form-content {
      margin-left: 10px;
    }
  }
`;

const TermsConditsFormGroup = styled(FFormGroup)`
  &.bp4-form-group {
    .bp4-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp4-form-content {
      margin-left: 10px;
    }
  }
`;

const PaymentOptionsFormGroup = styled(FFormGroup)`
  &.bp4-form-group {
    .bp4-label {
      font-weight: 500;
      font-size: 12px;
      margin-bottom: 10px;
    }
  }
`;

const PaymentOptionsText = styled(Box)`
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  color: #5f6b7c;
`;

const PaymentOptionsButton = styled(Button)`
  font-size: 13px;
  margin-left: 4px;

  &.bp4-minimal.bp4-intent-primary {
    color: #0052cc;
  }
`;
