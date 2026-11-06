import {
  Button,
  ButtonGroup,
  Callout,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Spinner,
  Tag,
} from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { ReconciliationSummary } from './ReconciliationSummary';
import { ReconciliationTransactionsTable } from './ReconciliationTransactionsTable';
import {
  filterTransactions,
  getReconciliationDifference,
  isReconciliationBalanced,
} from './utils';
import type { ReconciliationTransactionFilter } from './utils';
import type {
  BankReconciliationDetailResponse,
  BankReconciliationTransactionResponse,
} from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import {
  useFinishBankReconciliation,
  useUpdateBankReconciliation,
} from '@/hooks/query/banking';
import { useDialogActions } from '@/hooks/state/dashboard';

interface ReconciliationWorkspaceProps {
  detail: BankReconciliationDetailResponse;
  accountId: number;
  accountName?: string;
  currencyCode?: string | null;
  onUndo: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}

export function ReconciliationWorkspace({
  detail,
  accountId,
  accountName,
  currencyCode,
  onUndo,
  onDelete,
  onRefresh,
}: ReconciliationWorkspaceProps) {
  const reconciliation = detail.reconciliation;
  const readOnly = !reconciliation.isInProgress;

  const [selectedKeys, setSelectedKeys] = React.useState<string[]>(
    detail.transactions
      .filter((transaction) => transaction.isChecked)
      .map((transaction) => transaction.key),
  );
  const [endingBalance, setEndingBalance] = React.useState<number | null>(
    reconciliation.endingBalance ?? null,
  );
  const [filter, setFilter] =
    React.useState<ReconciliationTransactionFilter>('all');

  const { openDialog } = useDialogActions();

  const { mutateAsync: updateReconciliation, isPending: isSaving } =
    useUpdateBankReconciliation();
  const { mutateAsync: finishReconciliation, isPending: isFinishing } =
    useFinishBankReconciliation();

  const transactionsByKey = React.useMemo(
    () =>
      new Map(
        detail.transactions.map((transaction) => [
          transaction.key,
          transaction,
        ]),
      ),
    [detail.transactions],
  );

  const selectedTransactions = selectedKeys
    .map((key) => transactionsByKey.get(key))
    .filter(
      (transaction): transaction is BankReconciliationTransactionResponse =>
        Boolean(transaction),
    );

  const clearedBalance = readOnly
    ? Number(reconciliation.clearedBalance)
    : Number(reconciliation.beginningBalance) +
      selectedTransactions.reduce(
        (total, transaction) =>
          total + (transaction.debit - transaction.credit),
        0,
      );

  const hasEndingBalance =
    endingBalance !== null && Number.isFinite(endingBalance);
  const difference = readOnly
    ? Number(reconciliation.difference)
    : getReconciliationDifference(endingBalance, clearedBalance);
  const isBalanced = readOnly
    ? Math.abs(difference) <= 0.005
    : hasEndingBalance &&
      isReconciliationBalanced(endingBalance, clearedBalance);

  const handleToggle = (key: string) => {
    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  const handleToggleAll = (keys: string[], checked: boolean) => {
    setSelectedKeys((current) => {
      if (checked) {
        return Array.from(new Set([...current, ...keys]));
      }
      return current.filter((key) => !keys.includes(key));
    });
  };

  const buildTransactionsPayload = () =>
    selectedTransactions.map((transaction) => ({
      referenceType: transaction.referenceType,
      referenceId: transaction.referenceId,
      index: transaction.index,
    }));

  const handleSave = () => {
    updateReconciliation({
      id: reconciliation.id,
      body: {
        endingBalance: endingBalance ?? undefined,
        transactions: buildTransactionsPayload(),
      },
    })
      .then(() => {
        AppToaster.show({
          message: 'Reconciliation saved.',
          intent: Intent.SUCCESS,
        });
        onRefresh();
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: error.message || 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  const handleFinish = () => {
    if (!hasEndingBalance || !isBalanced) return;

    finishReconciliation({
      id: reconciliation.id,
      body: {
        endingBalance: endingBalance as number,
        transactions: buildTransactionsPayload(),
      },
    })
      .then(() => {
        AppToaster.show({
          message: 'The account has been reconciled.',
          intent: Intent.SUCCESS,
        });
        onRefresh();
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: error.message || 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  const handleMoneyIn = (transactionType: string) => {
    openDialog('money-in', {
      account_id: accountId,
      account_type: transactionType,
      account_name: accountName,
    });
  };

  const handleMoneyOut = (transactionType: string) => {
    openDialog('money-out', {
      account_id: accountId,
      account_type: transactionType,
      account_name: accountName,
    });
  };

  const filteredCount = filterTransactions(detail.transactions, filter).length;
  const showEmpty = filteredCount === 0;

  if (!reconciliation) {
    return (
      <LoadingWrap>
        <Spinner size={24} />
      </LoadingWrap>
    );
  }

  return (
    <WorkspaceWrap>
      <WorkspaceHeader>
        <div>
          <WorkspaceTitle>
            {reconciliation.isInProgress
              ? 'Reconciliation in progress'
              : reconciliation.isReconciled
                ? 'Reconciled'
                : 'Voided reconciliation'}
          </WorkspaceTitle>
          <WorkspaceSubtitle>
            {reconciliation.formattedStartDate} –{' '}
            {reconciliation.formattedEndDate}
            {reconciliation.reconciledAt
              ? ` · Completed ${reconciliation.reconciledAt}`
              : ''}
          </WorkspaceSubtitle>
        </div>

        <WorkspaceActions>
          <ButtonGroup>
            <Button
              icon="refresh"
              minimal
              onClick={onRefresh}
              title="Refresh transactions"
            />
            <Button
              icon="floppy-disk"
              text="Save for later"
              minimal
              onClick={handleSave}
              loading={isSaving}
              disabled={readOnly}
            />
            <Button
              icon="tick"
              text="Reconcile"
              intent={Intent.PRIMARY}
              onClick={handleFinish}
              loading={isFinishing}
              disabled={readOnly || !isBalanced}
              data-testId="finish-reconciliation"
            />
          </ButtonGroup>

          {reconciliation.isReconciled && (
            <Button
              icon="undo"
              text="Undo"
              intent={Intent.WARNING}
              onClick={onUndo}
            />
          )}
          {(reconciliation.isInProgress || reconciliation.isVoided) &&
            detail.meta.canDelete && (
              <Button
                icon="trash"
                text="Delete"
                intent={Intent.DANGER}
                onClick={onDelete}
              />
            )}
        </WorkspaceActions>
      </WorkspaceHeader>

      <ReconciliationSummary
        reconciliation={reconciliation}
        endingBalance={endingBalance}
        clearedBalance={clearedBalance}
        currencyCode={currencyCode}
        isEditable={!readOnly}
        onEndingBalanceChange={setEndingBalance}
      />

      {detail.meta.uncategorizedTransactionsCount > 0 && (
        <Callout
          intent={Intent.WARNING}
          style={{ margin: '14px 15px 0' }}
          title="Uncategorized bank transactions"
        >
          You have {detail.meta.uncategorizedTransactionsCount} uncategorized
          bank transactions. Categorize or match them before reconciling for the
          best result.
        </Callout>
      )}

      {detail.meta.changedTransactions.length > 0 && (
        <Callout
          intent={Intent.WARNING}
          style={{ margin: '14px 15px 0' }}
          title="Previously reconciled transactions changed"
        >
          {detail.meta.changedTransactions.length} transaction(s) from a
          previous reconciliation have changed. Review them or undo the previous
          reconciliation before continuing.
        </Callout>
      )}

      <Toolbar>
        <FilterGroup>
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            text={`All (${detail.transactions.length})`}
          />
          <FilterButton
            active={filter === 'payments'}
            onClick={() => setFilter('payments')}
            text={`Payments (${filterTransactions(detail.transactions, 'payments').length})`}
          />
          <FilterButton
            active={filter === 'deposits'}
            onClick={() => setFilter('deposits')}
            text={`Deposits (${filterTransactions(detail.transactions, 'deposits').length})`}
          />
        </FilterGroup>

        {!readOnly && (
          <ButtonGroup>
            <Popover
              minimal
              content={
                <Menu>
                  <MenuDivider title="Money in" />
                  <MenuItem
                    text="Owner contribution"
                    onClick={() => handleMoneyIn('owner_contribution')}
                  />
                  <MenuItem
                    text="Other income"
                    onClick={() => handleMoneyIn('other_income')}
                  />
                  <MenuItem
                    text="Transfer from account"
                    onClick={() => handleMoneyIn('transfer_from_account')}
                  />
                  <MenuDivider title="Money out" />
                  <MenuItem
                    text="Owner drawings"
                    onClick={() => handleMoneyOut('owner_drawing')}
                  />
                  <MenuItem
                    text="Expense"
                    onClick={() => handleMoneyOut('other_expense')}
                  />
                  <MenuItem
                    text="Transfer to account"
                    onClick={() => handleMoneyOut('transfer_to_account')}
                  />
                </Menu>
              }
              placement="bottom-end"
            >
              <Button icon="plus" text="Add transaction" minimal />
            </Popover>
          </ButtonGroup>
        )}
      </Toolbar>

      {showEmpty ? (
        <EmptyWrap>No transactions in this reconciliation.</EmptyWrap>
      ) : (
        <ReconciliationTransactionsTable
          transactions={detail.transactions}
          selectedKeys={
            readOnly ? detail.transactions.map((t) => t.key) : selectedKeys
          }
          filter={filter}
          readOnly={readOnly}
          isLoading={isSaving || isFinishing}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
        />
      )}

      <SummaryFooter>
        <FooterItem>
          <span>Selected</span>
          <strong>
            {readOnly ? detail.transactions.length : selectedKeys.length}
          </strong>
        </FooterItem>
        <FooterItem>
          <span>Difference</span>
          <Tag intent={isBalanced ? Intent.SUCCESS : Intent.WARNING}>
            {difference.toFixed(2)}
          </Tag>
        </FooterItem>
      </SummaryFooter>
    </WorkspaceWrap>
  );
}

const WorkspaceWrap = styled.div`
  margin: 16px 15px 0;
  border: 1px solid var(--x-border-color, #e1e8ed);
  border-radius: 4px;
  background: var(--color-white, #fff);
  overflow: hidden;
`;

const WorkspaceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--x-border-color-light, #eef1f4);
`;

const WorkspaceTitle = styled.h3`
  margin: 0 0 2px;
  font-size: 16px;
  font-weight: 600;
`;

const WorkspaceSubtitle = styled.div`
  font-size: 12px;
  color: var(--x-text-color-muted, #738091);
`;

const WorkspaceActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--x-border-color-light, #eef1f4);
`;

const FilterGroup = styled(ButtonGroup)`
  display: inline-flex;
`;

function FilterButton({
  active,
  text,
  onClick,
}: {
  active: boolean;
  text: string;
  onClick: () => void;
}) {
  return <Button small active={active} text={text} onClick={onClick} minimal />;
}

const EmptyWrap = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: var(--x-text-color-muted, #738091);
`;

const SummaryFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  padding: 10px 16px;
  border-top: 1px solid var(--x-border-color-light, #eef1f4);
  font-size: 13px;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--x-text-color-muted, #738091);
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;
