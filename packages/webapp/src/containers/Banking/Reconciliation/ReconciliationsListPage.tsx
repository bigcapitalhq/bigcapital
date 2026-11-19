import {
  Alignment,
  Button,
  Callout,
  Classes,
  Intent,
  NavbarDivider,
  NavbarGroup,
  Spinner,
  Tag,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import type { BankReconciliationResponse } from '@bigcapital/sdk-ts';
import { DashboardActionsBar, DashboardPageContent, Icon } from '@/components';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';
import {
  formatReconciledDate,
  formatReconciliationPeriod,
  getStatusIntent,
} from '@/containers/CashFlow/AccountTransactions/Reconciliation/utils';
import { useBankReconciliations } from '@/hooks/query/banking';

/**
 * Reconciliation history of a single bank account.
 */
export function ReconciliationsListPage() {
  const { accountId: accountIdParam } = useParams<{ accountId: string }>();
  const accountId = Number(accountIdParam);
  const history = useHistory();

  const {
    data: listResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useBankReconciliations(accountId);

  const reconciliations = listResponse?.data ?? [];
  const meta = listResponse?.meta;

  const handleBackClick = () => {
    history.push(`/cashflow-accounts/${accountId}/transactions`);
  };

  const handleRefreshClick = () => {
    refetch();
  };

  const handleStartClick = () => {
    history.push(`/reconcile?accountId=${accountId}`);
  };

  const handleResumeClick = () => {
    if (!meta?.inProgressId) return;

    history.push(`/reconcile/${accountId}/${meta.inProgressId}`);
  };

  const handleRowClick = (reconciliation: BankReconciliationResponse) => {
    history.push(
      `/cashflow-accounts/${accountId}/reconciliations/${reconciliation.id}`,
    );
  };

  return (
    <ReconciliationTheme>
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="arrow-left" iconSize={16} />}
            text={'Back to account'}
            onClick={handleBackClick}
          />
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="refresh-16" iconSize={14} />}
            text={'Refresh'}
            onClick={handleRefreshClick}
            loading={isFetching}
          />
        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}>
          {meta?.hasInProgress && meta.inProgressId ? (
            <Button
              minimal
              icon={<Icon icon="play-16" iconSize={16} />}
              text={'Resume reconciliation'}
              onClick={handleResumeClick}
              data-testId="resume-reconciliation"
            />
          ) : (
            <Button
              intent={Intent.PRIMARY}
              icon={<Icon icon="plus" iconSize={16} />}
              text={'New reconciliation'}
              onClick={handleStartClick}
              data-testId="new-reconciliation"
            />
          )}
        </NavbarGroup>
      </DashboardActionsBar>

      <DashboardPageContent>
        {isLoading && (
          <LoadingWrap>
            <Spinner size={28} />
          </LoadingWrap>
        )}

        {!isLoading && (error || !meta) && (
          <ContentWrap>
            <Callout
              intent={Intent.DANGER}
              title="Unable to load reconciliations"
            >
              {error?.message ||
                'The reconciliation details for this account could not be loaded.'}
              <div style={{ marginTop: 12 }}>
                <Button text="Retry" onClick={() => refetch()} />
              </div>
            </Callout>
          </ContentWrap>
        )}

        {!isLoading && meta && !meta.isSupported && (
          <ContentWrap>
            <Callout intent={Intent.WARNING} title="Reconciliation unavailable">
              {meta.unsupportedReason ||
                'This account does not support reconciliation yet.'}
            </Callout>
          </ContentWrap>
        )}

        {!isLoading && meta && meta.isSupported && (
          <ContentWrap>
            {reconciliations.length === 0 ? (
              <EmptyState>
                <EmptyTitle>No reconciliations yet</EmptyTitle>
                <EmptyDescription>
                  Reconcile {meta.accountName} against your bank statement to
                  keep the books accurate.
                </EmptyDescription>
                <Button
                  intent={Intent.PRIMARY}
                  icon={<Icon icon="plus" iconSize={16} />}
                  text="Start reconciliation"
                  onClick={handleStartClick}
                />
              </EmptyState>
            ) : (
              <TableCard>
                <Table>
                  <thead>
                    <tr>
                      <th className="reconciled">Reconciled</th>
                      <th>Reconciliation Period</th>
                      <th className="money">Closing Balance</th>
                      <th className="status">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reconciliations.map((reconciliation) => (
                      <tr
                        key={reconciliation.id}
                        onClick={() => handleRowClick(reconciliation)}
                        data-testId="reconciliation-list-row"
                      >
                        <td className="reconciled">
                          {formatReconciledDate(reconciliation.reconciledAt) ||
                            '—'}
                        </td>
                        <td>
                          {formatReconciliationPeriod(
                            reconciliation.startDate,
                            reconciliation.endDate,
                          )}
                        </td>
                        <td className="money">
                          {reconciliation.formattedEndingBalance || '—'}
                        </td>
                        <td className="status">
                          <Tag
                            minimal
                            intent={getStatusIntent(reconciliation.status)}
                          >
                            {reconciliation.statusLabel}
                          </Tag>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableCard>
            )}
          </ContentWrap>
        )}
      </DashboardPageContent>
    </ReconciliationTheme>
  );
}

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

const ContentWrap = styled.div`
  padding: 20px 20px 30px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 60px 24px;
  border: 1px solid var(--x-recon-border);
  border-radius: 4px;
  background: var(--x-recon-surface);
`;

const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const EmptyDescription = styled.div`
  max-width: 420px;
  font-size: 13px;
  color: var(--x-recon-text-muted);
  margin-bottom: 8px;
`;

const TableCard = styled.div`
  overflow-x: auto;
  border: 1px solid var(--x-recon-border);
  border-radius: 4px;
  background: var(--x-recon-surface);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: var(--x-recon-text);

  th,
  td {
    padding: 11px 14px;
    font-size: 13px;
    border-bottom: 1px solid var(--x-recon-border-light);
    text-align: left;
    vertical-align: middle;
  }

  th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--x-recon-text-muted);
    font-weight: 600;
    background: var(--x-recon-table-header-background);
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background: var(--x-recon-table-row-hover);
  }

  td.money,
  th.money {
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  th.reconciled,
  td.reconciled {
    width: 150px;
    white-space: nowrap;
  }

  th.status,
  td.status {
    width: 130px;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;
