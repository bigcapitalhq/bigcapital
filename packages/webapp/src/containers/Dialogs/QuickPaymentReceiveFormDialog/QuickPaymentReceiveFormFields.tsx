import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import { useSetPrimaryBranchToForm } from './utils';
import type { QuickPaymentReceiveFormValues } from './types';
import {
  Row,
  Col,
  FieldRequiredHint,
  FAccountsSuggestField,
  InputPrependText,
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
import { Features, ACCOUNT_TYPE } from '@/constants';
import { useAutofocus, useDateInputFormatter } from '@/hooks';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

/**
 * Quick payment receive form fields.
 */
function QuickPaymentReceiveFormFieldsInner(): React.ReactElement {
  const { accounts, branches, paymentReceiveSettings } =
    useQuickPaymentReceiveContext();
  const paymentReceiveAutoIncrement = paymentReceiveSettings?.autoIncrement as
    | boolean
    | undefined;

  const baseCurrency = useCurrentOrganizationBaseCurrency();
  const { values } = useFormikContext<QuickPaymentReceiveFormValues>();
  const paymentReceiveFieldRef = useAutofocus<HTMLInputElement>();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();
  const dateInputFormatter = useDateInputFormatter();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FFormGroup name={'branchId'} label={intl.get('branch')}>
              <BranchSelect
                name={'branchId'}
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
            name={'customerId'}
            label={intl.get('customer_name')}
            labelInfo={<FieldRequiredHint />}
          >
            <FInputGroup name={'customerId'} disabled />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ Payment receive no. ------------ */}
          <FFormGroup name={'paymentReceiveNo'} label={intl.get('payment_no')}>
            <FInputGroup
              name={'paymentReceiveNo'}
              disabled={paymentReceiveAutoIncrement}
            />
          </FFormGroup>
        </Col>
      </Row>
      {/*------------ Amount Received ----------- */}

      <FFormGroup name={'amount'} label={intl.get('amount_received')}>
        <ControlGroup>
          <InputPrependText text={values.currencyCode} />
          <FMoneyInputGroup
            name={'amount'}
            minimal={true}
            inputRef={(ref: HTMLInputElement | null) => {
              paymentReceiveFieldRef.current = ref;
            }}
          />
        </ControlGroup>
      </FFormGroup>

      <If condition={!isEqual(baseCurrency, values.currencyCode)}>
        {/*------------ exchange rate ----------- */}
        <ExchangeRateMutedField
          name={'exchangeRate'}
          fromCurrency={baseCurrency}
          toCurrency={values.currencyCode}
          formGroupProps={{ label: '', inline: false }}
          date={values.paymentDate}
          exchangeRate={values.exchangeRate}
        />
      </If>

      <Row>
        <Col xs={5}>
          {/* ------------- Payment date ------------- */}
          <FFormGroup name={'paymentDate'} label={intl.get('payment_date')}>
            <FDateInput
              {...dateInputFormatter}
              name={'paymentDate'}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ Deposit account ------------ */}
          <FFormGroup name={'depositAccountId'} label={intl.get('deposit_to')}>
            <FAccountsSuggestField
              name={'depositAccountId'}
              items={accounts ?? []}
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
      <FFormGroup label={intl.get('reference')} name={'referenceNo'}>
        <FInputGroup name={'referenceNo'} />
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
