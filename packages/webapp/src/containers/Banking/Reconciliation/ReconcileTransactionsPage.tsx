import {
  Alignment,
  Button,
  Callout,
  Intent,
  NavbarDivider,
  NavbarGroup,
  Spinner,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { DashboardActionsBar, DashboardPageContent } from '@/components';
import { ReconciliationDetailPanel } from '@/containers/CashFlow/AccountTransactions/Reconciliation/ReconciliationDetailPanel';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';
import {
  useBankReconciliation,
  useBankReconciliations,
} from '@/hooks/query/banking';

interface ReconcileTransactionsRouteParams {
  accountId: string;
  reconciliationId: string;
}

/**
 * Active reconciliation workspace for a single bank reconciliation.
 */
export function ReconcileTransactionsPage() {
  const { accountId: accountIdParam, reconciliationId: reconciliationIdParam } =
    useParams<ReconcileTransactionsRouteParams>();
  const history = useHistory();
  const [actionsContainer, setActionsContainer] =
    React.useState<HTMLDivElement | null>(null);

  const accountId = Number(accountIdParam);
  const reconciliationId = Number(reconciliationIdParam);
  const isValidAccountId = Number.isFinite(accountId) && accountId > 0;
  const isValidReconciliationId =
    Number.isFinite(reconciliationId) && reconciliationId > 0;

  const {
    data: listResponse,
    isLoading: isListLoading,
    refetch: refetchList,
  } = useBankReconciliations(isValidAccountId ? accountId : 0);
  const meta = listResponse?.meta;

  const {
    data: detail,
    isLoading: isDetailLoading,
    error,
    refetch: refetchDetail,
  } = useBankReconciliation(isValidReconciliationId ? reconciliationId : null);

  const resolvedAccountId = detail?.reconciliation.accountId ?? accountId;

  const handleBackClick = () => {
    history.push(
      resolvedAccountId
        ? `/reconcile?accountId=${resolvedAccountId}`
        : '/reconcile',
    );
  };

  const handleStartAnotherClick = () => {
    history.push(`/reconcile?accountId=${resolvedAccountId}`);
  };

  const handleRefresh = () => {
    refetchList();
    refetchDetail();
  };

  const handleDeleted = () => {
    handleStartAnotherClick();
  };

  if (!isValidAccountId || !isValidReconciliationId) {
    return (
      <ReconciliationTheme>
        <DashboardPageContent>
          <ContentWrap>
            <Callout intent={Intent.DANGER} title="Invalid reconciliation">
              The reconciliation link is not valid.
              <div style={{ marginTop: 12 }}>
                <Button
                  text="Back to reconcile"
                  onClick={() => history.push('/reconcile')}
                />
              </div>
            </Callout>
          </ContentWrap>
        </DashboardPageContent>
      </ReconciliationTheme>
    );
  }

  const isLoading = isDetailLoading || isListLoading;

  return (
    <ReconciliationTheme>
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            minimal
            icon="arrow-left"
            text="Statement details"
            onClick={handleBackClick}
          />
          <NavbarDivider />
          {detail && !detail.reconciliation.isInProgress && (
            <Button
              icon="plus"
              text="Start another reconciliation"
              onClick={handleStartAnotherClick}
            />
          )}
        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}>
          <ActionsSlot ref={setActionsContainer} />
        </NavbarGroup>
      </DashboardActionsBar>

      <DashboardPageContent>
        {isLoading && (
          <LoadingWrap>
            <Spinner size={28} />
          </LoadingWrap>
        )}

        {!isLoading && error && (
          <ContentWrap>
            <Callout intent={Intent.DANGER} title="Unable to load">
              {error.message || 'Unable to load the reconciliation.'}
              <div style={{ marginTop: 12 }}>
                <Button text="Retry" onClick={() => refetchDetail()} />
              </div>
            </Callout>
          </ContentWrap>
        )}

        {!isLoading && !error && detail && (
          <ReconciliationDetailPanel
            detail={detail}
            accountId={resolvedAccountId}
            accountName={meta?.accountName ?? detail.meta.accountName}
            currencyCode={meta?.currencyCode}
            actionsContainer={actionsContainer}
            onRefresh={handleRefresh}
            onDeleted={handleDeleted}
          />
        )}
      </DashboardPageContent>
    </ReconciliationTheme>
  );
}

const ActionsSlot = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

const ContentWrap = styled.div`
  padding: 4px 20px 30px;
`;
