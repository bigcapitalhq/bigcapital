import { Callout, Intent } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { formatMoney, getReconciliationDifference } from './utils';
import type { BankReconciliationResponse } from '@bigcapital/sdk-ts';

interface ReconciliationSummaryProps {
  reconciliation: BankReconciliationResponse;
  endingBalance: number | null;
  clearedBalance: number;
  currencyCode?: string | null;
  isEditable?: boolean;
  onEndingBalanceChange?: (value: number | null) => void;
}

export function ReconciliationSummary({
  reconciliation,
  endingBalance,
  clearedBalance,
  currencyCode,
  isEditable,
  onEndingBalanceChange,
}: ReconciliationSummaryProps) {
  const hasEndingBalance =
    endingBalance !== null &&
    endingBalance !== undefined &&
    Number.isFinite(endingBalance);
  const difference = getReconciliationDifference(endingBalance, clearedBalance);
  const isBalanced = hasEndingBalance && Math.abs(difference) <= 0.005;

  return (
    <SummaryWrap>
      <SummaryCard>
        <SummaryLabel>Beginning balance</SummaryLabel>
        <SummaryValue>{reconciliation.formattedBeginningBalance}</SummaryValue>
        <SummaryHint>From Bigcapital register</SummaryHint>
      </SummaryCard>

      <SummaryCard>
        <SummaryLabel>Cleared balance</SummaryLabel>
        <SummaryValue>{formatMoney(clearedBalance, currencyCode)}</SummaryValue>
        <SummaryHint>Beginning + checked transactions</SummaryHint>
      </SummaryCard>

      <SummaryCard>
        <SummaryLabel>Statement ending balance</SummaryLabel>
        {isEditable ? (
          <EndingBalanceInput
            type="number"
            step="0.01"
            value={endingBalance ?? ''}
            onChange={(event) => {
              const value = event.currentTarget.value;
              onEndingBalanceChange?.(value === '' ? null : Number(value));
            }}
          />
        ) : (
          <SummaryValue>
            {reconciliation.formattedEndingBalance ||
              formatMoney(endingBalance, currencyCode)}
          </SummaryValue>
        )}
        <SummaryHint>From your bank statement</SummaryHint>
      </SummaryCard>

      <SummaryCard
        $balanced={isBalanced}
        $hasDifference={hasEndingBalance && difference !== 0}
      >
        <SummaryLabel>Difference</SummaryLabel>
        <SummaryValue>
          {hasEndingBalance ? formatMoney(difference, currencyCode) : '—'}
        </SummaryValue>
        <SummaryHint>
          {!hasEndingBalance
            ? 'Enter the statement ending balance'
            : isBalanced
              ? 'Ready to reconcile'
              : 'Check more transactions or update the ending balance'}
        </SummaryHint>
      </SummaryCard>

      {hasEndingBalance && !isBalanced && (
        <Callout
          intent={Intent.WARNING}
          style={{ gridColumn: '1 / -1' }}
          title="The reconciliation is not balanced yet"
        >
          The statement ending balance and the cleared balance must match before
          you can finish the reconciliation.
        </Callout>
      )}
    </SummaryWrap>
  );
}

const SummaryWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 15px 0;
`;

const SummaryCard = styled.div<{
  $balanced?: boolean;
  $hasDifference?: boolean;
}>`
  padding: 14px 16px;
  border: 1px solid
    ${({ $balanced, $hasDifference }) =>
      $hasDifference
        ? $balanced
          ? 'var(--x-recon-success)'
          : 'var(--x-recon-warning)'
        : 'var(--x-recon-border)'};
  border-radius: 4px;
  background: var(--x-recon-surface);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
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

const EndingBalanceInput = styled.input`
  font-size: 17px;
  font-weight: 600;
  width: 100%;
  padding: 4px 6px;
  border: 1px solid var(--color-ui-input-border);
  border-radius: 3px;
  background: var(--color-ui-input-background);
  color: var(--x-recon-text);
  outline: none;
`;
