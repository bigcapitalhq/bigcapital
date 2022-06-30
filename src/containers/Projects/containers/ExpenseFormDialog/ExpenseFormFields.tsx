//@ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import {
  FFormGroup,
  FInputGroup,
  FDateInput,
  FormattedMessage as T,
} from 'components';
import { ExpenseSelect } from '../../components';
import ExpenseFormChargeFields from './ExpenseFormChargeFields';
import { momentFormatter } from 'utils';
import { useExpenseFormContext } from './ExpenseFormProvider';
import { ChargeSelect } from '../../components';
import { expenseChargeOption } from 'common/modalChargeOptions';

/**
 * Expense form fields.
 * @returns
 */
export default function ExpenseFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Expense Name -----------*/}
      <FFormGroup
        label={intl.get('expenses.dialog.expense_name')}
        name={'expenseName'}
      >
        <FInputGroup name="expenseName" />
      </FFormGroup>
      {/*------------ Track to Expense -----------*/}
      <FFormGroup
        name={'estimatedExpense'}
        label={intl.get('expenses.dialog.track_expense')}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <ExpenseSelect
          name={'estimatedExpense'}
          popoverProps={{ minimal: true }}
          expenses={[{ id: 1, name: 'Expense 1' }]}
        />
      </FFormGroup>

      {/*------------ Extimated Date -----------*/}
      <FFormGroup
        label={intl.get('expenses.dialog.expense_date')}
        name={'expemseDate'}
        className={classNames(CLASSES.FILL, 'form-group--date')}
      >
        <FDateInput
          {...momentFormatter('YYYY/MM/DD')}
          name="expemseDate"
          formatDate={(date) => date.toLocaleString()}
          popoverProps={{
            position: Position.BOTTOM,
            minimal: true,
          }}
        />
      </FFormGroup>
      {/*------------ Quantity -----------*/}
      <FFormGroup
        label={intl.get('expenses.dialog.quantity')}
        name={'expenseQuantity'}
      >
        <FInputGroup name="expenseQuantity" />
      </FFormGroup>

      <MetaLineLabel>Cost to you</MetaLineLabel>
      {/*------------ Unit Price -----------*/}
      <ControlGroup className={Classes.FILL}>
        <FFormGroup
          name={'unitPrice'}
          label={intl.get('expenses.dialog.unit_price')}
        >
          <FInputGroup name="expenseUnitPrice" />
        </FFormGroup>
        <FFormGroup
          name={'expenseTotal'}
          label={intl.get('expenses.dialog.expense_total')}
        >
          <FInputGroup name="expenseTotal" />
        </FFormGroup>
      </ControlGroup>

      <MetaLineLabel>What you'll charge</MetaLineLabel>
      {/*------------ Charge -----------*/}
      <FFormGroup
        name={'expenseCharge'}
        label={<T id={'expenses.dialog.charge'} />}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <ChargeSelect
          name="expenseCharge"
          items={expenseChargeOption}
          popoverProps={{ minimal: true }}
          filterable={false}
        />
      </FFormGroup>

      {/*------------ Charge Fields -----------*/}
      <ExpenseFormChargeFields />

      {/*------------ Total -----------*/}
      <ExpenseTotalBase>
        <ExpenseTotalLabel>
          <T id={'expenses.dialog.total'} />
        </ExpenseTotalLabel>
        <ExpenseTotal>0.00</ExpenseTotal>
      </ExpenseTotalBase>
    </div>
  );
}

const MetaLineLabel = styled.div`
  font-size: 14px;
  line-height: 1.5rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ExpenseTotalBase = styled.div`
  display: block;
  text-align: right;
`;

const ExpenseTotalLabel = styled.div`
  font-size: 14px;
  line-height: 1.5rem;
  opacity: 0.75;
`;

const ExpenseTotal = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding-left: 14px;
  line-height: 2rem;
`;
