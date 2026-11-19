import {
  Alert,
  Button,
  Callout,
  Intent,
  NavbarDivider,
  NavbarGroup,
  Spinner,
  Tag,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import {
  AppToaster,
  DashboardActionsBar,
  DashboardPageContent,
  Icon,
} from '@/components';
import { ReconciliationTransactionsTable } from '@/containers/CashFlow/AccountTransactions/Reconciliation/ReconciliationTransactionsTable';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';
import {
  formatReconciledDate,
  formatReconciliationPeriod,
  getStatusIntent,
} from '@/containers/CashFlow/AccountTransactions/Reconciliation/utils';
import {
  useBankReconciliation,
  useUndoBankReconciliation,
} from '@/hooks/query/banking';

/**
 * Read-only snapshot of a single bank reconciliation.
 */
export function ReconciliationDetailPage() {
  const { accountId: accountIdParam, reconciliationId: reconciliationIdParam } =
    useParams<{ accountId: string; reconciliationId: string }>();

  const accountId = Number(accountIdParam);
  const reconciliationId = Number(reconciliationIdParam);
  const history = useHistory();

  const [isUndoOpen, setIsUndoOpen] = React.useState(false);

  const {
    data: detail,
    isLoading,
    error,
    refetch,
  } = useBankReconciliation(reconciliationId);

  const { mutateAsync: undoReconciliation, isPending: isUndoing } =
    useUndoBankReconciliation();

  const reconciliation = detail?.reconciliation;
  const meta = detail?.meta;

  const visibleTransactions = React.useMemo(() => {
    if (!detail) return [];

    if (detail.reconciliation.isInProgress) {
      return detail.transactions.filter((transaction) => transaction.isChecked);
    }
    return detail.transactions;
  }, [detail]);

  React.useEffect(() => {
    const cleanup = () => {
      document.body.classList.remove('is-printing-reconciliation');
    };
    window.addEventListener('afterprint', cleanup);

    return () => {
      window.removeEventListener('afterprint', cleanup);
      cleanup();
    };
  }, []);

  const handleBackClick = () => {
    history.push(`/cashflow-accounts/${accountId}/reconciliations`);
  };

  const handleContinueClick = () => {
    history.push(`/reconcile/${accountId}/${reconciliationId}`);
  };

  const handlePrintClick = () => {
    document.body.classList.add('is-printing-reconciliation');
    window.print();
    document.body.classList.remove('is-printing-reconciliation');
  };

  const handleConfirmUndo = () => {
    if (!reconciliation) return;

    undoReconciliation({
      id: reconciliation.id,
      body: { cascade: !meta?.isLatest },
    })
      .then(() => {
        setIsUndoOpen(false);
        AppToaster.show({
          message: 'Reconciliation reopened.',
          intent: Intent.SUCCESS,
        });
        history.push(
          `/cashflow-accounts/${reconciliation.accountId}/reconciliations`,
        );
      })
      .catch((undoError: Error) => {
        setIsUndoOpen(false);
        AppToaster.show({
          message: undoError.message || 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  const canUndo = Boolean(meta?.canUndo);
  const isInProgress = Boolean(reconciliation?.isInProgress);

  return (
    <ReconciliationTheme>
      <ReconciliationPrintStyles />

      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            minimal
            icon={<Icon icon="arrow-left" iconSize={16} />}
            text={'Back to reconciliations'}
            onClick={handleBackClick}
          />
          <NavbarDivider />

          {canUndo && (
            <Button
              minimal
              icon="undo"
              intent={Intent.WARNING}
              text={'Undo Reconciliation'}
              onClick={() => setIsUndoOpen(true)}
              data-testId="undo-reconciliation"
            />
          )}

          {isInProgress && (
            <Button
              minimal
              icon={<Icon icon="play-16" iconSize={16} />}
              intent={Intent.PRIMARY}
              text={'Continue reconciliation'}
              onClick={handleContinueClick}
            />
          )}

          <Button
            minimal
            icon={<Icon icon="print-16" iconSize={16} />}
            text={'Print'}
            onClick={handlePrintClick}
            disabled={!detail}
            data-testId="print-reconciliation"
          />
        </NavbarGroup>
      </DashboardActionsBar>

      <DashboardPageContent>
        {isLoading && (
          <LoadingWrap>
            <Spinner size={28} />
          </LoadingWrap>
        )}

        {!isLoading && (error || !detail) && (
          <ContentWrap>
            <Callout
              intent={Intent.DANGER}
              title="Unable to load the reconciliation"
            >
              {error?.message ||
                'The reconciliation could not be found for this account.'}
              <div style={{ marginTop: 12 }}>
                <Button text="Retry" onClick={() => refetch()} />
              </div>
            </Callout>
          </ContentWrap>
        )}

        {!isLoading && detail && reconciliation && (
          <ContentWrap id="reconciliation-print-area">
            <PageHeader>
              <div>
                <Title>{meta?.accountName || 'Reconciliation'}</Title>
                <PeriodLine>
                  <PeriodLabel>Reconciliation Period:</PeriodLabel>{' '}
                  {formatReconciliationPeriod(
                    reconciliation.startDate,
                    reconciliation.endDate,
                  )}
                </PeriodLine>
                <MetaLine>
                  <Tag minimal intent={getStatusIntent(reconciliation.status)}>
                    {reconciliation.statusLabel}
                  </Tag>
                  {reconciliation.reconciledAt && (
                    <MetaText>
                      Reconciled on{' '}
                      {formatReconciledDate(reconciliation.reconciledAt)}
                    </MetaText>
                  )}
                </MetaLine>
              </div>
            </PageHeader>

            {reconciliation.isVoided && (
              <Callout intent={Intent.DANGER} title="Reconciliation voided">
                This reconciliation was voided and its reconciled transaction
                links have been removed.
              </Callout>
            )}

            {reconciliation.isInProgress && (
              <Callout
                intent={Intent.WARNING}
                title="Reconciliation in progress"
              >
                This reconciliation has not been completed yet. The transactions
                below are the ones currently selected.
              </Callout>
            )}

            <SummaryGrid>
              <SummaryCard>
                <SummaryLabel>Opening Balance</SummaryLabel>
                <SummaryValue>
                  {reconciliation.formattedBeginningBalance}
                </SummaryValue>
              </SummaryCard>

              <SummaryCard>
                <SummaryLabel>Closing Balance</SummaryLabel>
                <SummaryValue>
                  {reconciliation.formattedEndingBalance || '—'}
                </SummaryValue>
              </SummaryCard>
            </SummaryGrid>

            <SectionHeader>
              <SectionTitle>Transactions</SectionTitle>
              <SectionCount>
                {visibleTransactions.length}{' '}
                {visibleTransactions.length === 1
                  ? 'transaction'
                  : 'transactions'}
              </SectionCount>
            </SectionHeader>

            {visibleTransactions.length > 0 ? (
              <ReconciliationTransactionsTable
                transactions={visibleTransactions}
                selectedKeys={visibleTransactions.map(
                  (transaction) => transaction.key,
                )}
                filter="all"
                readOnly
                showStatus={false}
                flush
              />
            ) : (
              <EmptyTransactions>
                No transactions are linked to this reconciliation.
              </EmptyTransactions>
            )}
          </ContentWrap>
        )}
      </DashboardPageContent>

      <Alert
        isOpen={isUndoOpen}
        intent={Intent.WARNING}
        icon="undo"
        confirmButtonText="Undo reconciliation"
        cancelButtonText="Cancel"
        loading={isUndoing}
        onConfirm={handleConfirmUndo}
        onCancel={() => setIsUndoOpen(false)}
      >
        <p>
          Undo the reconciliation for{' '}
          <strong>
            {reconciliation &&
              formatReconciliationPeriod(
                reconciliation.startDate,
                reconciliation.endDate,
              )}
          </strong>
          ?
        </p>
        {!meta?.isLatest && (
          <p>
            This is not the latest reconciliation. Later reconciliations will
            also be voided so the account can be reconciled again.
          </p>
        )}
      </Alert>
    </ReconciliationTheme>
  );
}

const ReconciliationPrintStyles = createGlobalStyle`
  @page {
    margin: 16mm;
  }

  @media print {
    body.is-printing-reconciliation {
      overflow: visible !important;
      background: #fff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body.is-printing-reconciliation #sidebar,
    body.is-printing-reconciliation .dashboard__topbar,
    body.is-printing-reconciliation .dashboard__actions-bar,
    body.is-printing-reconciliation .Resizer,
    body.is-printing-reconciliation .Pane1 {
      display: none !important;
    }

    body.is-printing-reconciliation .dashboard-layout,
    body.is-printing-reconciliation .dashboard-layout__main,
    body.is-printing-reconciliation .SplitPane,
    body.is-printing-reconciliation .Pane,
    body.is-printing-reconciliation .dashboard-content,
    body.is-printing-reconciliation .dashboard__page,
    body.is-printing-reconciliation .dashboard__page-content {
      position: static !important;
      height: auto !important;
      min-height: 0 !important;
      width: auto !important;
      overflow: visible !important;
    }

    body.is-printing-reconciliation .Pane2 {
      left: 0 !important;
      width: 100% !important;
    }

    body.is-printing-reconciliation .dashboard__page-content {
      padding: 0 !important;
    }

    body.is-printing-reconciliation #reconciliation-print-area {
      --x-recon-surface: #fff;
      --x-recon-border: #d8dde3;
      --x-recon-border-light: #e6e9ed;
      --x-recon-text: #111827;
      --x-recon-text-muted: #4b5563;
      --x-recon-table-header-background: #f3f4f6;
      --x-recon-table-row-hover: transparent;
      --x-recon-table-row-selected: transparent;

      padding: 0 !important;
    }

    body.is-printing-reconciliation #reconciliation-print-area thead {
      display: table-header-group;
    }

    body.is-printing-reconciliation #reconciliation-print-area th {
      position: static !important;
    }

    body.is-printing-reconciliation #reconciliation-print-area table {
      width: 100% !important;
    }
  }
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

const ContentWrap = styled.div`
  padding: 4px 20px 30px;
`;

const PageHeader = styled.div`
  margin: 8px 0 16px;
`;

const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
`;

const PeriodLine = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const PeriodLabel = styled.span`
  font-weight: 600;
`;

const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const MetaText = styled.span`
  font-size: 12px;
  color: var(--x-recon-text-muted);
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 12px;
  max-width: 520px;
  margin-bottom: 20px;
`;

const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--x-recon-border);
  border-radius: 4px;
  background: var(--x-recon-surface);
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

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const SectionCount = styled.span`
  font-size: 12px;
  color: var(--x-recon-text-muted);
`;

const EmptyTransactions = styled.div`
  padding: 32px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--x-recon-text-muted);
  border: 1px solid var(--x-recon-border);
  border-radius: 4px;
  background: var(--x-recon-surface);
`;
