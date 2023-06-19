// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  Popover,
  Menu,
  Position,
  Button,
  MenuItem,
  Classes,
} from '@blueprintjs/core';
import { Icon } from '@/components';
import { useHistory } from 'react-router-dom';
import { curry } from 'lodash/fp';

import { useAccountTransactionsContext } from './AccountTransactionsProvider';

function AccountSwitchButton() {
  const { currentAccount } = useAccountTransactionsContext();

  return (
    <AccountSwitchButtonBase
      minimal={true}
      rightIcon={<Icon icon={'arrow-drop-down'} iconSize={24} />}
    >
      <AccountSwitchText>{currentAccount.name}</AccountSwitchText>
    </AccountSwitchButtonBase>
  );
}

function AccountSwitchItem() {
  const { push } = useHistory();
  const { cashflowAccounts, accountId } = useAccountTransactionsContext();

  // Handle item click.
  const handleItemClick = curry((account, event) => {
    push(`/cashflow-accounts/${account.id}/transactions`);
  });

  const items = cashflowAccounts.map((account) => (
    <AccountSwitchMenuItem
      name={account.name}
      balance={account.formatted_amount}
      onClick={handleItemClick(account)}
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
        {currentAccount.formatted_amount}
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
  return (
    <React.Fragment>
      <AccountSwitchItem />
      <AccountBalanceItem />
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

function AccountSwitchMenuItem({
  name,
  balance,
  transactionsNumber,
  ...restProps
}) {
  return (
    <MenuItem
      label={balance}
      text={
        <React.Fragment>
          <AccountSwitchItemName>{name}</AccountSwitchItemName>
          <AccountSwitchItemTransactions>
            {intl.get('cash_flow_transaction.switch_item', { value: '25' })}
          </AccountSwitchItemTransactions>

          <AccountSwitchItemUpdatedAt></AccountSwitchItemUpdatedAt>
        </React.Fragment>
      }
      {...restProps}
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
  color: #5f6d86;
`;

const AccountTransactionDetailsWrap = styled.div`
  display: flex;
  background: #fff;
  border-bottom: 1px solid #d2dce2;
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
  color: rgb(31, 50, 85);
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

const AccountSwitchButtonBase = styled(Button)`
  .bp3-button-text {
    margin-right: 5px;
  }
`;
