import intl from 'react-intl-universal';
import React from 'react';
import { Classes, Tooltip, Position } from '@blueprintjs/core';

import { If, Icon } from 'components';

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
      },
      {
        Header: intl.get('contact'),
        accessor: 'contact.display_name',
        width: 130,
        disableSortBy: true,
      },
      {
        Header: intl.get('note'),
        accessor: NoteAccessor,
        width: 80,
        disableSortBy: true,
      },
      {
        Header: intl.get('credit'),
        accessor: 'credit',
        width: 100,
        disableResizable: true,
        disableSortBy: true,
      },
      {
        Header: intl.get('debit'),
        accessor: 'debit',
        width: 100,
        disableResizable: true,
        disableSortBy: true,
      },
    ],
    [],
  );
