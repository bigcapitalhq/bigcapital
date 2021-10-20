import React from 'react';
import { isNull } from 'lodash';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BankAccountsList, BankAccount } from '../../../components';
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

function CashflowAccountsGridItems({ accounts }) {
  return accounts.map((account) => (
    <Link to={`/cashflow-accounts/${account.id}/transactions`}>
      <BankAccount
        title={account.name}
        code={account.code}
        balance={!isNull(account.amount) ? account.formattedAmount : '-'}
        type={'cash'}
      />
    </Link>
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
