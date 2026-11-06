import { Alert, Button, Callout, Intent, Spinner } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { ReconciliationHistoryTable } from './ReconciliationHistoryTable';
import { ReconciliationStartPanel } from './ReconciliationStartPanel';
import { ReconciliationWorkspace } from './ReconciliationWorkspace';
import type { BankReconciliationResponse } from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import {
  useBankReconciliation,
  useBankReconciliations,
  useCreateBankReconciliation,
  useDeleteBankReconciliation,
  useUndoBankReconciliation,
} from '@/hooks/query/banking';

export function ReconciliationTab() {
  const { accountId, currentAccount, setFilterTab } =
    useAccountTransactionsContext();

  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [isStartingNew, setIsStartingNew] = React.useState(false);
  const [undoTarget, setUndoTarget] =
    React.useState<BankReconciliationResponse | null>(null);
  const [deleteTarget, setDeleteTarget] =
    React.useState<BankReconciliationResponse | null>(null);

  const {
    data: listResponse,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useBankReconciliations(accountId);

  const reconciliations = React.useMemo(
    () => listResponse?.data ?? [],
    [listResponse?.data],
  );
  const meta = listResponse?.meta;

  const {
    data: detail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    refetch: refetchDetail,
    error: detailError,
  } = useBankReconciliation(selectedId);

  const { mutateAsync: createReconciliation, isPending: isCreating } =
    useCreateBankReconciliation();
  const { mutateAsync: undoReconciliation, isPending: isUndoing } =
    useUndoBankReconciliation();
  const { mutateAsync: deleteReconciliation, isPending: isDeleting } =
    useDeleteBankReconciliation();

  React.useEffect(() => {
    if (selectedId || isStartingNew) return;

    if (meta?.hasInProgress && meta.inProgressId) {
      setSelectedId(meta.inProgressId);
      return;
    }
    if (reconciliations.length > 0) {
      setSelectedId(reconciliations[0].id);
    }
  }, [meta, reconciliations, selectedId, isStartingNew]);

  const handleSelect = (id: number) => {
    setIsStartingNew(false);
    setSelectedId(id);
  };

  const handleStart = (values: {
    startDate: string;
    endDate: string;
    endingBalance: number;
    notes?: string;
  }) => {
    createReconciliation({
      accountId,
      startDate: values.startDate,
      endDate: values.endDate,
      endingBalance: values.endingBalance,
      notes: values.notes,
    })
      .then((response) => {
        setIsStartingNew(false);
        setSelectedId(response.reconciliation.id);
        AppToaster.show({
          message: 'Reconciliation started.',
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: error.message || 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  const handleUndoClick = (reconciliation: BankReconciliationResponse) => {
    setUndoTarget(reconciliation);
  };

  const handleConfirmUndo = () => {
    if (!undoTarget) return;

    undoReconciliation({
      id: undoTarget.id,
      body: { cascade: !detail?.meta.isLatest },
    })
      .then((response) => {
        setSelectedId(response.reconciliation.id);
        setUndoTarget(null);
        AppToaster.show({
          message: 'Reconciliation reopened.',
          intent: Intent.SUCCESS,
        });
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
        const remaining = reconciliations.filter(
          (reconciliation) => reconciliation.id !== deleteTarget.id,
        );
        const nextReconciliation =
          remaining.find((reconciliation) => reconciliation.isInProgress) ??
          remaining[0];

        setDeleteTarget(null);
        setIsStartingNew(!nextReconciliation);
        setSelectedId(nextReconciliation?.id ?? null);
        AppToaster.show({
          message: 'Reconciliation deleted.',
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        setDeleteTarget(null);
        AppToaster.show({
          message: error.message || 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  if (isListLoading) {
    return (
      <LoadingWrap>
        <Spinner size={28} />
      </LoadingWrap>
    );
  }

  if (!meta) {
    return (
      <EmptyWrap>
        <Callout intent={Intent.DANGER}>
          Unable to load the reconciliation details for this account.
        </Callout>
      </EmptyWrap>
    );
  }

  const isRefreshing = isListFetching || isDetailFetching;

  return (
    <TabWrap>
      <Header>
        <div>
          <Title>Reconciliations</Title>
          <Subtitle>
            Match this bank account against your statement and keep the books
            accurate.
          </Subtitle>
        </div>
        <HeaderActions>
          <Button
            icon="refresh"
            minimal
            loading={isRefreshing}
            onClick={() => {
              refetchList();
              if (selectedId) refetchDetail();
            }}
            title="Refresh"
          />
          {!meta.hasInProgress && (
            <Button
              icon="plus"
              text="New reconciliation"
              intent={Intent.PRIMARY}
              onClick={() => {
                setIsStartingNew(true);
                setSelectedId(null);
              }}
              data-testId="new-reconciliation"
            />
          )}
          {meta.hasInProgress && meta.inProgressId && (
            <Button
              icon="play"
              text="Resume reconciliation"
              intent={Intent.PRIMARY}
              onClick={() => handleSelect(meta.inProgressId as number)}
            />
          )}
        </HeaderActions>
      </Header>

      {meta.uncategorizedTransactionsCount > 0 && (
        <Callout
          intent={Intent.WARNING}
          style={{ margin: '0 15px' }}
          title="Uncategorized bank transactions"
        >
          {meta.uncategorizedTransactionsCount} bank transaction(s) are still
          uncategorized. Categorize or match them before reconciling.
          <Button
            small
            minimal
            intent={Intent.PRIMARY}
            text="Review transactions"
            onClick={() => setFilterTab('uncategorized')}
            style={{ marginLeft: 8 }}
          />
        </Callout>
      )}

      <ReconciliationHistoryTable
        reconciliations={reconciliations}
        selectedId={selectedId}
        onSelect={handleSelect}
        onResume={handleSelect}
      />

      {!selectedId && (
        <ReconciliationStartPanel
          meta={meta}
          isSubmitting={isCreating}
          onStart={handleStart}
          onResume={handleSelect}
        />
      )}

      {selectedId && isDetailLoading && (
        <LoadingWrap>
          <Spinner size={28} />
        </LoadingWrap>
      )}

      {selectedId && detailError && (
        <EmptyWrap>
          <Callout intent={Intent.DANGER}>
            {detailError.message || 'Unable to load the reconciliation.'}
          </Callout>
        </EmptyWrap>
      )}

      {selectedId && detail && !detailError && (
        <ReconciliationWorkspace
          key={`${detail.reconciliation.id}:${detail.reconciliation.updatedAt}`}
          detail={detail}
          accountId={accountId}
          accountName={currentAccount?.name}
          currencyCode={currentAccount?.currencyCode ?? meta.currencyCode}
          onUndo={() => handleUndoClick(detail.reconciliation)}
          onDelete={() => setDeleteTarget(detail.reconciliation)}
          onRefresh={() => {
            refetchList();
            refetchDetail();
          }}
        />
      )}

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
        {!detail?.meta.isLatest && (
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
    </TabWrap>
  );
}

const TabWrap = styled.div`
  padding-bottom: 30px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 4px 15px 12px;
`;

const Title = styled.h2`
  margin: 0 0 2px;
  font-size: 18px;
  font-weight: 600;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: var(--x-text-color-muted, #738091);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const EmptyWrap = styled.div`
  padding: 16px 15px;
`;
