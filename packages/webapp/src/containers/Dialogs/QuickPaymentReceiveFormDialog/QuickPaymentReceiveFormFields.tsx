// @ts-nocheck
import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import { useSetPrimaryBranchToForm } from './utils';
import {
  Row,
  Col,
  FieldRequiredHint,
  FAccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  Icon,
  If,
  FeatureCan,
  ExchangeRateMutedField,
  BranchSelect,
  FFormGroup,
  FInputGroup,
  FTextArea,
  FDateInput,
  FMoneyInputGroup,
} from '@/components';
import { CLASSES, Features, ACCOUNT_TYPE } from '@/constants';
import { useAutofocus } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { momentFormatter } from '@/utils';

/**
 * Quick payment receive form fields.
 */
function QuickPaymentReceiveFormFieldsInner() {
  const {
    accounts,
    branches,
    paymentReceiveSettings,
  } = useQuickPaymentReceiveContext();
  const paymentReceiveAutoIncrement = paymentReceiveSettings?.autoIncrement as
    | boolean
    | undefined;

  const baseCurrency = useCurrentOrganizationBaseCurrency();

  // Intl context.
  const { values } = useFormikContext();

  const paymentReceiveFieldRef = useAutofocus();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FFormGroup name={'branch_id'} label={intl.get('branch')}>
              <BranchSelect
                name={'branch_id'}
                branches={branches}
                popoverProps={{ minimal: true }}
              />
            </FFormGroup>
          </Col>
        </Row>
        <BranchRowDivider />
      </FeatureCan>

      <Row>
        <Col xs={5}>
          {/* ------------- Customer name ------------- */}
          <FFormGroup
            name={'customer_id'}
            label={intl.get('customer_name')}
            labelInfo={<FieldRequiredHint />}
          >
            <FInputGroup name={'customer_id'} minimal={true} disabled={true} />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ Payment receive no. ------------ */}
          <FFormGroup
            name={'payment_receive_no'}
            label={intl.get('payment_no')}
          >
            <FInputGroup
              name={'payment_receive_no'}
              minimal={true}
              disabled={paymentReceiveAutoIncrement}
            />
          </FFormGroup>
        </Col>
      </Row>
      {/*------------ Amount Received -----------*/}

      <FFormGroup name={'amount'} label={intl.get('amount_received')}>
        <ControlGroup>
          <InputPrependText text={values.currency_code} />
          <FMoneyInputGroup
            name={'amount'}
            minimal={true}
            inputRef={(ref) => (paymentReceiveFieldRef.current = ref)}
          />
        </ControlGroup>
      </FFormGroup>

      <If condition={!isEqual(baseCurrency, values.currency_code)}>
        {/*------------ exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'exchange_rate'}
          fromCurrency={baseCurrency}
          toCurrency={values.currency_code}
          formGroupProps={{ label: '', inline: false }}
          date={values.payment_date}
          exchangeRate={values.exchange_rate}
        />
      </If>

      <Row>
        <Col xs={5}>
          {/* ------------- Payment date ------------- */}
          <FFormGroup name={'payment_date'} label={intl.get('payment_date')}>
            <FDateInput
              {...momentFormatter('YYYY/MM/DD')}
              name={'payment_date'}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ Deposit account ------------ */}
          <FFormGroup
            name={'deposit_account_id'}
            label={intl.get('deposit_to')}
          >
            <FAccountsSuggestField
              name={'deposit_account_id'}
              items={accounts}
              inputProps={{
                placeholder: intl.get('select_account'),
              }}
              filterByTypes={[
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
              ]}
            />
          </FFormGroup>
        </Col>
      </Row>

      {/* ------------ Reference No. ------------ */}
      <FFormGroup label={intl.get('reference')} name={'reference_no'}>
        <FInputGroup name={'reference_no'} minimal={true} />
      </FFormGroup>

      {/* --------- Statement --------- */}
      <FFormGroup
        name={'statement'}
        label={intl.get('statement')}
        className={'form-group--statement'}
      >
        <FTextArea name={'statement'} growVertically={true} />
      </FFormGroup>
    </div>
  );
}

export const QuickPaymentReceiveFormFields = QuickPaymentReceiveFormFieldsInner;

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 15px;

  .bp4-dark & {
    background: rgba(255, 255, 255, 0.1);
  }
`;
