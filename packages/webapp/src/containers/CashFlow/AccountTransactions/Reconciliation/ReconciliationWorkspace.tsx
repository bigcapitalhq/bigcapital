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
import intl from 'react-intl-universal';
import styled, { css } from 'styled-components';
import { ReconciliationSummary } from './ReconciliationSummary';
import { ReconciliationTransactionsTable } from './ReconciliationTransactionsTable';
import {
  getReconciliationDifference,
  isReconciliationBalanced,
  formatReconciliationPeriod,
  formatReconciliationDate,
  getReconciliationErrorMessage,
} from './utils';
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
          message: intl.get('banking.reconciliation.saved'),
          intent: Intent.SUCCESS,
        });
        onRefresh();
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: getReconciliationErrorMessage(error, 'save_error'),
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
          message: intl.get('banking.reconciliation.finished'),
          intent: Intent.SUCCESS,
        });
        onRefresh();
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: getReconciliationErrorMessage(error, 'finish_error'),
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

  const period = formatReconciliationPeriod(
    reconciliation.startDate,
    reconciliation.endDate,
  );

  const actionsInBar = actionsContainer !== undefined;
  const showDelete =
    (reconciliation.isInProgress || reconciliation.isVoided) &&
    detail.meta.canDelete;

  const saveButton = (
    <Button
      icon="floppy-disk"
      text={intl.get('banking.reconciliation.save_for_later')}
      minimal
      onClick={handleSave}
      loading={isSaving}
      disabled={readOnly}
    />
  );

  const reconcileButton = (
    <Button
      icon="tick"
      text={intl.get('banking.reconciliation.finish')}
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
        title={intl.get('banking.reconciliation.refresh_transactions')}
        aria-label={intl.get('banking.reconciliation.refresh_transactions')}
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
          <MenuDivider title={intl.get('cash_flow_money_in')} />
          <MenuItem
            text={intl.get('banking.owner_contribution')}
            onClick={() => handleMoneyIn('owner_contribution')}
          />
          <MenuItem
            text={intl.get('banking.other_income')}
            onClick={() => handleMoneyIn('other_income')}
          />
          <MenuItem
            text={intl.get('cash_flow_transaction.label_transfer_from_account')}
            onClick={() => handleMoneyIn('transfer_from_account')}
          />
          <MenuDivider title={intl.get('cash_flow_money_out')} />
          <MenuItem
            text={intl.get('banking.owner_drawings')}
            onClick={() => handleMoneyOut('owner_drawing')}
          />
          <MenuItem
            text={intl.get('expense')}
            onClick={() => handleMoneyOut('other_expense')}
          />
          <MenuItem
            text={intl.get('cash_flow_transaction.label_transfer_to_account')}
            onClick={() => handleMoneyOut('transfer_to_account')}
          />
        </Menu>
      }
      placement="bottom-end"
    >
      <Button
        icon="plus"
        text={intl.get('banking.reconciliation.add_transaction')}
        minimal
      />
    </Popover>
  );

  const deleteButton = showDelete && (
    <Button
      icon="trash"
      text={intl.get('delete')}
      minimal={actionsInBar}
      intent={Intent.DANGER}
      onClick={onDelete}
    />
  );

  const undoButton = reconciliation.isReconciled && (
    <Button
      icon="undo"
      text={intl.get('banking.reconciliation.undo')}
      intent={Intent.WARNING}
      onClick={onUndo}
    />
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
                ? intl.get('banking.reconciliation.in_progress')
                : reconciliation.isReconciled
                  ? intl.get('report.reconciliation_status.reconciled')
                  : intl.get('banking.reconciliation.voided_title')}
            </WorkspaceTitle>
            <WorkspaceSubtitle>
              {reconciliation.reconciledAt
                ? intl.get('banking.reconciliation.workspace_period', {
                    period,
                    date: formatReconciliationDate(reconciliation.reconciledAt),
                  })
                : period}
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
          title={intl.get(
            'banking.reconciliation.uncategorized_bank_transactions',
          )}
        >
          {intl.get('banking.reconciliation.uncategorized_warning', {
            count: detail.meta.uncategorizedTransactionsCount,
          })}
        </Callout>
      )}

      {detail.meta.changedTransactions.length > 0 && (
        <Callout
          intent={Intent.WARNING}
          style={{ margin: actionsInBar ? '0 0 16px' : '14px 15px 0' }}
          title={intl.get('banking.reconciliation.changed_title')}
        >
          {intl.get('banking.reconciliation.changed_warning', {
            count: detail.meta.changedTransactions.length,
          })}
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
