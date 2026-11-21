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
import intl from 'react-intl-universal';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import type { BankReconciliationResponse } from '@bigcapital/sdk-ts';
import { DashboardActionsBar, DashboardPageContent, Icon } from '@/components';
import { AccountDetailsBar } from '@/containers/CashFlow/AccountTransactions/AccountTransactionsDetailsBar';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';
import {
  formatReconciliationAccountPrompt,
  formatReconciliationDate,
  formatReconciliationPeriod,
  getStatusIntent,
  getReconciliationErrorMessage,
  getReconciliationStatusLabel,
} from '@/containers/CashFlow/AccountTransactions/Reconciliation/utils';
import { useAccount, useCashflowAccounts } from '@/hooks/query';
import { useBankReconciliations } from '@/hooks/query/banking';

/**
 * Reconciliation history of a single bank account.
 */
export function ReconciliationsListPage() {
  const { accountId: accountIdParam } = useParams<{ accountId: string }>();
  const accountId = Number(accountIdParam);
  const history = useHistory();

  const {
    data: account,
    isLoading: isAccountLoading,
    isFetching: isAccountFetching,
    refetch: refetchAccount,
  } = useAccount(accountId);
  const { data: accounts } = useCashflowAccounts();
  const supportedAccounts = (accounts ?? []).filter(
    (account) => account.isReconciliationSupported,
  );

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
    refetchAccount();
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
            text={intl.get('banking.reconciliation.back_to_account')}
            onClick={handleBackClick}
          />
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="refresh-16" iconSize={14} />}
            text={intl.get('banking.reconciliation.refresh')}
            onClick={handleRefreshClick}
            loading={isFetching || isAccountFetching}
          />
        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}>
          {meta?.hasInProgress && meta.inProgressId ? (
            <Button
              minimal
              icon={<Icon icon="play-16" iconSize={16} />}
              text={intl.get('banking.reconciliation.resume')}
              onClick={handleResumeClick}
              data-testId="resume-reconciliation"
            />
          ) : (
            <Button
              intent={Intent.PRIMARY}
              icon={<Icon icon="plus" iconSize={16} />}
              text={intl.get('banking.reconciliation.new')}
              onClick={handleStartClick}
              data-testId="new-reconciliation"
            />
          )}
        </NavbarGroup>
      </DashboardActionsBar>

      <AccountDetailsBar
        accounts={supportedAccounts}
        accountId={accountId}
        accountName={account?.name ?? meta?.accountName}
        formattedAmount={
          account?.formattedAmount ?? meta?.formattedAccountAmount
        }
        bankBalanceFormatted={
          account?.bankBalanceFormatted || meta?.formattedBankBalance || '—'
        }
        isLoading={isAccountLoading}
        onAccountSelect={(id) =>
          history.push(`/cashflow-accounts/${id}/reconciliations`)
        }
      />

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
              title={intl.get('banking.reconciliation.list_error_title')}
            >
              {getReconciliationErrorMessage(error, 'list_error')}
              <div style={{ marginTop: 12 }}>
                <Button
                  text={intl.get('banking.reconciliation.retry')}
                  onClick={() => refetch()}
                />
              </div>
            </Callout>
          </ContentWrap>
        )}

        {!isLoading && meta && !meta.isSupported && (
          <ContentWrap>
            <Callout
              intent={Intent.WARNING}
              title={intl.get('banking.reconciliation.unavailable')}
            >
              {meta.unsupportedReason ||
                intl.get('banking.reconciliation.unavailable_hint')}
            </Callout>
          </ContentWrap>
        )}

        {!isLoading && meta && meta.isSupported && (
          <ContentWrap>
            {reconciliations.length === 0 ? (
              <EmptyState>
                <EmptyTitle>
                  {intl.get('banking.reconciliation.empty_history')}
                </EmptyTitle>
                <EmptyDescription>
                  {formatReconciliationAccountPrompt(meta.accountName)}
                </EmptyDescription>
                <Button
                  intent={Intent.PRIMARY}
                  icon={<Icon icon="plus" iconSize={16} />}
                  text={intl.get('banking.reconciliation.start')}
                  onClick={handleStartClick}
                />
              </EmptyState>
            ) : (
              <TableCard>
                <Table>
                  <thead>
                    <tr>
                      <th className="reconciled">
                        {intl.get('report.reconciliation_status.reconciled')}
                      </th>
                      <th>{intl.get('banking.reconciliation.period_title')}</th>
                      <th className="money">
                        {intl.get('banking.reconciliation.closing_balance')}
                      </th>
                      <th className="status">{intl.get('status')}</th>
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
                          {formatReconciliationDate(
                            reconciliation.reconciledAt,
                          ) || '—'}
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
                            {getReconciliationStatusLabel(
                              reconciliation.status,
                            )}
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
