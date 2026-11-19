import { Button, Callout, Intent, Spinner } from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ReconcileStatementStep } from './ReconcileStatementStep';
import { AppToaster } from '@/components';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';
import { useAppQueryString } from '@/hooks';
import { useCashflowAccounts } from '@/hooks/query';
import {
  useBankReconciliations,
  useCreateBankReconciliation,
} from '@/hooks/query/banking';

/**
 * First step of the reconciliation flow: statement details.
 */
export function ReconcileWizard() {
  const history = useHistory();
  const [query, setQuery] = useAppQueryString();

  const [endDate, setEndDate] = React.useState('');
  const [endingBalance, setEndingBalance] = React.useState('');

  const queryAccountId = Number(query.accountId);
  const selectedAccountId =
    Number.isFinite(queryAccountId) && queryAccountId > 0
      ? queryAccountId
      : null;
  const queryReconciliationId = Number(query.reconciliationId);
  const selectedQueryReconciliationId =
    Number.isFinite(queryReconciliationId) && queryReconciliationId > 0
      ? queryReconciliationId
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
  } = useBankReconciliations(selectedAccountId ?? 0);
  const meta = listResponse?.meta;

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
  ]);

  // Forward legacy deep links to the dedicated reconciliation workspace page.
  React.useEffect(() => {
    if (!selectedAccountId || !selectedQueryReconciliationId) return;

    history.replace(
      `/reconcile/${selectedAccountId}/${selectedQueryReconciliationId}`,
    );
  }, [selectedAccountId, selectedQueryReconciliationId, history]);

  const handleAccountSelect = (accountId: number) => {
    if (accountId !== selectedAccountId) {
      setEndDate('');
      setEndingBalance('');
    }
    setQuery({ accountId, reconciliationId: undefined });
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
        AppToaster.show({
          message: 'Reconciliation started.',
          intent: Intent.SUCCESS,
        });
        history.push(`/reconcile/${selectedAccountId}/${response.id}`);
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: error.message || 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  const handleResume = (id: number) => {
    if (!selectedAccountId) return;

    history.push(`/reconcile/${selectedAccountId}/${id}`);
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
    </ReconciliationTheme>
  );
}

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;
