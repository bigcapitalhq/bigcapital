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
} from '@blueprintjs/core';
import React from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { ReconciliationSummary } from './ReconciliationSummary';
import { ReconciliationTransactionsTable } from './ReconciliationTransactionsTable';
import { getReconciliationDifference, isReconciliationBalanced } from './utils';
import type {
  BankReconciliationDetailResponse,
  BankReconciliationTransactionResponse,
} from '@bigcapital/sdk-ts';
import { AppToaster, Icon } from '@/components';
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
  actionsContainer?: HTMLElement | null;
  endActionsContainer?: HTMLElement | null;
}

export function ReconciliationWorkspace({
  detail,
  accountId,
  accountName,
  currencyCode,
  onUndo,
  onDelete,
  onRefresh,
  actionsContainer,
  endActionsContainer,
}: ReconciliationWorkspaceProps) {
  const reconciliation = detail.reconciliation;
  const readOnly = !reconciliation.isInProgress;

  const [selectedKeys, setSelectedKeys] = React.useState<string[]>(
    detail.transactions
      .filter((transaction) => transaction.isChecked)
      .map((transaction) => transaction.key),
  );
  const [endingBalance, setEndingBalance] = React.useState<string>(
    reconciliation.endingBalance !== null &&
      reconciliation.endingBalance !== undefined
      ? String(reconciliation.endingBalance)
      : '',
  );

  const endingBalanceValue = React.useMemo(() => {
    const value = endingBalance.trim();
    if (!value) return null;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }, [endingBalance]);

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

  const hasEndingBalance = endingBalanceValue !== null;
  const difference = readOnly
    ? Number(reconciliation.difference)
    : getReconciliationDifference(endingBalanceValue, clearedBalance);
  const isBalanced = readOnly
    ? Math.abs(difference) <= 0.005
    : hasEndingBalance &&
      isReconciliationBalanced(endingBalanceValue, clearedBalance);

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
        endingBalance: endingBalanceValue ?? undefined,
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
        endingBalance: endingBalanceValue as number,
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

  const actionsInBar = actionsContainer !== undefined;
  const showDelete =
    (reconciliation.isInProgress || reconciliation.isVoided) &&
    detail.meta.canDelete;

  const saveButton = (
    <Button
      icon="floppy-disk"
      text="Save for later"
      minimal
      onClick={handleSave}
      loading={isSaving}
      disabled={readOnly}
    />
  );

  const reconcileButton = (
    <Button
      icon="tick"
      text="Reconcile"
      minimal={actionsInBar}
      intent={Intent.PRIMARY}
      onClick={handleFinish}
      loading={isFinishing}
      disabled={readOnly || !isBalanced}
      data-testId="finish-reconciliation"
    />
  );

  const primaryActions = (
    <ButtonGroup>
      <Button
        icon={<Icon icon="refresh-16" iconSize={16} />}
        minimal
        onClick={onRefresh}
        title="Refresh transactions"
      />
      {saveButton}
      {reconcileButton}
    </ButtonGroup>
  );

  const addTransactionButton = !readOnly && (
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
  );

  const deleteButton = showDelete && (
    <Button
      icon="trash"
      text="Delete"
      minimal={actionsInBar}
      intent={Intent.DANGER}
      onClick={onDelete}
    />
  );

  const undoButton = reconciliation.isReconciled && (
    <Button icon="undo" text="Undo" intent={Intent.WARNING} onClick={onUndo} />
  );

  const inlineActions = (
    <>
      {primaryActions}
      {deleteButton}
    </>
  );

  const barActions = (
    <>
      {reconcileButton}
      {addTransactionButton}
      {deleteButton}
      {saveButton}
    </>
  );

  if (!reconciliation) {
    return (
      <LoadingWrap>
        <Spinner size={24} />
      </LoadingWrap>
    );
  }

  return (
    <WorkspaceWrap $card={actionsInBar}>
      {actionsContainer && createPortal(barActions, actionsContainer)}
      {endActionsContainer &&
        undoButton &&
        createPortal(undoButton, endActionsContainer)}

      {actionsContainer === undefined && (
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
            {inlineActions}
            {undoButton}
          </WorkspaceActions>
        </WorkspaceHeader>
      )}

      <SummarySection $card={actionsInBar}>
        <ReconciliationSummary
          reconciliation={reconciliation}
          endingBalance={endingBalance}
          clearedBalance={clearedBalance}
          currencyCode={currencyCode}
          isEditable={!readOnly}
          onEndingBalanceChange={setEndingBalance}
        />
      </SummarySection>

      {detail.meta.uncategorizedTransactionsCount > 0 && (
        <Callout
          intent={Intent.WARNING}
          style={{ margin: actionsInBar ? '0 0 16px' : '14px 15px 0' }}
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
          style={{ margin: actionsInBar ? '0 0 16px' : '14px 15px 0' }}
          title="Previously reconciled transactions changed"
        >
          {detail.meta.changedTransactions.length} transaction(s) from a
          previous reconciliation have changed. Review them or undo the previous
          reconciliation before continuing.
        </Callout>
      )}

      {!readOnly && !actionsInBar && (
        <Toolbar>
          <ButtonGroup>{addTransactionButton}</ButtonGroup>
        </Toolbar>
      )}

      <ReconciliationTransactionsTable
        transactions={detail.transactions}
        selectedKeys={
          readOnly ? detail.transactions.map((t) => t.key) : selectedKeys
        }
        filter="all"
        card={!actionsInBar}
        readOnly={readOnly}
        isLoading={isSaving || isFinishing}
        onToggle={handleToggle}
        onToggleAll={handleToggleAll}
      />
    </WorkspaceWrap>
  );
}

const WorkspaceWrap = styled.div<{ $card?: boolean }>`
  margin: 16px 15px 0;

  ${({ $card }) =>
    $card &&
    css`
      background: var(--color-bank-transactions-content-background);
      border: 2px solid var(--color-bank-transactions-content-border);
      border-radius: 10px;
      padding: 30px 18px;
    `}
`;

const SummarySection = styled.div<{ $card?: boolean }>`
  margin: ${({ $card }) => ($card ? '0 0 2rem' : '16px 15px 0')};
`;

const WorkspaceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--x-recon-border-light);
`;

const WorkspaceTitle = styled.h3`
  margin: 0 0 2px;
  font-size: 16px;
  font-weight: 600;
`;

const WorkspaceSubtitle = styled.div`
  font-size: 12px;
  color: var(--x-recon-text-muted);
`;

const WorkspaceActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--x-recon-border-light);
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;
