// @ts-nocheck
import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import { Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FormattedMessage as T,
  FAccountsSuggestField,
  InputPrependText,
  FieldRequiredHint,
  Col,
  Row,
  BranchSelect,
  FeatureCan,
  FFormGroup,
  FMoneyInputGroup,
  FTextArea,
  FInputGroup,
  FDateInput,
} from '@/components';
import { ACCOUNT_TYPE, CLASSES, Features } from '@/constants';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
} from '@/utils';
import { useMoneyInDailogContext } from '../MoneyInDialogProvider';
import {
  useSetPrimaryBranchToForm,
  BranchRowDivider,
} from '../../MoneyInDialog/utils';
import { MoneyInOutTransactionNoField } from '../../_components';
import { useMoneyInFieldsContext } from '../MoneyInFieldsProvider';
import { MoneyInExchangeRateField } from '../MoneyInExchangeRateField';

/**
/**
 * Owner contribution form fields.
 */
export default function OwnerContributionFormFields() {
  // Money in dialog context.
  const { accounts, branches } = useMoneyInDailogContext();
  const { account } = useMoneyInFieldsContext();

  // Sets the primary branch to form.
  useSetPrimaryBranchToForm();

  return (
    <React.Fragment>
      <FeatureCan feature={Features.Branches}>
        <Row>
          <Col xs={5}>
            <FFormGroup name={'branch_id'} label={<T id={'branch'} />}>
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
          {/*------------ Date -----------*/}
          <FFormGroup
            name={'date'}
            label={<T id={'date'} />}
            labelInfo={<FieldRequiredHint />}
            fill
          >
            <FDateInput
              name={'date'}
              {...momentFormatter('YYYY/MM/DD')}
              popoverProps={{
                position: Position.BOTTOM_LEFT,
                minimal: true,
              }}
              inputProps={{
                fill: true,
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FFormGroup>
        </Col>
        <Col xs={5}>
          {/*------------ Transaction number -----------*/}
          <MoneyInOutTransactionNoField />
        </Col>
      </Row>

      {/*------------ Amount -----------*/}
      <Row>
        <Col xs={10}>
          <FFormGroup
            name={'amount'}
            label={<T id={'amount'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <ControlGroup>
              <InputPrependText text={account?.currency_code || '--'} />
              <FMoneyInputGroup name={'amount'} minimal={true} />
            </ControlGroup>
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ Exchange rate -----------*/}
      <MoneyInExchangeRateField />

      <Row>
        <Col xs={5}>
          {/*------------ equity account -----------*/}
          <FFormGroup
            name={'credit_account_id'}
            label={<T id={'cash_flow_transaction.label_equity_account'} />}
            labelInfo={<FieldRequiredHint />}
          >
            <FAccountsSuggestField
              name={'credit_account_id'}
              items={accounts}
              filterByTypes={ACCOUNT_TYPE.EQUITY}
            />
          </FFormGroup>
        </Col>

        <Col xs={5}>
          {/*------------ Reference -----------*/}
          <FFormGroup name={'reference_no'} label={<T id={'reference_no'} />}>
            <FInputGroup name={'reference_no'} />
          </FFormGroup>
        </Col>
      </Row>

      {/*------------ Description -----------*/}
      <FFormGroup name={'description'} label={<T id={'description'} />}>
        <FTextArea
          name={'description'}
          growVertically={true}
          large={true}
          fill={true}
        />
      </FFormGroup>
    </React.Fragment>
  );
}
