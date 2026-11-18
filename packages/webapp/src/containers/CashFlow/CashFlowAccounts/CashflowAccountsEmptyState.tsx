import React from 'react';
import styled from 'styled-components';
import { T } from '@/components';

/**
 * Cashflow accounts empty state.
 */
export function CashflowAccountsEmptyState() {
  return (
    <AccountsEmptyStateBase>
      <AccountsEmptyStateTitle>
        <T id={'cash_flow.accounts.no_results'} />
      </AccountsEmptyStateTitle>
    </AccountsEmptyStateBase>
  );
}

const AccountsEmptyStateBase = styled.div`
  flex: 1;
  width: 100%;
  text-align: center;
  margin: 2rem 0;
`;

const AccountsEmptyStateTitle = styled.h1`
  --x-text-color: #626b76;

  .bp4-dark & {
    --x-text-color: rgba(255, 255, 255, 0.6);
  }
  font-size: 18px;
  color: var(--x-text-color);
  opacity: 0.8;
  line-height: 1.6;
  font-weight: 500;
`;
