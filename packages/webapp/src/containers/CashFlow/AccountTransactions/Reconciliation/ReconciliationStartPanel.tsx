import {
  Button,
  Callout,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
} from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import type { BankReconciliationsListResponse } from '@bigcapital/sdk-ts';

interface ReconciliationStartPanelProps {
  meta: BankReconciliationsListResponse['meta'];
  isSubmitting?: boolean;
  onStart: (values: {
    startDate: string;
    endDate: string;
    endingBalance: number;
    notes?: string;
  }) => void;
  onResume: (id: number) => void;
}

export function ReconciliationStartPanel({
  meta,
  isSubmitting,
  onStart,
  onResume,
}: ReconciliationStartPanelProps) {
  const [startDate, setStartDate] = React.useState(meta.suggestedStartDate);
  const [endDate, setEndDate] = React.useState(meta.suggestedEndDate);
  const [endingBalance, setEndingBalance] = React.useState(
    meta.bankBalance !== null && meta.bankBalance !== undefined
      ? String(meta.bankBalance)
      : '',
  );
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    setStartDate(meta.suggestedStartDate);
    setEndDate(meta.suggestedEndDate);
    setEndingBalance(
      meta.bankBalance !== null && meta.bankBalance !== undefined
        ? String(meta.bankBalance)
        : '',
    );
  }, [meta.suggestedStartDate, meta.suggestedEndDate, meta.bankBalance]);

  if (meta.hasInProgress) {
    return (
      <Panel>
        <Callout intent={Intent.WARNING} title="Reconciliation in progress">
          You have an unfinished reconciliation for this account. Resume it to
          keep checking transactions and finish when the difference is zero.
        </Callout>
        <Actions>
          <Button
            intent={Intent.PRIMARY}
            text="Resume reconciliation"
            onClick={() => onResume(meta.inProgressId as number)}
            data-testId="resume-reconciliation"
          />
        </Actions>
      </Panel>
    );
  }

  if (!meta.isSupported) {
    return (
      <Panel>
        <Callout intent={Intent.DANGER} title="Reconciliation unavailable">
          {meta.unsupportedReason ||
            'This account does not support reconciliation yet.'}
        </Callout>
      </Panel>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!startDate || !endDate || endingBalance === '') return;

    onStart({
      startDate,
      endDate,
      endingBalance: Number(endingBalance),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Start a new reconciliation</PanelTitle>
        <PanelSubtitle>
          Enter the statement period and the ending balance from your bank
          statement.
        </PanelSubtitle>
      </PanelHeader>

      <BalanceRow>
        <BalanceItem>
          <BalanceLabel>Balance in Bigcapital</BalanceLabel>
          <BalanceValue>{meta.formattedAccountAmount}</BalanceValue>
        </BalanceItem>
        <BalanceItem>
          <BalanceLabel>Balance in bank account</BalanceLabel>
          <BalanceValue>{meta.formattedBankBalance || '—'}</BalanceValue>
        </BalanceItem>
        <BalanceItem>
          <BalanceLabel>Uncategorized transactions</BalanceLabel>
          <BalanceValue>{meta.uncategorizedTransactionsCount}</BalanceValue>
        </BalanceItem>
      </BalanceRow>

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup label="Start date" labelFor="reconciliation-start-date">
            {meta.lastReconciledEndDate ? (
              <ReadOnlyValue>{meta.suggestedStartDate}</ReadOnlyValue>
            ) : (
              <InputGroup
                id="reconciliation-start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.currentTarget.value)}
                required
              />
            )}
          </FormGroup>

          <FormGroup label="End date" labelFor="reconciliation-end-date">
            <InputGroup
              id="reconciliation-end-date"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.currentTarget.value)}
              required
            />
          </FormGroup>

          <FormGroup
            label="Statement ending balance"
            labelFor="reconciliation-ending-balance"
            helperText="The closing balance shown on your bank statement."
          >
            <InputGroup
              id="reconciliation-ending-balance"
              type="number"
              step="0.01"
              value={endingBalance}
              onChange={(event) => setEndingBalance(event.currentTarget.value)}
              required
            />
          </FormGroup>
        </FormGrid>

        <FormGroup label="Notes" labelFor="reconciliation-notes">
          <TextArea
            id="reconciliation-notes"
            value={notes}
            onChange={(event) => setNotes(event.currentTarget.value)}
            fill
            rows={2}
            placeholder="Optional note, e.g. November bank statement"
          />
        </FormGroup>

        {!meta.lastReconciledEndDate && meta.firstTransactionDate && (
          <Hint>
            The first reconciliation starts from the account&apos;s earliest
            transaction by default. If you pick a later start date, earlier
            transactions are treated as the opening balance.
          </Hint>
        )}

        <Actions>
          <Button
            type="submit"
            intent={Intent.PRIMARY}
            text="Start reconciliation"
            loading={isSubmitting}
            disabled={!endingBalance}
            data-testId="start-reconciliation"
          />
        </Actions>
      </form>
    </Panel>
  );
}

const Panel = styled.div`
  margin: 16px 15px 0;
  padding: 18px;
  border: 1px solid var(--x-border-color, #e1e8ed);
  border-radius: 4px;
  background: var(--color-white, #fff);
`;

const PanelHeader = styled.div`
  margin-bottom: 14px;
`;

const PanelTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
`;

const PanelSubtitle = styled.div`
  font-size: 13px;
  color: var(--x-text-color-muted, #738091);
`;

const BalanceRow = styled.div`
  display: flex;
  gap: 28px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--x-border-color-light, #eef1f4);
`;

const BalanceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BalanceLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--x-text-color-muted, #738091);
`;

const BalanceValue = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 16px;
`;

const ReadOnlyValue = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border: 1px solid var(--x-border-color, #d3d8de);
  border-radius: 3px;
  background: var(--x-input-disabled-background, #f6f7f9);
  color: var(--x-text-color-muted, #738091);
`;

const Hint = styled.div`
  font-size: 12px;
  color: var(--x-text-color-muted, #738091);
  margin-bottom: 12px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
`;
