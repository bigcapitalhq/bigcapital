import { Classes } from '@blueprintjs/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useBudgetFormContext } from './BudgetFormProvider';
import { getBudgetTotals, getVisibleBudgetAccounts } from './utils';
import type { BudgetFormValues, BudgetPeriod } from './types';
import { Card } from '@/components';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { formattedAmount } from '@/utils';

interface BudgetFormSummaryProps {
  periods: BudgetPeriod[];
}

/**
 * Budget form totals summary.
 */
export function BudgetFormSummary({ periods }: BudgetFormSummaryProps) {
  const { accountRows } = useBudgetFormContext();
  const { values } = useFormikContext<BudgetFormValues>();
  const currencyCode = useCurrentOrganizationBaseCurrency();

  const totals = React.useMemo(() => {
    const visibleAccounts = getVisibleBudgetAccounts(
      accountRows,
      values.includeBalanceSheetAccounts,
    );
    return getBudgetTotals(values, visibleAccounts, periods);
  }, [accountRows, periods, values]);

  return (
    <Card className={'budget-form__summary'}>
      <div className={'budget-form__summary-item'}>
        <span className={Classes.TEXT_MUTED}>
          {intl.get('budget.form.total_budget')}
        </span>
        <strong>{formattedAmount(totals.total, currencyCode)}</strong>
      </div>

      <div className={'budget-form__summary-item'}>
        <span className={Classes.TEXT_MUTED}>
          {intl.get('budget.form.total_income')}
        </span>
        <strong>{formattedAmount(totals.income, currencyCode)}</strong>
      </div>

      <div className={'budget-form__summary-item'}>
        <span className={Classes.TEXT_MUTED}>
          {intl.get('budget.form.total_expense')}
        </span>
        <strong>{formattedAmount(totals.expense, currencyCode)}</strong>
      </div>

      <div
        className={classNames('budget-form__summary-item', {
          'is-negative': totals.netProfit < 0,
        })}
      >
        <span className={Classes.TEXT_MUTED}>
          {intl.get('budget.form.net_profit_loss')}
        </span>
        <strong>{formattedAmount(totals.netProfit, currencyCode)}</strong>
      </div>
    </Card>
  );
}
