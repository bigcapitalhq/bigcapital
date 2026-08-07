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
import { Icon } from '@/components';
import { useAppShellContext } from '@/components/AppShell/AppContentShell/AppContentShellProvider';

function AccountSwitchButton() {
  const { currentAccount } = useAccountTransactionsContext();

  return (
    <AccountSwitchButtonBase
      minimal={true}
      rightIcon={<Icon icon={'caret-down-16'} iconSize={16} />}
    >
      <AccountSwitchText>{currentAccount?.name}</AccountSwitchText>
    </AccountSwitchButtonBase>
  );
}

function AccountSwitchItem() {
  const { push } = useHistory();
  const { cashflowAccounts, accountId } = useAccountTransactionsContext();

  // Handle item click.
  const handleItemClick = (account: { id: number }) =>
    push(`/cashflow-accounts/${account.id}/transactions`);

  const items = cashflowAccounts.map((account) => (
    <AccountSwitchMenuItem
      key={account.id}
      name={account.name}
      balance={account.formattedAmount}
      onClick={() => handleItemClick(account)}
      active={account.id === accountId}
    />
  ));

  return (
    <Popover
      content={<Menu>{items}</Menu>}
      position={Position.BOTTOM_LEFT}
      minimal={true}
    >
      <AccountSwitchButton />
    </Popover>
  );
}

function AccountBalanceItem() {
  const { currentAccount } = useAccountTransactionsContext();

  return (
    <AccountBalanceItemWrap>
      {intl.get('cash_flow_transaction.balance_in_bigcapital')} {''}
      <AccountBalanceAmount>
        {currentAccount?.formattedAmount}
      </AccountBalanceAmount>
    </AccountBalanceItemWrap>
  );
}

function AccountBankBalanceItem() {
  const { currentAccount } = useAccountTransactionsContext();

  return (
    <AccountBalanceItemWrap>
      Balance in Bank Account
      <AccountBalanceAmount>
        {currentAccount?.bankBalanceFormatted}
      </AccountBalanceAmount>
    </AccountBalanceItemWrap>
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

function AccountTransactionsDetailsContent() {
  const { hideAside } = useAppShellContext();

  return (
    <React.Fragment>
      <AccountSwitchItem />

      {/** Hide some details once the aside opens to preserve space on details bar. */}
      {hideAside && <AccountBalanceItem />}
      {hideAside && <AccountBankBalanceItem />}
    </React.Fragment>
  );
}

export function AccountTransactionsDetailsBar() {
  const { isCurrentAccountLoading } = useAccountTransactionsContext();

  return (
    <AccountTransactionDetailsWrap>
      {isCurrentAccountLoading ? (
        <AccountTransactionsDetailsBarSkeleton />
      ) : (
        <AccountTransactionsDetailsContent />
      )}
    </AccountTransactionDetailsWrap>
  );
}

interface AccountSwitchMenuItemProps {
  name: string;
  balance?: string;
  active?: boolean;
  onClick?: () => void;
}

function AccountSwitchMenuItem({
  name,
  balance,
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
          <AccountSwitchItemTranscations>
            {intl.get('cash_flow_transaction.switch_item', { value: '25' })}
          </AccountSwitchItemTranscations>

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
const AccountSwitchItemTranscations = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const AccountSwitchItemUpdatedAt = styled.div`
  font-size: 12px;
  opacity: 0.5;
`;

const AccountSwitchButtonBase = styled(Button)`
  .bp4-button-text {
    margin-right: 5px;
  }
`;
