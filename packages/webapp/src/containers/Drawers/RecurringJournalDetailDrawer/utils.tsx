import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringJournalDetailDrawerContext } from './RecurringJournalDetailDrawerProvider';
import type { RecurringJournalDetailEntry } from './types';
import { FormatNumberCell, TextOverviewTooltipCell } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';
import { getColumnWidth } from '@/utils';

/**
 * Retrieve recurring journal readonly entries columns.
 */
export const useRecurringJournalReadonlyEntriesColumns = () => {
  const { featureCan } = useFeatureCan();

  const { recurringJournal } = useRecurringJournalDetailDrawerContext();
  const entries = React.useMemo(
    () => recurringJournal?.entries ?? [],
    [recurringJournal],
  );

  // Categories actually used by this journal, ordered as they appear.
  const usedTrackingCategories = React.useMemo(() => {
    const categories = new Map<number, { id: number; name: string }>();

    entries.forEach((entry) => {
      (entry.trackingCategories ?? []).forEach((assignment) => {
        if (assignment.category) {
          categories.set(assignment.category.id, assignment.category);
        }
      });
    });
    return [...categories.values()];
  }, [entries]);

  return React.useMemo(
    () => [
      {
        Header: intl.get('account_name'),
        Cell: TextOverviewTooltipCell,
        accessor: 'account.name',
        width: 130,
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('contact'),
        accessor: (entry: RecurringJournalDetailEntry) =>
          entry.contact?.displayName ??
          entry.contact?.display_name ??
          entry.contact?.name ??
          '',
        Cell: TextOverviewTooltipCell,
        width: 100,
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('note'),
        accessor: 'note',
        Cell: TextOverviewTooltipCell,
        disableSortBy: true,
        textOverview: true,
        width: 100,
      },
      ...(featureCan(Features.Branches)
        ? [
            {
              Header: intl.get('branch'),
              width: 100,
              accessor: 'branch.name',
              disableSortBy: true,
            },
          ]
        : []),
      ...(featureCan(Features.TrackingCategories)
        ? usedTrackingCategories.map((category) => ({
            id: `tracking-category-${category.id}`,
            Header: category.name,
            accessor: (entry: RecurringJournalDetailEntry) =>
              (entry.trackingCategories ?? []).find(
                (assignment) => assignment.categoryId === category.id,
              )?.option?.name ?? '',
            Cell: TextOverviewTooltipCell,
            width: 100,
            disableSortBy: true,
            textOverview: true,
          }))
        : []),
      {
        Header: intl.get('debit'),
        accessor: 'debit',
        Cell: FormatNumberCell,
        width: getColumnWidth(entries, 'debit', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        disableResizable: true,
        textOverview: true,
        disableSortBy: true,
        formatNumber: { noZero: true },
        align: 'right',
      },
      {
        Header: intl.get('credit'),
        accessor: 'credit',
        Cell: FormatNumberCell,
        width: getColumnWidth(entries, 'credit', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        disableResizable: true,
        disableSortBy: true,
        textOverview: true,
        formatNumber: { noZero: true },
        align: 'right',
      },
    ],
    [featureCan, entries, usedTrackingCategories],
  );
};
