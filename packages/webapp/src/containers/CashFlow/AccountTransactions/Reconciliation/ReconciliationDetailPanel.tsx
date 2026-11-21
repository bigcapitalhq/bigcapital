import {
  formatReconciliationPeriod,
  getReconciliationErrorMessage,
} from './utils';
import intl from 'react-intl-universal';
import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import { ReconciliationWorkspace } from './ReconciliationWorkspace';
import type {
  BankReconciliationDetailResponse,
  BankReconciliationResponse,
} from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import {
  useDeleteBankReconciliation,
  useUndoBankReconciliation,
} from '@/hooks/query/banking';

interface ReconciliationDetailPanelProps {
  detail: BankReconciliationDetailResponse;
  accountId: number;
  accountName?: string;
  currencyCode?: string | null;
  actionsContainer?: HTMLElement | null;
  endActionsContainer?: HTMLElement | null;
  onRefresh: () => void;
  onDeleted?: (reconciliationId: number) => void;
}

/**
 * Renders the reconciliation workspace and owns the undo/delete flows.
 */
export function ReconciliationDetailPanel({
  detail,
  accountId,
  accountName,
  currencyCode,
  actionsContainer,
  endActionsContainer,
  onRefresh,
  onDeleted,
}: ReconciliationDetailPanelProps) {
  const [undoTarget, setUndoTarget] =
    React.useState<BankReconciliationResponse | null>(null);
  const [deleteTarget, setDeleteTarget] =
    React.useState<BankReconciliationResponse | null>(null);

  const { mutateAsync: undoReconciliation, isPending: isUndoing } =
    useUndoBankReconciliation();
  const { mutateAsync: deleteReconciliation, isPending: isDeleting } =
    useDeleteBankReconciliation();

  const handleConfirmUndo = () => {
    if (!undoTarget) return;

    undoReconciliation({
      id: undoTarget.id,
      body: { cascade: !detail.meta.isLatest },
    })
      .then(() => {
        setUndoTarget(null);
        AppToaster.show({
          message: intl.get('banking.reconciliation.reopened'),
          intent: Intent.SUCCESS,
        });
        onRefresh();
      })
      .catch((error: Error) => {
        setUndoTarget(null);
        AppToaster.show({
          message: getReconciliationErrorMessage(error, 'undo_error'),
          intent: Intent.DANGER,
        });
      });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    deleteReconciliation(deleteTarget.id)
      .then(() => {
        const deletedId = deleteTarget.id;
        setDeleteTarget(null);
        AppToaster.show({
          message: intl.get('banking.reconciliation.deleted'),
          intent: Intent.SUCCESS,
        });
        onDeleted?.(deletedId);
      })
      .catch((error: Error) => {
        setDeleteTarget(null);
        AppToaster.show({
          message: getReconciliationErrorMessage(error, 'delete_error'),
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <>
      <ReconciliationWorkspace
        key={`${detail.reconciliation.id}:${detail.reconciliation.updatedAt}`}
        detail={detail}
        accountId={accountId}
        accountName={accountName}
        currencyCode={currencyCode}
        actionsContainer={actionsContainer}
        endActionsContainer={endActionsContainer}
        onUndo={() => setUndoTarget(detail.reconciliation)}
        onDelete={() => setDeleteTarget(detail.reconciliation)}
        onRefresh={onRefresh}
      />

      <Alert
        isOpen={Boolean(undoTarget)}
        intent={Intent.WARNING}
        icon="undo"
        confirmButtonText={intl.get('banking.reconciliation.undo_action')}
        cancelButtonText={intl.get('cancel')}
        loading={isUndoing}
        onConfirm={handleConfirmUndo}
        onCancel={() => setUndoTarget(null)}
      >
        <p>
          {undoTarget &&
            intl.get('banking.reconciliation.undo_confirm', {
              period: formatReconciliationPeriod(
                undoTarget.startDate,
                undoTarget.endDate,
              ),
            })}
        </p>
        {!detail.meta.isLatest && (
          <p>{intl.get('banking.reconciliation.undo_cascade_hint')}</p>
        )}
      </Alert>

      <Alert
        isOpen={Boolean(deleteTarget)}
        intent={Intent.DANGER}
        icon="trash"
        confirmButtonText={intl.get('delete')}
        cancelButtonText={intl.get('cancel')}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        <p>
          {deleteTarget &&
            intl.get('banking.reconciliation.delete_confirm', {
              period: formatReconciliationPeriod(
                deleteTarget.startDate,
                deleteTarget.endDate,
              ),
            })}
        </p>
      </Alert>
    </>
  );
}
