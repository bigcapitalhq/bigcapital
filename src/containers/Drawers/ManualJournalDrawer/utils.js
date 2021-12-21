import intl from 'react-intl-universal';
import React from 'react';
import { Tag, Intent, Classes, Tooltip, Position } from '@blueprintjs/core';

import { T, Choose, FormatNumberCell, If, Icon } from '../../../components';

/**
 * Note column accessor.
 */
export function NoteAccessor(row) {
  return (
    <If condition={row.note}>
      <Tooltip
        className={Classes.TOOLTIP_INDICATOR}
        content={row.note}
        position={Position.LEFT_TOP}
        hoverOpenDelay={50}
      >
        <Icon icon={'file-alt'} iconSize={16} />
      </Tooltip>
    </If>
  );
}

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
export const useManualJournalEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('account_name'),
        accessor: 'account.name',
        width: 130,
        disableSortBy: true,
        className: 'account',
      },
      {
        Header: intl.get('contact'),
        accessor: 'contact.display_name',
        width: 130,
        disableSortBy: true,
        className: 'contact',
      },
      {
        Header: intl.get('note'),
        accessor: NoteAccessor,
        width: 80,
        disableSortBy: true,
        className: 'note',
      },
      {
        Header: intl.get('credit'),
        accessor: 'credit',
        Cell: FormatNumberCell,
        width: 100,
        disableResizable: true,
        disableSortBy: true,
        formatNumber: { noZero: true },
        className: 'credit',
        align: 'right',
      },
      {
        Header: intl.get('debit'),
        accessor: 'debit',
        Cell: FormatNumberCell,
        width: 100,
        disableResizable: true,
        disableSortBy: true,
        formatNumber: { noZero: true },
        className: 'debit',
        align: 'right',
      },
    ],
    [],
  );
