import { Button, ControlGroup, Position } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';
import { useFormikContext } from 'formik';
import { isEmpty, toSafeInteger } from 'lodash';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { PaymentMadeExchangeRateInputField } from './components';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import {
  accountsFieldShouldUpdate,
  vendorsFieldShouldUpdate,
  amountPaymentEntries,
  fullAmountPaymentEntries,
  type PaymentMadeFormValues,
} from './utils';
import type { Theme } from '@xstyled/emotion';
import {
  FFormGroup,
  AccountsSelect,
  FieldRequiredHint,
  InputPrependText,
  Money,
  Hint,
  Icon,
  VendorDrawerLink,
} from '@/components';
import {
  FDateInput,
  FInputGroup,
  FMoneyInputGroup,
  Stack,
  FormattedMessage as T,
  VendorsSelect,
} from '@/components';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { safeSumBy } from '@/utils';

type VendorContact = {
  id: string | number;
  currencyCode?: string;
};

const getFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 450px;
    }
    .${theme.bpPrefix}-label {
      min-width: 150px;
      font-weight: 500;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;

/**
 * Payment made form header fields.
 */
function PaymentMadeFormHeaderFieldsInner() {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const {
    values: { entries, currencyCode },
    setFieldValue,
  } = useFormikContext<PaymentMadeFormValues>();

  const theme = useTheme() as Theme;
  const dateInputFormatter = useDateInputFormatter();
  const fieldsClassName = getFieldsStyle(theme);

  const { accounts } = usePaymentMadeFormContext();

  const payableFullAmount = useMemo(
    () => safeSumBy(entries, 'dueAmount'),
    [entries],
  );

  const handleReceiveFullAmountClick = () => {
    const newEntries = fullAmountPaymentEntries(entries);
    const fullAmount = safeSumBy(newEntries, 'paymentAmount');

    setFieldValue('entries', newEntries);
    setFieldValue('amount', fullAmount);
  };

  const onFullAmountBlur = (value: string | number) => {
    const newEntries = amountPaymentEntries(toSafeInteger(value), entries);
    setFieldValue('entries', newEntries);
  };

  return (
    <Stack spacing={18} flex={1} className={fieldsClassName}>
      {/* ------------ Vendor name ------------ */}
      <PaymentFormVendorSelect />

      {/* ----------- Exchange rate ----------- */}
      <PaymentMadeExchangeRateInputField
        name={'exchangeRate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ------------ Payment date ------------ */}
      <FFormGroup
        name={'paymentDate'}
        label={intl.get('payment_date')}
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FDateInput
          name={'paymentDate'}
          {...dateInputFormatter}
          popoverProps={{ position: Position.BOTTOM, minimal: true }}
          inputProps={{ leftIcon: <Icon icon={'date-range'} /> }}
          fill
          fastField
        />
      </FFormGroup>

      {/* ------------ Full amount ------------ */}
      <FFormGroup
        name={'amount'}
        label={intl.get('full_amount')}
        inline={true}
        labelInfo={<Hint />}
        fastField
      >
        <>
          <ControlGroup>
            <InputPrependText text={currencyCode}>{null}</InputPrependText>
            <FMoneyInputGroup
              fastField
              name={'amount'}
              onBlurValue={onFullAmountBlur}
            />
          </ControlGroup>

          {!isEmpty(entries) && (
            <Button
              onClick={handleReceiveFullAmountClick}
              className={'receive-full-amount'}
              small={true}
              minimal={true}
            >
              <T id={'receive_full_amount'} /> (
              <Money amount={payableFullAmount} currency={currencyCode} />)
            </Button>
          )}
        </>
      </FFormGroup>

      {/* ------------ Payment number ------------ */}
      <FFormGroup
        name={'paymentNumber'}
        label={intl.get('payment_no')}
        inline={true}
        fastField
      >
        <FInputGroup name={'paymentNumber'} fastField />
      </FFormGroup>

      {/* ------------ Payment account ------------ */}
      <FFormGroup
        name={'paymentAccountId'}
        label={intl.get('payment_account')}
        labelInfo={<FieldRequiredHint />}
        // @ts-expect-error shouldUpdate is forwarded to FastField at runtime; FormGroupProps type doesn't expose it
        shouldUpdate={accountsFieldShouldUpdate}
        inline={true}
        fastField={true}
      >
        <AccountsSelect
          name={'paymentAccountId'}
          items={accounts ?? []}
          placeholder={<T id={'select_payment_account'} />}
          labelInfo={<FieldRequiredHint />}
          filterByTypes={[
            ACCOUNT_TYPE.CASH,
            ACCOUNT_TYPE.BANK,
            ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
          ]}
          shouldUpdate={accountsFieldShouldUpdate}
          fastField={true}
          fill={true}
        />
      </FFormGroup>

      {/* ------------ Reference ------------ */}
      <FFormGroup
        name={'reference'}
        label={intl.get('reference')}
        inline={true}
        fastField
      >
        <FInputGroup name={'reference'} fastField />
      </FFormGroup>
    </Stack>
  );
}

/**
 * Vendor select field of payment made form.
 */
function PaymentFormVendorSelect() {
  const { values, setFieldValue } = useFormikContext<PaymentMadeFormValues>();

  const { vendors, isNewMode, setPaymentVendorId } =
    usePaymentMadeFormContext();

  return (
    <FFormGroup
      name={'vendorId'}
      label={intl.get('vendor_name')}
      labelInfo={<FieldRequiredHint />}
      inline={true}
      fastField={true}
      // @ts-expect-error shouldUpdate/shouldUpdateDeps are forwarded to FastField at runtime; FormGroupProps type doesn't expose them
      shouldUpdate={vendorsFieldShouldUpdate}
      shouldUpdateDeps={{ items: vendors }}
    >
      <>
        <VendorsSelect
          name={'vendorId'}
          items={vendors}
          placeholder={<T id={'select_vender_account'} />}
          onItemChange={(contact: VendorContact) => {
            setFieldValue('vendorId', contact.id);
            setFieldValue('currencyCode', contact?.currencyCode);
            setPaymentVendorId(Number(contact.id));
          }}
          disabled={!isNewMode}
          allowCreate={true}
          fastField={true}
          shouldUpdate={vendorsFieldShouldUpdate}
          shouldUpdateDeps={{ items: vendors }}
        />
        {values.vendorId && (
          <VendorButtonLink vendorId={Number(values.vendorId)}>
            <T id={'view_vendor_details'} />
          </VendorButtonLink>
        )}
      </>
    </FFormGroup>
  );
}

export const PaymentMadeFormHeaderFields = PaymentMadeFormHeaderFieldsInner;

const VendorButtonLink = styled(VendorDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;
