import intl from 'react-intl-universal';
import React from 'react';
import type { BankingAccountsListResponse } from '@bigcapital/sdk-ts';
import type { SelectOptionProps } from '@blueprintjs-formik/select';
import { BPSelect } from '@/components';

type BankAccountOption = SelectOptionProps & {
  id: number;
  name: string;
  code: string;
  accountType: string;
};

interface BankAccountSelectProps {
  accounts: BankingAccountsListResponse;
  selectedAccountId: number | null;
  onSelect: (accountId: number) => void;
  disabled?: boolean;
}

/**
 * Select field for the reconcilable bank accounts.
 */
export function BankAccountSelect({
  accounts,
  selectedAccountId,
  onSelect,
  disabled,
}: BankAccountSelectProps) {
  const items = React.useMemo<BankAccountOption[]>(
    () =>
      accounts.map((account) => ({
        ...account,
        text: account.name,
        label: account.code,
        value: account.id,
      })),
    [accounts],
  );

  return (
    <BPSelect<BankAccountOption>
      items={items}
      selectedValue={selectedAccountId ?? undefined}
      onValueChange={(value: string | number | null) => {
        if (value === null || value === undefined) return;
        onSelect(Number(value));
      }}
      placeholder={intl.get('banking.reconciliation.account_placeholder')}
      noResultsText={intl.get('no_results')}
      inputProps={{ placeholder: intl.get('search') }}
      buttonProps={{ id: 'reconcile-bank-account' }}
      disabled={disabled}
      popoverProps={{ minimal: true, usePortal: true, inline: false }}
    />
  );
}
