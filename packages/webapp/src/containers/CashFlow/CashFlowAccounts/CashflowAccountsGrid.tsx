import { ContextMenu2 } from '@blueprintjs/popover2';
import { isEmpty } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CashflowAccountMenu } from './CashflowAccountMenu';
import { CashflowAccountsEmptyState } from './CashflowAccountsEmptyState';
import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';
import type { CashflowAccountRow } from './components';
import { BankAccount, BankAccountsList } from '@/components';

const CASHFLOW_SKELETON_N = 4;

interface CashflowBankAccountProps {
  account: CashflowAccountRow;
}

interface CashflowAccountsGridItemsProps {
  accounts: CashflowAccountRow[];
}

/**
 * Cashflow accounts skeleton for loading state.
 */
function CashflowAccountsSkeleton() {
  return (
    <>
      {Array.from({ length: CASHFLOW_SKELETON_N }).map((_, i) => (
        <BankAccount
          key={i}
          title={'XXXXX'}
          code={'XXXXX'}
          balance={'XXXXXX'}
          type={'cash'}
          updatedBeforeText={''}
          uncategorizedTransactionsCount={0}
          loading={true}
        />
      ))}
    </>
  );
}

/**
 * Cashflow bank account.
 */
function CashflowBankAccount({ account }: CashflowBankAccountProps) {
  return (
    <ContextMenu2 content={<CashflowAccountMenu account={account} />}>
      <CashflowAccountAnchor
        to={`/cashflow-accounts/${account.id}/transactions`}
      >
        <BankAccount
          title={account.name}
          code={account.code}
          balance={account.amount != null ? account.formattedAmount : '-'}
          type={account.accountType}
          logoUrl={account.plaidInstitutionLogo}
          updatedBeforeText={
            account.lastFeedsUpdatedFromNow
              ? `Updated ${account.lastFeedsUpdatedFromNow} ago`
              : ''
          }
          uncategorizedTransactionsCount={undefined}
        />
      </CashflowAccountAnchor>
    </ContextMenu2>
  );
}

/**
 * Cashflow accounts grid items.
 */
function CashflowAccountsGridItems({
  accounts,
}: CashflowAccountsGridItemsProps) {
  return (
    <>
      {accounts.map((account) => (
        <CashflowBankAccount key={account.id} account={account} />
      ))}
    </>
  );
}

/**
 * Cashflow accounts grid.
 */
export function CashflowAccountsGrid() {
  // Retrieve list context.
  const { cashflowAccounts, isCashFlowAccountsLoading } =
    useCashFlowAccountsContext();

  return (
    <CashflowAccountsGridWrap>
      <BankAccountsList>
        {isCashFlowAccountsLoading ? (
          <CashflowAccountsSkeleton />
        ) : isEmpty(cashflowAccounts) ? (
          <CashflowAccountsEmptyState />
        ) : (
          <CashflowAccountsGridItems accounts={cashflowAccounts ?? []} />
        )}
      </BankAccountsList>
    </CashflowAccountsGridWrap>
  );
}

const CashflowAccountAnchor = styled(Link)`
  &,
  &:hover,
  &:focus,
  &:active {
    color: inherit;
    text-decoration: none;
  }
`;

const CashflowAccountsGridWrap = styled.div`
  margin: 30px;
`;
