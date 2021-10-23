import React from 'react';
import { isNull } from 'lodash';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { BankAccountsList, BankAccount, If, Icon } from '../../../components';
import { useCashFlowAccountsContext } from './CashFlowAccountsProvider';

const CashflowAccountsGridWrap = styled.div`
  margin: 30px;
`;
const CASHFLOW_SKELETON_N = 4;

function CashflowAccountsSkeleton() {
  return [...Array(CASHFLOW_SKELETON_N)].map((e, i) => (
    <BankAccount
      title={'XXXXX'}
      code={'XXXXX'}
      balance={'XXXXXX'}
      cash={'cash'}
      loading={true}
    />
  ));
}

function getUpdatedBeforeText(createdAt) {
  return 'Updated before 2 years.';
}

function CashflowAccountsGridItems({ accounts }) {
  return accounts.map((account) => (
    <CashflowAccountAnchor to={`/cashflow-accounts/${account.id}/transactions`}>
      <BankAccount
        title={account.name}
        code={account.code}
        balance={!isNull(account.amount) ? account.formatted_amount : '-'}
        type={'cash'}
        contextMenuContent={CashflowAccountContextMenu}
        updatedBeforeText={getUpdatedBeforeText(account.createdAt)}
      />
    </CashflowAccountAnchor>
  ));
}

export default function CashflowAccountsGrid() {
  // Retrieve list context.
  const { cashflowAccounts, isCashFlowAccountsLoading } =
    useCashFlowAccountsContext();

  return (
    <CashflowAccountsGridWrap>
      <BankAccountsList>
        {isCashFlowAccountsLoading ? (
          <CashflowAccountsSkeleton />
        ) : (
          <CashflowAccountsGridItems accounts={cashflowAccounts} />
        )}
      </BankAccountsList>
    </CashflowAccountsGridWrap>
  );
}

function CashflowAccountContextMenu() {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
      />
      <MenuDivider />
      <MenuItem icon={<Icon icon="pen-18" />} text={intl.get('edit_account')} />
      <MenuDivider />
      <If condition={false}>
        <MenuItem
          text={intl.get('inactivate_account')}
          icon={<Icon icon="pause-16" iconSize={16} />}
        />
      </If>
      <If condition={!false}>
        <MenuItem
          text={intl.get('activate_account')}
          icon={<Icon icon="play-16" iconSize={16} />}
        />
      </If>
      <MenuItem
        text={intl.get('delete_account')}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent={Intent.DANGER}
      />
    </Menu>
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
