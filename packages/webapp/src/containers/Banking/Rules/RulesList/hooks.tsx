import { Intent, Tag } from '@blueprintjs/core';
import { useMemo } from 'react';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { BankRuleResponse } from '@bigcapital/sdk-ts';

export type BankRuleTableRow = BankRuleResponse & {
  // Runtime-only fields injected by the server-side bank rules transformer
  // (not part of the generated SDK schema).
  conditionsFormatted: string;
  assignCategoryFormatted: string;
  assignAccountName: string;
};

const applyToTypeAccessor = (rule: BankRuleTableRow) => {
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

const conditionsAccessor = (rule: BankRuleTableRow) => (
  <span style={{ fontSize: 12 }}>{rule.conditionsFormatted}</span>
);

const applyToAccessor = (rule: BankRuleTableRow) => (
  <Tag intent={Intent.NONE} minimal>
    {rule.assignAccountName}
  </Tag>
);

export const useBankRulesTableColumns =
  (): DataTableColumn<BankRuleTableRow>[] => {
    return useMemo(
      () =>
        [
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
        ] as DataTableColumn<BankRuleTableRow>[],
      [],
    );
  };
