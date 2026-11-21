import { Button, Callout, Intent, Spinner } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { ReconciliationDetailPanel } from './ReconciliationDetailPanel';
import { ReconciliationHistoryTable } from './ReconciliationHistoryTable';
import { ReconciliationStartPanel } from './ReconciliationStartPanel';
import { ReconciliationTheme } from './styles';
import { getReconciliationErrorMessage } from './utils';
import { AppToaster } from '@/components';
import {
  useBankReconciliation,
  useBankReconciliations,
  useCreateBankReconciliation,
} from '@/hooks/query/banking';

export function ReconciliationTab() {
  const { accountId, currentAccount, setFilterTab } =
    useAccountTransactionsContext();

  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [isStartingNew, setIsStartingNew] = React.useState(false);

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
        setSelectedId(response.id);
        AppToaster.show({
          message: intl.get('banking.reconciliation.started'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: getReconciliationErrorMessage(error, 'start_error'),
          intent: Intent.DANGER,
        });
      });
  };

  const handleDeleted = (deletedId: number) => {
    const remaining = reconciliations.filter(
      (reconciliation) => reconciliation.id !== deletedId,
    );
    const nextReconciliation =
      remaining.find((reconciliation) => reconciliation.isInProgress) ??
      remaining[0];

    setIsStartingNew(!nextReconciliation);
    setSelectedId(nextReconciliation?.id ?? null);
    refetchList();
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
          {intl.get('banking.reconciliation.list_error')}
        </Callout>
      </EmptyWrap>
    );
  }

  const isRefreshing = isListFetching || isDetailFetching;

  return (
    <TabWrap>
      <Header>
        <div>
          <Title>{intl.get('banking.reconciliation.title')}</Title>
          <Subtitle>
            {intl.get('banking.reconciliation.match_statement')}
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
            title={intl.get('banking.reconciliation.refresh')}
            aria-label={intl.get('banking.reconciliation.refresh')}
          />
          {!meta.hasInProgress && (
            <Button
              icon="plus"
              text={intl.get('banking.reconciliation.new')}
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
              text={intl.get('banking.reconciliation.resume')}
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
          title={intl.get(
            'banking.reconciliation.uncategorized_bank_transactions',
          )}
        >
          {intl.get('banking.reconciliation.uncategorized_warning', {
            count: meta.uncategorizedTransactionsCount,
          })}
          <Button
            small
            minimal
            intent={Intent.PRIMARY}
            text={intl.get('banking.reconciliation.review_transactions')}
            onClick={() => setFilterTab('uncategorized')}
            style={{ marginInlineStart: 8 }}
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
            {getReconciliationErrorMessage(detailError, 'load_error')}
          </Callout>
        </EmptyWrap>
      )}

      {selectedId && detail && !detailError && (
        <ReconciliationDetailPanel
          detail={detail}
          accountId={accountId}
          accountName={currentAccount?.name}
          currencyCode={currentAccount?.currencyCode ?? meta.currencyCode}
          onRefresh={() => {
            refetchList();
            refetchDetail();
          }}
          onDeleted={handleDeleted}
        />
      )}
    </TabWrap>
  );
}

const TabWrap = styled(ReconciliationTheme)`
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
  color: var(--x-recon-text-muted);
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
