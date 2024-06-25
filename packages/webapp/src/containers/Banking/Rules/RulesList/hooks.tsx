// @ts-nocheck
import { useMemo } from 'react';
import { Intent, Tag } from '@blueprintjs/core';

export const useBankRulesTableColumns = () => {
  return useMemo(
    () => [
      {
        Header: 'Apply to',
        accessor: (rule) =>
          rule.apply_if_transaction_type === 'deposit' ? (
            <Tag round intent={Intent.SUCCESS}>Deposits</Tag>
          ) : (
            <Tag round intent={Intent.DANGER}>Withdrawals</Tag>
          ),
      },
      {
        Header: 'Rule Name',
        accessor: 'name',
      },
      {
        Header: 'Categorize As',
        accessor: () => 'Expense',
      },
      {
        Header: 'Apply To',
        accessor: () => <Tag intent={Intent.NONE} minimal>All Accounts</Tag>,
      },
      {
        Header: 'Conditions',
        accessor: () => '',
      },
    ],
    [],
  );
};
