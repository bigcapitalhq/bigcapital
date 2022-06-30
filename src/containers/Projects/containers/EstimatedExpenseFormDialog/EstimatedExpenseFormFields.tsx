//@ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Classes, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import {
  FFormGroup,
  FInputGroup,
  FormattedMessage as T,
  FieldRequiredHint,
} from 'components';
import { ExpenseSelect } from '../../components';
import { useEstimatedExpenseFormContext } from './EstimatedExpenseFormProvider';
import EstimatedExpenseFormChargeFields from './EstimatedExpenseFormChargeFields';
import { ChargeSelect } from '../../components';
import { expenseChargeOption } from 'common/modalChargeOptions';

/**
 * Estimated expense form fields.
 * @returns
 */
export default function EstimatedExpenseFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Estimated Expense -----------*/}
      <FFormGroup
        name={'estimatedExpense'}
        label={intl.get('estimated_expenses.dialog.estimated_expense')}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <ExpenseSelect
          name={'estimatedExpense'}
          popoverProps={{ minimal: true }}
          expenses={[]}
        />
      </FFormGroup>

      {/*------------ Quantity -----------*/}
      <FFormGroup
        label={intl.get('estimated_expenses.dialog.quantity')}
        name={'quantity'}
      >
        <FInputGroup name="quantity" />
      </FFormGroup>

      <MetaLineLabel>Cost to you</MetaLineLabel>
      {/*------------ Unit Price -----------*/}
      <ControlGroup className={Classes.FILL}>
        <FFormGroup
          name={'unitPrice'}
          label={intl.get('estimated_expenses.dialog.unit_price')}
        >
          <FInputGroup name="unitPrice" />
        </FFormGroup>
        <FFormGroup
          name={'unitPrice'}
          label={intl.get('estimated_expenses.dialog.total')}
        >
          <FInputGroup label="Total" name="total" />
        </FFormGroup>
      </ControlGroup>

      <MetaLineLabel>What you'll charge</MetaLineLabel>
      {/*------------ Charge -----------*/}
      <FFormGroup
        name={'charge'}
        label={<T id={'estimated_expenses.dialog.charge'} />}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <ChargeSelect
          name="charge"
          items={expenseChargeOption}
          popoverProps={{ minimal: true }}
          filterable={false}
        />
      </FFormGroup>
      <EstimatedExpenseFormChargeFields />
      {/*------------ Estimated Amount -----------*/}
      <EstimatedAmountWrap>
        <EstimatedAmountLabel>
          <T id={'estimated_expenses.dialog.estimated_amount'} />
        </EstimatedAmountLabel>
        <EstimatedAmount>0.00</EstimatedAmount>
      </EstimatedAmountWrap>
    </div>
  );
}

const MetaLineLabel = styled.div`
  font-size: 14px;
  line-height: 1.5rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const EstimatedAmountWrap = styled.div`
  display: block;
  text-align: right;
`;
const EstimatedAmountLabel = styled.span`
  font-size: 14px;
  line-height: 1.5rem;
  opacity: 0.75;
`;
const EstimatedAmount = styled.span`
  font-size: 15px;
  font-weight: 700;
  padding-left: 14px;
  line-height: 2rem;
`;
