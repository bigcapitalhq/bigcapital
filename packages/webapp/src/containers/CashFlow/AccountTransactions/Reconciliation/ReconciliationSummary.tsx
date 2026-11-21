import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getReconciliationDifference } from './utils';
import type { BankReconciliationResponse } from '@bigcapital/sdk-ts';
import { Money, MoneyInputGroup } from '@/components';

interface ReconciliationSummaryProps {
  reconciliation: BankReconciliationResponse;
  endingBalance: string;
  clearedBalance: number;
  currencyCode?: string | null;
  isEditable?: boolean;
  onEndingBalanceChange?: (value: string) => void;
}

export function ReconciliationSummary({
  reconciliation,
  endingBalance,
  clearedBalance,
  currencyCode,
  isEditable,
  onEndingBalanceChange,
}: ReconciliationSummaryProps) {
  const parsedEndingBalance =
    endingBalance.trim() !== '' ? Number(endingBalance) : null;
  const hasEndingBalance =
    parsedEndingBalance !== null && Number.isFinite(parsedEndingBalance);
  const difference = getReconciliationDifference(
    parsedEndingBalance,
    clearedBalance,
  );
  const isBalanced = hasEndingBalance && Math.abs(difference) <= 0.005;

  return (
    <SummaryWrap>
      <SummaryColumn>
        <SummaryLabel>
          {intl.get('banking.reconciliation.beginning_balance')}
        </SummaryLabel>
        <SummaryValue>
          <Money
            amount={reconciliation.beginningBalance}
            currency={currencyCode}
          />
        </SummaryValue>
        <SummaryHint>
          {intl.get('banking.reconciliation.from_register')}
        </SummaryHint>
      </SummaryColumn>

      <SummaryColumn>
        <SummaryLabel>
          {intl.get('banking.reconciliation.cleared_balance')}
        </SummaryLabel>
        <SummaryValue>
          <Money amount={clearedBalance} currency={currencyCode} />
        </SummaryValue>
        <SummaryHint>
          {intl.get('banking.reconciliation.cleared_balance_hint')}
        </SummaryHint>
      </SummaryColumn>

      <SummaryColumn>
        <SummaryLabel>
          {intl.get('banking.reconciliation.ending_balance')}
        </SummaryLabel>
        {isEditable ? (
          <MoneyInputGroup
            id="reconciliation-ending-balance"
            aria-label={intl.get('banking.reconciliation.ending_balance')}
            value={endingBalance}
            onChange={(value) => onEndingBalanceChange?.(value ?? '')}
          />
        ) : (
          <SummaryValue>
            {hasEndingBalance ? (
              <Money amount={parsedEndingBalance} currency={currencyCode} />
            ) : (
              '—'
            )}
          </SummaryValue>
        )}
        <SummaryHint>
          {intl.get('banking.reconciliation.from_statement')}
        </SummaryHint>
      </SummaryColumn>

      <SummaryColumn>
        <SummaryLabel>
          {intl.get('banking.reconciliation.difference')}
        </SummaryLabel>
        <SummaryValue>
          {hasEndingBalance ? (
            <Money amount={difference} currency={currencyCode} />
          ) : (
            '—'
          )}
        </SummaryValue>
        <SummaryHint>
          {!hasEndingBalance
            ? intl.get('banking.reconciliation.enter_ending_balance')
            : isBalanced
              ? intl.get('banking.reconciliation.ready')
              : 'Check more transactions or update the ending balance'}
        </SummaryHint>
      </SummaryColumn>
    </SummaryWrap>
  );
}

const SummaryWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(160px, 1fr));
  gap: 24px;
`;

const SummaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SummaryLabel = styled.div`
  font-size: 11px;
  color: var(--x-recon-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const SummaryValue = styled.div`
  font-size: 19px;
  font-weight: 600;
  color: var(--x-recon-text);
`;

const SummaryHint = styled.div`
  font-size: 11px;
  color: var(--x-recon-text-muted);
`;
