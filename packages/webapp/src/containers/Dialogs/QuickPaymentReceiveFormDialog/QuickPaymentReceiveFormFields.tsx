// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { FastField, ErrorMessage, useFormikContext } from 'formik';
import { useAutofocus } from '@/hooks';
import { isEqual } from 'lodash';
import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import { CLASSES, Features, ACCOUNT_TYPE } from '@/constants';
import {
  Row,
  Col,
  FieldRequiredHint,
  FormattedMessage as T,
  FAccountsSuggestField,
  InputPrependText,
  MoneyInputGroup,
  Icon,
  If,
  FeatureCan,
  ExchangeRateMutedField,
  BranchSelect,
  BranchSelectButton,
  FFormGroup,
  FInputGroup,
  FTextArea,
  FDateInput,
  FMoneyInputGroup,
} from '@/components';
import { momentFormatter, compose } from '@/utils';
import { useSetPrimaryBranchToForm } from './utils';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import withSettings from '@/containers/Settings/withSettings';

/**
 * Quick payment receive form fields.
 */
function QuickPaymentReceiveFormFields({
  paymentReceiveAutoIncrement,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { accounts, branches, baseCurrency } = useQuickPaymentReceiveContext();

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
            <FFormGroup name={'branch_id'} label={<T id={'branch'} />}>
              <BranchSelect
                name={'branch_id'}
                branches={branches}
                input={BranchSelectButton}
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
            label={<T id={'customer_name'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <FInputGroup name={'customer_id'} minimal={true} disabled={true} />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ Payment receive no. ------------ */}
          <FFormGroup
            name={'payment_receive_no'}
            label={<T id={'payment_no'} />}
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

      <FFormGroup name={'amount'} label={<T id={'amount_received'} />}>
        <ControlGroup>
          <InputPrependText text={values.currency_code} />
          <FMoneyInputGroup
            name={'amount'}
            minimal={true}
            inputRef={(ref) => (paymentReceiveFieldRef.current = ref)}
          />
        </ControlGroup>
      </FFormGroup>

      <If condition={!isEqual(base_currency, values.currency_code)}>
        {/*------------ exchange rate -----------*/}
        <ExchangeRateMutedField
          name={'exchange_rate'}
          fromCurrency={base_currency}
          toCurrency={values.currency_code}
          formGroupProps={{ label: '', inline: false }}
          date={values.payment_date}
          exchangeRate={values.exchange_rate}
        />
      </If>

      <Row>
        <Col xs={5}>
          {/* ------------- Payment date ------------- */}
          <FFormGroup name={'payment_date'} label={<T id={'payment_date'} />}>
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
            label={<T id={'deposit_to'} />}
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
      <FFormGroup label={<T id={'reference'} />} name={'reference_no'}>
        <FInputGroup name={'reference_no'} minimal={true} />
      </FFormGroup>

      {/* --------- Statement --------- */}
      <FFormGroup
        name={'statement'}
        label={<T id={'statement'} />}
        className={'form-group--statement'}
      >
        <FTextArea name={'statement'} growVertically={true} />
      </FFormGroup>
    </div>
  );
}

export default compose(
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceiveAutoIncrement: paymentReceiveSettings?.autoIncrement,
  })),
  withCurrentOrganization(),
)(QuickPaymentReceiveFormFields);

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 15px;

  .bp4-dark & {
    background: rgba(255, 255, 255, 0.1);
  }
`;
