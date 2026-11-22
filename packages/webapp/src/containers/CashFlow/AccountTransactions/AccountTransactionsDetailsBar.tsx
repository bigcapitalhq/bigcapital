import {
  Popover,
  Menu,
  Position,
  Button,
  MenuItem,
  Classes,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import type { BankingAccountsListResponse } from '@bigcapital/sdk-ts';
import { Icon } from '@/components';
import { useAppShellContext } from '@/components/AppShell/AppContentShell/AppContentShellProvider';
import { NS } from '@/constants/classes';

interface AccountDetailsBarProps {
  accounts: BankingAccountsListResponse;
  accountId: number;
  accountName?: string;
  formattedAmount?: string;
  bankBalanceFormatted?: string;
  isLoading: boolean;
  showBalances?: boolean;
  onAccountSelect: (accountId: number) => void;
}

export function AccountDetailsBar({
  accounts,
  accountId,
  accountName,
  formattedAmount,
  bankBalanceFormatted,
  isLoading,
  showBalances = true,
  onAccountSelect,
}: AccountDetailsBarProps) {
  return (
    <AccountTransactionDetailsWrap>
      {isLoading ? (
        <AccountTransactionsDetailsBarSkeleton />
      ) : (
        <>
          <Popover
            content={
              <AccountSwitchMenu>
                {accounts.map((account) => (
                  <AccountSwitchMenuItem
                    key={account.id}
                    name={account.name}
                    balance={account.formattedAmount}
                    uncategorizedTransactionsCount={
                      account.uncategorizedTransactionsCount
                    }
                    onClick={() => onAccountSelect(account.id)}
                    active={account.id === accountId}
                  />
                ))}
              </AccountSwitchMenu>
            }
            position={Position.BOTTOM_LEFT}
            minimal
          >
            <AccountSwitchButtonBase
              minimal
              disabled={!accounts.length}
              rightIcon={<Icon icon="caret-down-16" iconSize={16} />}
            >
              <AccountSwitchText>
                {accountName ?? intl.get('select_account')}
              </AccountSwitchText>
            </AccountSwitchButtonBase>
          </Popover>
          {showBalances && (
            <>
              <AccountBalanceItemWrap>
                {intl.get('cash_flow_transaction.balance_in_bigcapital')}
                <AccountBalanceAmount>{formattedAmount}</AccountBalanceAmount>
              </AccountBalanceItemWrap>
              <AccountBalanceItemWrap>
                {intl.get('banking.reconciliation.bank_balance')}
                <AccountBalanceAmount>
                  {bankBalanceFormatted}
                </AccountBalanceAmount>
              </AccountBalanceItemWrap>
            </>
          )}
        </>
      )}
    </AccountTransactionDetailsWrap>
  );
}

function AccountTransactionsDetailsBarSkeleton() {
  return (
    <React.Fragment>
      <DetailsBarSkeletonBase className={Classes.SKELETON}>
        X
      </DetailsBarSkeletonBase>
      <DetailsBarSkeletonBase className={Classes.SKELETON}>
        X
      </DetailsBarSkeletonBase>
    </React.Fragment>
  );
}

export function AccountTransactionsDetailsBar() {
  const { push } = useHistory();
  const { hideAside } = useAppShellContext();
  const {
    cashflowAccounts,
    accountId,
    currentAccount,
    isCurrentAccountLoading,
  } = useAccountTransactionsContext();

  return (
    <AccountDetailsBar
      accounts={cashflowAccounts}
      accountId={accountId}
      accountName={currentAccount?.name}
      formattedAmount={currentAccount?.formattedAmount}
      bankBalanceFormatted={currentAccount?.bankBalanceFormatted}
      isLoading={isCurrentAccountLoading}
      showBalances={hideAside}
      onAccountSelect={(id) => push(`/cashflow-accounts/${id}/transactions`)}
    />
  );
}

interface AccountSwitchMenuItemProps {
  name: string;
  balance?: string;
  uncategorizedTransactionsCount?: number;
  active?: boolean;
  onClick?: () => void;
}

function AccountSwitchMenuItem({
  name,
  balance,
  uncategorizedTransactionsCount,
  active,
  onClick,
}: AccountSwitchMenuItemProps) {
  return (
    <MenuItem
      label={balance}
      active={active}
      onClick={onClick}
      text={
        <React.Fragment>
          <AccountSwitchItemName>{name}</AccountSwitchItemName>
          <AccountSwitchItemTransactions>
            {intl.get('cash_flow_transaction.switch_item', {
              value: uncategorizedTransactionsCount ?? 0,
            })}
          </AccountSwitchItemTransactions>

          <AccountSwitchItemUpdatedAt></AccountSwitchItemUpdatedAt>
        </React.Fragment>
      }
    />
  );
}

const DetailsBarSkeletonBase = styled.div`
  letter-spacing: 10px;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 8px;
  width: 140px;
`;

const AccountBalanceItemWrap = styled.div`
  margin-left: 18px;
`;

const AccountTransactionDetailsWrap = styled.div`
  display: flex;
  background: var(--color-bank-transactions-details-bar-background);
  color: var(--color-bank-transactions-details-bar-text);
  border-bottom: 1px solid var(--color-bank-transactions-details-bar-divider);
  padding: 0 22px;
  height: 42px;
  align-items: center;
`;
const AccountSwitchText = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const AccountBalanceAmount = styled.span`
  font-weight: 600;
  display: inline-block;
  margin-left: 10px;
`;

const AccountSwitchItemName = styled.div`
  font-weight: 600;
`;
const AccountSwitchItemTransactions = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const AccountSwitchItemUpdatedAt = styled.div`
  font-size: 12px;
  opacity: 0.5;
`;

const AccountSwitchMenu = styled(Menu)`
  max-height: 320px;
  overflow-y: auto;
`;

const AccountSwitchButtonBase = styled(Button)`
  .${NS}-button-text {
    margin-right: 5px;
  }
`;
