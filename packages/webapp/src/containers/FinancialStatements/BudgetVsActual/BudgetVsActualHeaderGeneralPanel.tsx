import { Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { useEffect, useMemo, useRef } from 'react';
import intl from 'react-intl-universal';
import { displayColumnsByOptions } from '../constants';
import { FinancialStatementDateRange } from '../FinancialStatementDateRange';
import {
  AccountsMultiSelect,
  FFormGroup,
  FSelect,
  Row,
  Col,
} from '@/components';
import { useAccounts, useBudgets } from '@/hooks/query';

const displayColumnsByItems = displayColumnsByOptions.filter((option) =>
  ['month', 'quarter', 'year'].includes(option.by),
);

/**
 * Budget vs actual - Header - General panel.
 */
export function BudgetVsActualHeaderGeneralPanel() {
  const { values, setFieldValue } = useFormikContext<any>();

  // Fetches the budgets list to select from.
  const { data: budgetsData } = useBudgets({ pageSize: 100 });

  // Fetches the accounts list.
  const { data: accounts } = useAccounts();

  const budgetSelectItems = useMemo(
    () =>
      (budgetsData?.data ?? []).map((budget) => ({
        id: budget.id,
        name: budget.name,
      })),
    [budgetsData?.data],
  );

  const selectedBudget = useMemo(
    () =>
      (budgetsData?.data ?? []).find((b) => b.id === Number(values.budgetId)),
    [budgetsData?.data, values.budgetId],
  );

  // Keeps track of the last selected budget to avoid overriding the custom
  // report date range when the drawer first mounts.
  const prevBudgetIdRef = useRef(values.budgetId);

  // Populates the date range with the selected budget dates.
  useEffect(() => {
    const prevBudgetId = prevBudgetIdRef.current;
    prevBudgetIdRef.current = values.budgetId;

    if (values.budgetId && values.budgetId !== prevBudgetId && selectedBudget) {
      setFieldValue('fromDate', moment(selectedBudget.fromDate).toDate());
      setFieldValue('toDate', moment(selectedBudget.toDate).toDate());
    }
  }, [values.budgetId, selectedBudget, setFieldValue]);

  return (
    <div>
      <Row>
        <Col xs={4}>
          <FFormGroup
            name={'budgetId'}
            label={intl.get('budget_vs_actual.filter_budget')}
            fastField
          >
            <FSelect
              name={'budgetId'}
              items={budgetSelectItems}
              valueAccessor={'id'}
              textAccessor={'name'}
              placeholder={'Select a budget'}
              filterable={true}
              popoverProps={{ minimal: true }}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      <FinancialStatementDateRange />

      <Row>
        <Col xs={4}>
          <FFormGroup
            name={'displayColumnsType'}
            label={intl.get('display_report_columns')}
            inline={false}
            fastField
          >
            <FSelect
              name={'displayColumnsType'}
              items={displayColumnsByItems}
              valueAccessor={'key'}
              textAccessor={'name'}
              filterable={false}
              popoverProps={{ minimal: true }}
              fastField
            />
          </FFormGroup>
        </Col>
      </Row>

      <Row>
        <Col xs={4}>
          <FFormGroup
            label={intl.get('specific_accounts')}
            name={'accountsIds'}
            className={Classes.FILL}
          >
            <AccountsMultiSelect name="accountsIds" items={accounts ?? []} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
