import {
  Button,
  Callout,
  ControlGroup,
  FormGroup,
  InputGroup,
  Intent,
  Spinner,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { BankAccountSelect } from './BankAccountSelect';
import type {
  BankingAccountsListResponse,
  BankReconciliationsListResponse,
} from '@bigcapital/sdk-ts';
import { Alert, InputPrependText, MoneyInputGroup } from '@/components';
import { formatReconciliationDate } from '@/containers/CashFlow/AccountTransactions/Reconciliation/utils';

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
        <StepTitle>
          {intl.get('banking.reconciliation.statement_details')}
        </StepTitle>
        <StepSubtitle>
          {intl.get('banking.reconciliation.statement_details_hint')}
        </StepSubtitle>
      </StepHeader>

      <BankAccountFormGroup
        label={intl.get('banking.reconciliation.bank_account')}
        labelFor="reconcile-bank-account"
      >
        <BankAccountSelect
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelect={onAccountSelect}
          disabled={isSubmitting}
        />
      </BankAccountFormGroup>

      {!selectedAccountId && (
        <Hint>{intl.get('banking.reconciliation.account_hint')}</Hint>
      )}

      {selectedAccountId && isLoading && !meta && (
        <LoadingRow>
          <Spinner size={20} />
          <span>{intl.get('banking.reconciliation.loading_account')}</span>
        </LoadingRow>
      )}

      {meta && !meta.isSupported && (
        <Callout
          intent={Intent.DANGER}
          title={intl.get('banking.reconciliation.unavailable')}
        >
          {meta.unsupportedReason ||
            intl.get('banking.reconciliation.unavailable_hint')}
        </Callout>
      )}

      {meta && meta.isSupported && meta.hasInProgress && (
        <>
          <Alert
            title={intl.get('banking.reconciliation.in_progress')}
            intent={Intent.PRIMARY}
          >
            <p>{intl.get('banking.reconciliation.resume_hint')}</p>
          </Alert>
          <Actions>
            <FooterButton
              type="button"
              minimal
              intent={Intent.PRIMARY}
              text={intl.get('banking.reconciliation.resume')}
              onClick={() => meta.inProgressId && onResume(meta.inProgressId)}
              data-testId="resume-reconciliation"
            />
          </Actions>
        </>
      )}

      {meta && meta.isSupported && !meta.hasInProgress && (
        <form onSubmit={handleSubmit}>
          <BalanceRow>
            <BalanceItem>
              <BalanceLabel>
                {intl.get('banking.reconciliation.beginning_balance')}
              </BalanceLabel>
              <BalanceValue>{meta.formattedBeginningBalance}</BalanceValue>
              <BalanceHint>
                {intl.get('banking.reconciliation.beginning_balance_hint')}
              </BalanceHint>
            </BalanceItem>
            <BalanceItem>
              <BalanceLabel>
                {intl.get('banking.reconciliation.book_balance')}
              </BalanceLabel>
              <BalanceValue>{meta.formattedAccountAmount}</BalanceValue>
              <BalanceHint>
                {intl.get('banking.reconciliation.book_balance_hint')}
              </BalanceHint>
            </BalanceItem>
            {meta.uncategorizedTransactionsCount > 0 && (
              <BalanceItem>
                <BalanceLabel>
                  {intl.get(
                    'banking.reconciliation.uncategorized_transactions',
                  )}
                </BalanceLabel>
                <BalanceValue>
                  {intl.get('banking.reconciliation.number', {
                    count: meta.uncategorizedTransactionsCount,
                  })}
                </BalanceValue>
                <BalanceHint>
                  {intl.get('banking.reconciliation.categorize_hint')}
                </BalanceHint>
              </BalanceItem>
            )}
          </BalanceRow>

          <FormGrid>
            <FormGroup
              label={intl.get('banking.reconciliation.ending_balance')}
              labelFor="reconcile-ending-balance"
              helperText={intl.get(
                'banking.reconciliation.ending_balance_hint',
              )}
            >
              <ControlGroup>
                <InputPrependText text={meta.currencyCode} />
                <MoneyInputGroup
                  id="reconcile-ending-balance"
                  value={endingBalance}
                  onChange={(value) => onEndingBalanceChange(value ?? '')}
                  required
                />
              </ControlGroup>
            </FormGroup>

            <FormGroup
              label={intl.get('banking.reconciliation.ending_date')}
              labelFor="reconcile-end-date"
              helperText={intl.get('banking.reconciliation.ending_date_hint')}
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
              label={intl.get('banking.reconciliation.period_start')}
              helperText={intl.get('banking.reconciliation.period_start_hint')}
            >
              <PeriodStartText>
                {formatReconciliationDate(meta.suggestedStartDate)}
              </PeriodStartText>
            </FormGroup>
          </FormGrid>

          <Actions>
            <FooterButton
              type="submit"
              intent={Intent.PRIMARY}
              text={intl.get('banking.reconciliation.start')}
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
  border-radius: 5px;
  background: var(--x-recon-surface);
`;

const BankAccountFormGroup = styled(FormGroup)`
  &.bp4-form-group {
    margin-bottom: 30px;
  }
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
  gap: 50px;
  margin-bottom: 25px;
  padding-bottom: 25px;
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

const PeriodStartText = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  color: var(--x-recon-text-muted);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const FooterButton = styled(Button)`
  min-width: 100px;
`;
