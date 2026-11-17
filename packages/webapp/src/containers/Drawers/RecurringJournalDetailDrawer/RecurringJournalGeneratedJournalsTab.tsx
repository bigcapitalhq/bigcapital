import { Intent, Tag } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringJournalDetailDrawerContext } from './RecurringJournalDetailDrawerProvider';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import type { RecurringJournalJournalsResponse } from '@bigcapital/sdk-ts';
import { Card, DataTable, EmptyStatus, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useRecurringJournalJournals } from '@/hooks/query';

type GeneratedJournal = NonNullable<
  RecurringJournalJournalsResponse['data']
>[number];

interface RecurringJournalGeneratedJournalsTabInnerProps
  extends WithDrawerActionsProps {}

/**
 * Retrieve generated journals table columns.
 */
function useGeneratedJournalsTableColumns(): Array<
  DataTableColumn<GeneratedJournal>
> {
  return React.useMemo(
    () => [
      {
        id: 'journal_number',
        Header: intl.get('journal_number_'),
        accessor: 'journalNumber',
        width: 130,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: 'formattedDate',
        width: 120,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: (journal) => (
          <Tag
            minimal
            round
            intent={journal.isPublished ? Intent.NONE : Intent.WARNING}
          >
            {intl.get(journal.isPublished ? 'published' : 'draft')}
          </Tag>
        ),
        width: 120,
        clickable: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'formattedAmount',
        width: 120,
        align: 'right',
        clickable: true,
        textOverview: true,
        money: true,
      },
    ],
    [],
  );
}

/**
 * Recurring journal generated journals tab panel.
 */
function RecurringJournalGeneratedJournalsTabInner({
  // #withDrawerActions
  openDrawer,
}: RecurringJournalGeneratedJournalsTabInnerProps) {
  const { recurringJournalId } = useRecurringJournalDetailDrawerContext();

  const { data, isLoading, isFetching } = useRecurringJournalJournals(
    recurringJournalId,
    { pageSize: 100 },
    { enabled: !!recurringJournalId },
  );

  const columns = useGeneratedJournalsTableColumns();
  const journals = data?.data ?? [];

  const handleCellClick = (cell: {
    row: { original: GeneratedJournal };
  }): void => {
    openDrawer(DRAWERS.JOURNAL_DETAILS, {
      manualJournalId: cell.row.original.id,
    });
  };

  if (!isLoading && journals.length === 0) {
    return (
      <Card>
        <EmptyStatus
          title={intl.get('recurring_journal.no_generated_journals')}
        />
      </Card>
    );
  }

  return (
    <Card>
      <DataTable
        columns={columns}
        data={journals}
        loading={isLoading}
        headerLoading={isLoading}
        progressBarLoading={isFetching}
        TableLoadingRenderer={TableSkeletonRows}
        styleName={TableStyle.Constrant}
        noInitialFetch={true}
        onCellClick={handleCellClick}
      />
    </Card>
  );
}

export const RecurringJournalGeneratedJournalsTab = FF.pipe(
  RecurringJournalGeneratedJournalsTabInner,
  withDrawerActions,
);
