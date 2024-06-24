// @ts-nocheck
import intl from 'react-intl-universal';
import React from 'react';
import { Tag, Intent } from '@blueprintjs/core';

import {
  T,
  Choose,
  FormatNumberCell,
  TextOverviewTooltipCell,
} from '@/components';
import { Features } from '@/constants';
import { getColumnWidth } from '@/utils';
import { useFeatureCan } from '@/hooks/state';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';

/**
 * Publish column accessor.
 */
export function ManualJournalDetailsStatus({ manualJournal }) {
  return (
    <Choose>
      <Choose.When condition={!!manualJournal.is_published}>
        <Tag minimal={true} round={true}>
          <T id={'published'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

/**
 * Retrieve read-only manual journal entries columns.
 */
export const useManualJournalEntriesColumns = () => {
  const { featureCan } = useFeatureCan();

  // manual journal details drawer context.
  const {
    manualJournal: { entries },
  } = useManualJournalDrawerContext();

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
        accessor: 'contact.display_name',
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
    [],
  );
};
