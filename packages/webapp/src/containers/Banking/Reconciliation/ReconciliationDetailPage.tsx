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
import intl from 'react-intl-universal';
import { useHistory, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import {
  AppToaster,
  DashboardActionsBar,
  DashboardPageContent,
  Icon,
} from '@/components';
import { CLASSES } from '@/constants';
import { ReconciliationTransactionsTable } from '@/containers/CashFlow/AccountTransactions/Reconciliation/ReconciliationTransactionsTable';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';
import {
  formatReconciliationDate,
  formatReconciliationPeriod,
  getStatusIntent,
  getReconciliationErrorMessage,
  getReconciliationStatusLabel,
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
          message: intl.get('banking.reconciliation.reopened'),
          intent: Intent.SUCCESS,
        });
        history.push(
          `/cashflow-accounts/${reconciliation.accountId}/reconciliations`,
        );
      })
      .catch((undoError: Error) => {
        setIsUndoOpen(false);
        AppToaster.show({
          message: getReconciliationErrorMessage(undoError, 'undo_error'),
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
            text={intl.get('banking.reconciliation.back_to_history')}
            onClick={handleBackClick}
          />
          <NavbarDivider />

          {canUndo && (
            <Button
              minimal
              icon="undo"
              intent={Intent.WARNING}
              text={intl.get('banking.reconciliation.undo_action')}
              onClick={() => setIsUndoOpen(true)}
              data-testId="undo-reconciliation"
            />
          )}

          {isInProgress && (
            <Button
              minimal
              icon={<Icon icon="play-16" iconSize={16} />}
              intent={Intent.PRIMARY}
              text={intl.get('banking.reconciliation.continue')}
              onClick={handleContinueClick}
            />
          )}

          <Button
            minimal
            icon={<Icon icon="print-16" iconSize={16} />}
            text={intl.get('print')}
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
              title={intl.get('banking.reconciliation.load_error_title')}
            >
              {getReconciliationErrorMessage(error, 'not_found')}
              <div style={{ marginTop: 12 }}>
                <Button
                  text={intl.get('banking.reconciliation.retry')}
                  onClick={() => refetch()}
                />
              </div>
            </Callout>
          </ContentWrap>
        )}

        {!isLoading && detail && reconciliation && (
          <ContentWrap id="reconciliation-print-area">
            <PageHeader>
              <div>
                <Title>
                  {meta?.accountName ||
                    intl.get('banking.reconciliation.detail_title')}
                </Title>
                <HeaderDetails className={CLASSES.TEXT_MUTED}>
                  <span>
                    {intl.get('banking.reconciliation.period_value', {
                      period: formatReconciliationPeriod(
                        reconciliation.startDate,
                        reconciliation.endDate,
                      ),
                    })}
                  </span>
                  <MetaLine>
                    <Tag
                      minimal
                      intent={getStatusIntent(reconciliation.status)}
                    >
                      {getReconciliationStatusLabel(reconciliation.status)}
                    </Tag>
                    {reconciliation.reconciledAt && (
                      <span>
                        {intl.get('banking.reconciliation.reconciled_on', {
                          date: formatReconciliationDate(
                            reconciliation.reconciledAt,
                          ),
                        })}
                      </span>
                    )}
                  </MetaLine>
                </HeaderDetails>
              </div>
            </PageHeader>

            {reconciliation.isVoided && (
              <Callout
                intent={Intent.DANGER}
                title={intl.get('banking.reconciliation.voided')}
              >
                {intl.get('banking.reconciliation.voided_hint')}
              </Callout>
            )}

            {reconciliation.isInProgress && (
              <Callout
                intent={Intent.WARNING}
                title={intl.get('banking.reconciliation.in_progress')}
              >
                {intl.get('banking.reconciliation.in_progress_hint')}
              </Callout>
            )}

            <SummaryGrid>
              <SummaryCard>
                <SummaryLabel>
                  {intl.get('banking.reconciliation.opening_balance')}
                </SummaryLabel>
                <SummaryValue>
                  {reconciliation.formattedBeginningBalance}
                </SummaryValue>
              </SummaryCard>

              <SummaryCard>
                <SummaryLabel>
                  {intl.get('banking.reconciliation.closing_balance')}
                </SummaryLabel>
                <SummaryValue>
                  {reconciliation.formattedEndingBalance || '—'}
                </SummaryValue>
              </SummaryCard>
            </SummaryGrid>

            <SectionHeader>
              <SectionTitle>{intl.get('transactions')}</SectionTitle>
              <SectionCount>
                {intl.get('banking.reconciliation.count', {
                  count: visibleTransactions.length,
                })}
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
                {intl.get('banking.reconciliation.no_linked_transactions')}
              </EmptyTransactions>
            )}
          </ContentWrap>
        )}
      </DashboardPageContent>

      <Alert
        isOpen={isUndoOpen}
        intent={Intent.WARNING}
        icon="undo"
        confirmButtonText={intl.get('banking.reconciliation.undo_action')}
        cancelButtonText={intl.get('cancel')}
        loading={isUndoing}
        onConfirm={handleConfirmUndo}
        onCancel={() => setIsUndoOpen(false)}
      >
        <p>
          {reconciliation &&
            intl.get('banking.reconciliation.undo_confirm', {
              period: formatReconciliationPeriod(
                reconciliation.startDate,
                reconciliation.endDate,
              ),
            })}
        </p>
        {!meta?.isLatest && (
          <p>{intl.get('banking.reconciliation.undo_cascade_hint')}</p>
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
  margin: 1rem 0 1.4rem;
  font-size: 12px;
`;

const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
`;

const HeaderDetails = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
`;

const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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

  & + & {
    border-inline-start: 1px solid var(--x-recon-border);
    padding-inline-start: 18px;
  }
`;

const SummaryLabel = styled.div`
  font-size: 11px;
  color: var(--x-recon-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.085em;
`;

const SummaryValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--x-recon-text);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
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
