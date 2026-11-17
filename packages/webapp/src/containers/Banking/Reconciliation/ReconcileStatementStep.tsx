import {
  Button,
  Callout,
  FormGroup,
  InputGroup,
  Intent,
  Spinner,
} from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { BankAccountSelect } from './BankAccountSelect';
import type {
  BankingAccountsListResponse,
  BankReconciliationsListResponse,
} from '@bigcapital/sdk-ts';

interface ReconcileStatementStepProps {
  accounts: BankingAccountsListResponse;
  selectedAccountId: number | null;
  meta?: BankReconciliationsListResponse['meta'];
  isLoading: boolean;
  isSubmitting: boolean;
  endDate: string;
  endingBalance: string;
  onAccountSelect: (accountId: number) => void;
  onEndDateChange: (value: string) => void;
  onEndingBalanceChange: (value: string) => void;
  onSubmit: () => void;
  onResume: (reconciliationId: number) => void;
}

/**
 * First wizard step: pick the account and enter the statement details.
 */
export function ReconcileStatementStep({
  accounts,
  selectedAccountId,
  meta,
  isLoading,
  isSubmitting,
  endDate,
  endingBalance,
  onAccountSelect,
  onEndDateChange,
  onEndingBalanceChange,
  onSubmit,
  onResume,
}: ReconcileStatementStepProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const canContinue =
    Boolean(meta?.isSupported) &&
    !meta?.hasInProgress &&
    Boolean(endDate) &&
    endingBalance.trim() !== '' &&
    !Number.isNaN(Number(endingBalance));

  return (
    <Panel>
      <StepHeader>
        <StepTitle>Statement details</StepTitle>
        <StepSubtitle>
          Select the bank account and enter the closing balance and date from
          your bank statement.
        </StepSubtitle>
      </StepHeader>

      <FormGroup label="Bank account" labelFor="reconcile-bank-account">
        <BankAccountSelect
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelect={onAccountSelect}
          disabled={isSubmitting}
        />
      </FormGroup>

      {!selectedAccountId && (
        <Hint>Choose the bank account you want to reconcile.</Hint>
      )}

      {selectedAccountId && isLoading && !meta && (
        <LoadingRow>
          <Spinner size={20} />
          <span>Loading account details...</span>
        </LoadingRow>
      )}

      {meta && !meta.isSupported && (
        <Callout intent={Intent.DANGER} title="Reconciliation unavailable">
          {meta.unsupportedReason ||
            'This account does not support reconciliation yet.'}
        </Callout>
      )}

      {meta && meta.isSupported && meta.hasInProgress && (
        <Callout intent={Intent.WARNING} title="Reconciliation in progress">
          <p>
            You have an unfinished reconciliation for this account. Resume it to
            keep checking transactions and finish when the difference is zero.
          </p>
          <Button
            intent={Intent.PRIMARY}
            text="Resume reconciliation"
            onClick={() => meta.inProgressId && onResume(meta.inProgressId)}
            data-testId="resume-reconciliation"
          />
        </Callout>
      )}

      {meta && meta.isSupported && !meta.hasInProgress && (
        <form onSubmit={handleSubmit}>
          <BalanceRow>
            <BalanceItem>
              <BalanceLabel>Beginning balance</BalanceLabel>
              <BalanceValue>{meta.formattedBeginningBalance}</BalanceValue>
              <BalanceHint>
                Carried from the previous reconciliation or the account
                register.
              </BalanceHint>
            </BalanceItem>
            <BalanceItem>
              <BalanceLabel>Balance in Bigcapital</BalanceLabel>
              <BalanceValue>{meta.formattedAccountAmount}</BalanceValue>
              <BalanceHint>Current balance of the account.</BalanceHint>
            </BalanceItem>
            {meta.uncategorizedTransactionsCount > 0 && (
              <BalanceItem>
                <BalanceLabel>Uncategorized transactions</BalanceLabel>
                <BalanceValue>
                  {meta.uncategorizedTransactionsCount}
                </BalanceValue>
                <BalanceHint>
                  Categorize or match them before reconciling for the best
                  result.
                </BalanceHint>
              </BalanceItem>
            )}
          </BalanceRow>

          <FormGrid>
            <FormGroup
              label="Statement ending balance"
              labelFor="reconcile-ending-balance"
              helperText="The closing balance shown on your bank statement."
            >
              <InputGroup
                id="reconcile-ending-balance"
                type="number"
                step="0.01"
                value={endingBalance}
                onChange={(event) =>
                  onEndingBalanceChange(event.currentTarget.value)
                }
                required
              />
            </FormGroup>

            <FormGroup
              label="Statement ending date"
              labelFor="reconcile-end-date"
              helperText="The closing date shown on your bank statement."
            >
              <InputGroup
                id="reconcile-end-date"
                type="date"
                value={endDate}
                min={meta.suggestedStartDate}
                onChange={(event) => onEndDateChange(event.currentTarget.value)}
                required
              />
            </FormGroup>

            <FormGroup
              label="Period start"
              labelFor="reconcile-start-date"
              helperText="The first day after the previous reconciliation."
            >
              <ReadOnlyValue id="reconcile-start-date">
                {meta.suggestedStartDate}
              </ReadOnlyValue>
            </FormGroup>
          </FormGrid>

          <Actions>
            <Button
              type="submit"
              intent={Intent.PRIMARY}
              text="Continue"
              loading={isSubmitting}
              disabled={!canContinue}
              data-testId="start-reconciliation"
            />
          </Actions>
        </form>
      )}
    </Panel>
  );
}

const Panel = styled.div`
  padding: 18px;
  border: 1px solid var(--x-recon-border);
  border-radius: 4px;
  background: var(--x-recon-surface);
`;

const StepHeader = styled.div`
  margin-bottom: 16px;
`;

const StepTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
`;

const StepSubtitle = styled.div`
  font-size: 13px;
  color: var(--x-recon-text-muted);
`;

const Hint = styled.div`
  font-size: 13px;
  color: var(--x-recon-text-muted);
`;

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--x-recon-text-muted);
`;

const BalanceRow = styled.div`
  display: flex;
  gap: 28px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--x-recon-border-light);
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
  color: var(--x-recon-text-muted);
`;

const BalanceValue = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const BalanceHint = styled.div`
  font-size: 11px;
  color: var(--x-recon-text-muted);
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
  border: 1px solid var(--color-ui-input-border);
  border-radius: 3px;
  background: var(--color-ui-input-background);
  color: var(--x-recon-text-muted);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;
