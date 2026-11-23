import {
  Alignment,
  Button,
  Callout,
  Intent,
  NavbarGroup,
  Spinner,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { DashboardActionsBar, DashboardPageContent, Icon } from '@/components';
import { ReconciliationDetailPanel } from '@/containers/CashFlow/AccountTransactions/Reconciliation/ReconciliationDetailPanel';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';
import { getReconciliationErrorMessage } from '@/containers/CashFlow/AccountTransactions/Reconciliation/utils';
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
  const [endActionsContainer, setEndActionsContainer] =
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
            <Callout
              intent={Intent.DANGER}
              title={intl.get('banking.reconciliation.invalid_link')}
            >
              {intl.get('banking.reconciliation.invalid_link_hint')}
              <div style={{ marginTop: 12 }}>
                <Button
                  text={intl.get('banking.reconciliation.back_to_reconcile')}
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
          <ActionsSlot ref={setActionsContainer} />
        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}>
          <Button
            minimal
            icon="arrow-left"
            text={intl.get('banking.reconciliation.statement_details')}
            onClick={handleBackClick}
          />
          <Button
            minimal
            icon={<Icon icon="refresh-16" iconSize={16} />}
            text={intl.get('banking.reconciliation.reload')}
            onClick={handleRefresh}
          />
          {detail && !detail.reconciliation.isInProgress && (
            <Button
              icon="plus"
              text={intl.get('banking.reconciliation.start_another')}
              onClick={handleStartAnotherClick}
            />
          )}
          <ActionsSlot ref={setEndActionsContainer} />
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
            <Callout
              intent={Intent.DANGER}
              title={intl.get('banking.reconciliation.load_error_title')}
            >
              {getReconciliationErrorMessage(error, 'load_error')}
              <div style={{ marginTop: 12 }}>
                <Button
                  text={intl.get('banking.reconciliation.retry')}
                  onClick={() => refetchDetail()}
                />
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
            endActionsContainer={endActionsContainer}
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
