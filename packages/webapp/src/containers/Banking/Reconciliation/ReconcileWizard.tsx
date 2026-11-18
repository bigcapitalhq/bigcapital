import {
  Button,
  ButtonGroup,
  Callout,
  Intent,
  Spinner,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ReconcileStatementStep } from './ReconcileStatementStep';
import { AppToaster } from '@/components';
import { Stepper } from '@/components/Stepper';
import { ReconciliationDetailPanel } from '@/containers/CashFlow/AccountTransactions/Reconciliation/ReconciliationDetailPanel';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';
import { useAppQueryString } from '@/hooks';
import { useCashflowAccounts } from '@/hooks/query';
import {
  useBankReconciliation,
  useBankReconciliations,
  useCreateBankReconciliation,
} from '@/hooks/query/banking';

/**
 * Two-step reconciliation wizard: statement details and transaction matching.
 */
export function ReconcileWizard() {
  const history = useHistory();
  const [query, setQuery] = useAppQueryString();

  const [step, setStep] = React.useState(0);
  const [reconciliationId, setReconciliationId] = React.useState<number | null>(
    null,
  );
  const [endDate, setEndDate] = React.useState('');
  const [endingBalance, setEndingBalance] = React.useState('');
  const [formVersion, setFormVersion] = React.useState(0);

  const queryAccountId = Number(query.accountId);
  const selectedAccountId =
    Number.isFinite(queryAccountId) && queryAccountId > 0
      ? queryAccountId
      : null;

  const { data: accounts, isLoading: isAccountsLoading } =
    useCashflowAccounts();

  const bankAccounts = React.useMemo(
    () => (accounts ?? []).filter((account) => account.accountType === 'bank'),
    [accounts],
  );

  const {
    data: listResponse,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useBankReconciliations(selectedAccountId ?? 0);
  const meta = listResponse?.meta;

  const {
    data: detail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    error: detailError,
    refetch: refetchDetail,
  } = useBankReconciliation(reconciliationId);

  const { mutateAsync: createReconciliation, isPending: isCreating } =
    useCreateBankReconciliation();

  const metaAccountId = meta?.accountId;
  const metaSuggestedStartDate = meta?.suggestedStartDate;
  const metaSuggestedEndDate = meta?.suggestedEndDate;
  const metaBankBalance = meta?.bankBalance;

  React.useEffect(() => {
    if (!metaAccountId || !metaSuggestedEndDate) return;

    setEndDate(metaSuggestedEndDate);
    setEndingBalance(
      metaBankBalance !== null && metaBankBalance !== undefined
        ? String(metaBankBalance)
        : '',
    );
  }, [
    metaAccountId,
    metaSuggestedStartDate,
    metaSuggestedEndDate,
    metaBankBalance,
    formVersion,
  ]);

  const handleAccountSelect = (accountId: number) => {
    if (accountId !== selectedAccountId) {
      setStep(0);
      setReconciliationId(null);
      setEndDate('');
      setEndingBalance('');
    }
    setQuery({ accountId });
  };

  const handleStart = () => {
    if (
      !selectedAccountId ||
      !meta ||
      !meta.isSupported ||
      meta.hasInProgress
    ) {
      return;
    }

    const parsedEndingBalance = Number(endingBalance);
    if (
      !endDate ||
      endingBalance.trim() === '' ||
      Number.isNaN(parsedEndingBalance)
    ) {
      return;
    }

    createReconciliation({
      accountId: selectedAccountId,
      startDate: meta.suggestedStartDate,
      endDate,
      endingBalance: parsedEndingBalance,
    })
      .then((response) => {
        setReconciliationId(response.id);
        setStep(1);
        AppToaster.show({
          message: 'Reconciliation started.',
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: error.message || 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  const handleResume = (id: number) => {
    setReconciliationId(id);
    setStep(1);
  };

  const handleReset = () => {
    setStep(0);
    setReconciliationId(null);
    setEndDate('');
    setEndingBalance('');
    setFormVersion((version) => version + 1);
    refetchList();
  };

  if (isAccountsLoading) {
    return (
      <LoadingWrap>
        <Spinner size={28} />
      </LoadingWrap>
    );
  }

  if (!bankAccounts.length) {
    return (
      <ReconciliationTheme>
        <Callout intent={Intent.WARNING} title="No bank accounts">
          Add a bank account first to start reconciling it against your bank
          statements.
          <div style={{ marginTop: 12 }}>
            <Button
              intent={Intent.PRIMARY}
              text="Go to bank accounts"
              onClick={() => history.push('/cashflow-accounts')}
            />
          </div>
        </Callout>
      </ReconciliationTheme>
    );
  }

  return (
    <ReconciliationTheme>
      <Stepper active={step}>
        <Stepper.Step label="Statement details">
          <ReconcileStatementStep
            accounts={bankAccounts}
            selectedAccountId={selectedAccountId}
            meta={meta}
            isLoading={isListLoading || isListFetching}
            isSubmitting={isCreating}
            endDate={endDate}
            endingBalance={endingBalance}
            onAccountSelect={handleAccountSelect}
            onEndDateChange={setEndDate}
            onEndingBalanceChange={setEndingBalance}
            onSubmit={handleStart}
            onResume={handleResume}
          />
        </Stepper.Step>

        <Stepper.Step label="Reconcile">
          <StepTwoWrap>
            <StepTwoHeader>
              <div>
                <StepTwoTitle>Reconcile transactions</StepTwoTitle>
                <StepTwoSubtitle>
                  Check off the transactions that appear on your bank statement.
                </StepTwoSubtitle>
              </div>

              <ButtonGroup>
                <Button
                  minimal
                  icon="arrow-left"
                  text="Statement details"
                  onClick={() => setStep(0)}
                  disabled={isDetailFetching}
                />
                {detail && !detail.reconciliation.isInProgress && (
                  <Button
                    icon="plus"
                    text="Start another reconciliation"
                    onClick={handleReset}
                  />
                )}
              </ButtonGroup>
            </StepTwoHeader>

            {isDetailLoading && (
              <LoadingWrap>
                <Spinner size={28} />
              </LoadingWrap>
            )}

            {detailError && (
              <Callout intent={Intent.DANGER} title="Unable to load">
                {detailError.message || 'Unable to load the reconciliation.'}
                <div style={{ marginTop: 12 }}>
                  <Button text="Retry" onClick={() => refetchDetail()} />
                </div>
              </Callout>
            )}

            {detail && !detailError && (
              <ReconciliationDetailPanel
                detail={detail}
                accountId={detail.reconciliation.accountId}
                accountName={meta?.accountName}
                currencyCode={meta?.currencyCode}
                onRefresh={() => {
                  refetchList();
                  refetchDetail();
                }}
                onDeleted={handleReset}
              />
            )}
          </StepTwoWrap>
        </Stepper.Step>
      </Stepper>
    </ReconciliationTheme>
  );
}

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const StepTwoWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StepTwoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--x-recon-border);
  border-radius: 4px;
  background: var(--x-recon-surface);
`;

const StepTwoTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
`;

const StepTwoSubtitle = styled.div`
  font-size: 13px;
  color: var(--x-recon-text-muted);
`;
