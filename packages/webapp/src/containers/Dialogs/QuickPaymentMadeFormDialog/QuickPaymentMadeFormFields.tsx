// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { FastField, useFormikContext } from 'formik';
import { isEqual } from 'lodash';
import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import { useAutofocus } from '@/hooks';
import classNames from 'classnames';
import { CLASSES, ACCOUNT_TYPE, Features } from '@/constants';

import {
  FieldRequiredHint,
  Col,
  Row,
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
  FDateInput,
  FTextArea,
  FMoneyInputGroup,
} from '@/components';
import { inputIntent, momentFormatter } from '@/utils';
import { useSetPrimaryBranchToForm } from './utils';
import { useQuickPaymentMadeContext } from './QuickPaymentMadeFormProvider';

import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';
import { flow } from 'fp-ts/function';

/**
 * Quick payment made form fields.
 */
function QuickPaymentMadeFormFieldsInner({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { accounts, branches, baseCurrency } = useQuickPaymentMadeContext();

  // Intl context.
  const { values } = useFormikContext();

  const paymentMadeFieldRef = useAutofocus();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <div className={Classes.DIALOG_BODY}>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FFormGroup label={intl.get('branch')} name={'branch_id'}>
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
        {/* ------------- Vendor name ------------- */}
        <Col xs={5}>
          <FFormGroup name={'vendor_id'} label={intl.get('vendor_name')}>
            <FInputGroup name={'vendor_id'} minimal={true} disabled={true} />
          </FFormGroup>
        </Col>

        {/* ------------ Payment number. ------------ */}
        <Col xs={5}>
          <FFormGroup name={'payment_number'} label={intl.get('payment_no')}>
            <FInputGroup name={'payment_number'} minimal={true} />
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
            inputRef={(ref) => (paymentMadeFieldRef.current = ref)}
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
          <FFormGroup
            name={'payment_date'}
            label={intl.get('payment_date')}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', CLASSES.FILL)}
          >
            <FDateInput
              name={'payment_date'}
              {...momentFormatter('YYYY/MM/DD')}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/* ------------ payment account ------------ */}
          <FFormGroup
            name={'payment_account_id'}
            label={intl.get('payment_account')}
          >
            <FAccountsSuggestField
              name={'payment_account_id'}
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
      <FFormGroup name={'reference'} label={intl.get('reference')}>
        <FInputGroup name={'reference'} minimal={true} />
      </FFormGroup>

      {/* --------- Statement --------- */}
      <FFormGroup name={'statement'} label={intl.get('statement')}>
        <FTextArea name={'statement'} growVertically={true} fill={true} />
      </FFormGroup>
    </div>
  );
}

export const QuickPaymentMadeFormFields = flow(
  withCurrentOrganization(),
)(QuickPaymentMadeFormFieldsInner);

export const BranchRowDivider = styled.div`
  height: 1px;
  background: #ebf1f6;
  margin-bottom: 15px;

  .bp4-dark & {
    background: rgba(255, 255, 255, 0.1);
  }
`;
