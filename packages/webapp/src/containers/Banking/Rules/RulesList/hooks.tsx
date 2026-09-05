// @ts-nocheck
import { Intent, Tag } from '@blueprintjs/core';
import { useMemo } from 'react';

const applyToTypeAccessor = (rule) => {
  return rule.applyIfTransactionType === 'deposit' ? (
    <Tag round intent={Intent.SUCCESS}>
      Deposits
    </Tag>
  ) : (
    <Tag round intent={Intent.DANGER}>
      Withdrawals
    </Tag>
  );
};

const conditionsAccessor = (rule) => (
  <span style={{ fontSize: 12 }}>{rule.conditionsFormatted}</span>
);

const applyToAccessor = (rule) => (
  <Tag intent={Intent.NONE} minimal>
    {rule.assignAccountName}
  </Tag>
);

export const useBankRulesTableColumns = () => {
  return useMemo(
    () => [
      {
        Header: 'Apply to',
        accessor: applyToTypeAccessor,
      },
      {
        Header: 'Rule Name',
        accessor: 'name',
      },
      {
        Header: 'Categorize As',
        accessor: 'assignCategoryFormatted',
      },
      {
        Header: 'Apply To',
        accessor: applyToAccessor,
      },
      {
        Header: 'Conditions',
        accessor: conditionsAccessor,
      },
    ],
    [],
  );
};
