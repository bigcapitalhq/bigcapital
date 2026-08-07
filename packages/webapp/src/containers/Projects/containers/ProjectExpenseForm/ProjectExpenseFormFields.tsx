// @ts-nocheck
import { Classes, Position, ControlGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  ExpenseSelect,
  FInputGroupComponent,
  ProjectTaskChargeTypeSelect,
} from '../../components';
import { expenseChargeOption } from '../common/modalChargeOptions';
import { ExpenseFormChargeFields } from './ProjectExpenseFormChargeFields';
import { useProjectExpenseFormContext } from './ProjectExpenseFormProvider';
import {
  FFormGroup,
  FInputGroup,
  FDateInput,
  FormattedMessage as T,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { momentFormatter } from '@/utils';

/**
 * Project expense form fields.
 * @returns
 */
export function ProjectExpenseFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Expense Name -----------*/}
      <FFormGroup
        label={intl.get('project_expense.dialog.expense_name')}
        name={'expenseName'}
      >
        <FInputGroup name="expenseName" />
      </FFormGroup>
      {/*------------ Track to Expense -----------*/}
      <FFormGroup
        name={'estimatedExpense'}
        label={intl.get('project_expense.dialog.track_expense')}
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
        label={intl.get('project_expense.dialog.expense_date')}
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
        label={intl.get('project_expense.dialog.quantity')}
        name={'expenseQuantity'}
      >
        <FInputGroupComponent name="expenseQuantity" />
      </FFormGroup>

      <MetaLineLabel>
        <T id={'project_expense.dialog.cost_to_you'} />
      </MetaLineLabel>
      {/*------------ Unit Price -----------*/}
      <ControlGroup className={Classes.FILL}>
        <FFormGroup
          name={'unitPrice'}
          label={intl.get('project_expense.dialog.unit_price')}
        >
          <FInputGroupComponent name="expenseUnitPrice" />
        </FFormGroup>
        <FFormGroup
          name={'expenseTotal'}
          label={intl.get('project_expense.dialog.expense_total')}
        >
          <FInputGroup name="expenseTotal" />
        </FFormGroup>
      </ControlGroup>

      <MetaLineLabel>
        <T id={'project_expense.dialog.what_you_ll_charge'} />
      </MetaLineLabel>
      {/*------------ Charge -----------*/}
      <FFormGroup
        name={'expenseCharge'}
        label={intl.get('project_expense.dialog.charge')}
        className={classNames('form-group--select-list', Classes.FILL)}
      >
        <ProjectTaskChargeTypeSelect
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
          <T id={'project_expense.dialog.total'} />
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
