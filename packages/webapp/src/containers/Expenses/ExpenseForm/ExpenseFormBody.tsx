// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';

import ExpenseFormEntriesField from './ExpenseFormEntriesField';
import ExpenseFormPaymentSplitsField from './ExpenseFormPaymentSplitsField';
import {
  useExpensePaymentsTotal,
  useExpenseSubtotal,
  useExpenseRemaining,
} from './utils';
import { useFormikContext } from 'formik';
import { formattedAmount } from '@/utils';

export default function ExpenseFormBody() {
  return (
    <Wrap>
      <SectionTitle>{intl.get('payments') || 'Payments'}</SectionTitle>
      <ExpenseFormPaymentSplitsField />

      <SectionTitle>
        {intl.get('expense_categories') || 'Categories'}
      </SectionTitle>
      <ExpenseFormEntriesField />

      <AllocationSummary />
    </Wrap>
  );
}

function AllocationSummary() {
  const {
    values: { currency_code },
  } = useFormikContext();
  const paymentsTotal = useExpensePaymentsTotal();
  const categoriesTotal = useExpenseSubtotal();
  const remaining = useExpenseRemaining();

  return (
    <SummaryBar>
      <SummaryItem>
        <span className="label">
          {intl.get('payments_total') || 'Payments Total'}
        </span>
        <span className="value">
          {formattedAmount(paymentsTotal, currency_code)}
        </span>
      </SummaryItem>
      <SummaryItem>
        <span className="label">
          {intl.get('categories_total') || 'Categories Total'}
        </span>
        <span className="value">
          {formattedAmount(categoriesTotal, currency_code)}
        </span>
      </SummaryItem>
      <SummaryItem warn={Math.abs(remaining) > 0.005}>
        <span className="label">{intl.get('remaining') || 'Remaining'}</span>
        <span className="value">
          {formattedAmount(remaining, currency_code)}
        </span>
      </SummaryItem>
    </SummaryBar>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-top: 8px;
`;

const SummaryBar = styled.div`
  display: flex;
  gap: 32px;
  padding: 10px 0 4px;
  font-size: 12px;
`;

const SummaryItem = styled.div<{ warn?: boolean }>`
  display: flex;
  gap: 10px;
  align-items: baseline;
  .label {
    color: #666;
  }
  .value {
    font-weight: 600;
    color: ${(p) => (p.warn ? '#c23030' : '#1f2f48')};
  }
`;
