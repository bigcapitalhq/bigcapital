import { Position, Classes, ControlGroup, Button } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';
import { Theme } from '@xstyled/emotion';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty, toSafeInteger } from 'lodash';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  PaymentReceiveExchangeRateInputField,
  PaymentReceiveProjectSelectButton,
} from './components';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { PaymentReceivePaymentNoField } from './PaymentReceivePaymentNoField';
import {
  amountPaymentEntries,
  fullAmountPaymentEntries,
  customersFieldShouldUpdate,
  accountsFieldShouldUpdate,
  type PaymentReceiveFormValues,
} from './utils';
import {
  FeatureCan,
  CustomersSelect,
  FormattedMessage as T,
  FMoneyInputGroup,
  Stack,
  FDateInput,
} from '@/components';
import {
  FFormGroup,
  AccountsSelect,
  FieldRequiredHint,
  Icon,
  InputPrependText,
  CustomerDrawerLink,
  Hint,
  Money,
  FInputGroup,
} from '@/components';
import { Features } from '@/constants';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { ProjectsSelect } from '@/containers/Projects/components';
import { useDateInputFormatter } from '@/hooks';
import { safeSumBy } from '@/utils';

const getHeaderFieldsStyle = (theme: Theme) => css`
  .${theme.bpPrefix}-form-group {
    margin-bottom: 0;

    &.${theme.bpPrefix}-inline {
      max-width: 470px;
    }
    .${theme.bpPrefix}-label {
      min-width: 160px;
    }
    .${theme.bpPrefix}-form-content {
      width: 100%;
    }
  }
`;

/**
 * Payment receive header fields.
 */
export function PaymentReceiveHeaderFields() {
  const theme = useTheme() as Theme;
  const styleClassName = getHeaderFieldsStyle(theme);
  const dateInputFormatter = useDateInputFormatter();

  const { accounts, projects } = usePaymentReceiveFormContext();

  const {
    values: { entries, currencyCode },
    setFieldValue,
  } = useFormikContext<PaymentReceiveFormValues>();

  const totalDueAmount = useMemo(
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
    <Stack spacing={18} flex={1} className={styleClassName}>
      {/* ------------- Customer name ------------- */}
      <PaymentReceiveCustomerSelect />

      {/* ----------- Exchange rate ----------- */}
      <PaymentReceiveExchangeRateInputField
        name={'exchangeRate'}
        formGroupProps={{ label: ' ', inline: true }}
      />

      {/* ------------- Payment date ------------- */}
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
          popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
          inputProps={{
            leftIcon: <Icon icon={'date-range'} />,
            fill: true,
          }}
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
              name={'amount'}
              onBlurValue={onFullAmountBlur}
              fastField
            />
          </ControlGroup>

          {!isEmpty(entries) && (
            <Button
              onClick={handleReceiveFullAmountClick}
              className={css`
                &:not([class*='${theme.bpPrefix}-intent-']) {
                  &.${theme.bpPrefix}-minimal {
                    width: auto;
                    padding: 0;
                    min-height: auto;
                    font-size: 12px;
                    margin-top: 4px;
                    background-color: transparent;
                    color: #0052cc;

                    &:hover {
                      text-decoration: underline;
                    }
                  }
                }
              `}
              small
              minimal
            >
              <T id={'receive_full_amount'} /> (
              <Money amount={totalDueAmount} currency={currencyCode} />)
            </Button>
          )}
        </>
      </FFormGroup>

      {/* ------------ Payment receive no. ------------ */}
      <PaymentReceivePaymentNoField />

      {/* ------------ Deposit account ------------ */}
      <FFormGroup
        name={'depositAccountId'}
        label={intl.get('deposit_to')}
        inline={true}
        labelInfo={<FieldRequiredHint />}
        // @ts-expect-error shouldUpdate is forwarded to FastField at runtime; FormGroupProps type doesn't expose it
        shouldUpdate={accountsFieldShouldUpdate}
        fastField={true}
      >
        <AccountsSelect
          name={'depositAccountId'}
          items={accounts ?? []}
          labelInfo={<FieldRequiredHint />}
          placeholder={<T id={'select_deposit_account'} />}
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

      {/* ------------ Reference No. ------------ */}
      <FFormGroup
        name={'referenceNo'}
        label={intl.get('reference')}
        inline
        fastField
      >
        <FInputGroup name={'referenceNo'} fill />
      </FFormGroup>

      {/*------------ Project name -----------*/}
      <FeatureCan feature={Features.Projects}>
        <FFormGroup
          name={'projectId'}
          label={intl.get('payment_receive.project_name.label')}
          inline={true}
          className={classNames('form-group--select-list', Classes.FILL)}
        >
          <ProjectsSelect
            name={'projectId'}
            projects={projects}
            input={PaymentReceiveProjectSelectButton}
            popoverFill={true}
          />
        </FFormGroup>
      </FeatureCan>
    </Stack>
  );
}

const CustomerButtonLink = styled(CustomerDrawerLink)`
  font-size: 11px;
  margin-top: 6px;
`;

type CustomerOption = {
  id: string | number;
  currencyCode?: string;
};

/**
 * Customer select field of payment receive form.
 */
function PaymentReceiveCustomerSelect() {
  const { customers, isNewMode } = usePaymentReceiveFormContext();

  const { values, setFieldValue } =
    useFormikContext<PaymentReceiveFormValues>();

  return (
    <FFormGroup
      label={intl.get('customer_name')}
      inline={true}
      labelInfo={<FieldRequiredHint />}
      name={'customerId'}
      fastField={true}
      // @ts-expect-error shouldUpdate/shouldUpdateDeps are forwarded to FastField at runtime; FormGroupProps type doesn't expose them
      shouldUpdate={customersFieldShouldUpdate}
      shouldUpdateDeps={{ items: customers }}
    >
      <>
        <CustomersSelect
          name={'customerId'}
          items={customers}
          placeholder={<T id={'select_customer_account'} />}
          onItemChange={(customer: CustomerOption) => {
            setFieldValue('customerId', customer.id);
            setFieldValue('amount', '');
            setFieldValue('currencyCode', customer?.currencyCode);
          }}
          popoverFill={true}
          disabled={!isNewMode}
          allowCreate={true}
          fastField={true}
          shouldUpdate={customersFieldShouldUpdate}
          shouldUpdateDeps={{ items: customers }}
        />
        {values.customerId && (
          <CustomerButtonLink customerId={values.customerId}>
            <T id={'view_customer_details'} />
          </CustomerButtonLink>
        )}
      </>
    </FFormGroup>
  );
}
