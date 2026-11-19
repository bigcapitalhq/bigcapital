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
          message: 'Reconciliation reopened.',
          intent: Intent.SUCCESS,
        });
        onRefresh();
      })
      .catch((error: Error) => {
        setUndoTarget(null);
        AppToaster.show({
          message: error.message || 'Something went wrong.',
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
          message: 'Reconciliation deleted.',
          intent: Intent.SUCCESS,
        });
        onDeleted?.(deletedId);
      })
      .catch((error: Error) => {
        setDeleteTarget(null);
        AppToaster.show({
          message: error.message || 'Something went wrong.',
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
        confirmButtonText="Undo reconciliation"
        cancelButtonText="Cancel"
        loading={isUndoing}
        onConfirm={handleConfirmUndo}
        onCancel={() => setUndoTarget(null)}
      >
        <p>
          Undo the reconciliation for{' '}
          <strong>
            {undoTarget?.formattedStartDate} – {undoTarget?.formattedEndDate}
          </strong>
          ?
        </p>
        {!detail.meta.isLatest && (
          <p>
            This is not the latest reconciliation. Later reconciliations will
            also be voided so the account can be reconciled again.
          </p>
        )}
      </Alert>

      <Alert
        isOpen={Boolean(deleteTarget)}
        intent={Intent.DANGER}
        icon="trash"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        <p>
          Delete the reconciliation for{' '}
          <strong>
            {deleteTarget?.formattedStartDate} –{' '}
            {deleteTarget?.formattedEndDate}
          </strong>
          ? This cannot be undone.
        </p>
      </Alert>
    </>
  );
}
