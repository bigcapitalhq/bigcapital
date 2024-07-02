// @ts-nocheck
import { useMemo } from 'react';
import { Intent, Tag } from '@blueprintjs/core';

const applyToTypeAccessor = (rule) => {
  return rule.apply_if_transaction_type === 'deposit' ? (
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
  <span style={{ fontSize: 12, color: '#5F6B7C' }}>
    {rule.conditions_formatted}
  </span>
);

const applyToAccessor = (rule) => (
  <Tag intent={Intent.NONE} minimal>
    {rule.assign_account_name}
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
        accessor: 'assign_category_formatted',
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
