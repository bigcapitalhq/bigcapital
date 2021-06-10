import React from 'react';
import { Classes, Tooltip, Position } from '@blueprintjs/core';

import intl from 'react-intl-universal';
import { DataTable, Money, If, Icon } from 'components';
import { isBlank } from 'utils';

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
 * Manual journal drawer table.
 */
export default function ManualJournalDrawerTable({
  manualJournal: { entries, description, currency_code },
}) {
  const columns = React.useMemo(
    () => [
      {
        Header: intl.get('account_name'),
        accessor: 'account.name',
        width: 130,
      },
      {
        Header: intl.get('contact'),
        accessor: 'contact.display_name',
        width: 130,
      },
      {
        Header: intl.get('credit'),
        accessor: ({ credit }) =>
          !isBlank(credit) && credit !== 0 ? (
            <Money amount={credit} currency={currency_code} />
          ) : null,
        width: 80,
      },
      {
        Header: intl.get('debit'),
        accessor: ({ debit }) =>
          !isBlank(debit) && debit !== 0 ? (
            <Money amount={debit} currency={currency_code} />
          ) : null,
        width: 80,
      },
      {
        Header: intl.get('note'),
        accessor: NoteAccessor,
        width: 80,
      },
    ],
    [],
  );

  return (
    <div className="journal-drawer__content--table">
      <DataTable columns={columns} data={entries} />
      <If condition={description}>
        <p className={'desc'}>
          <b>Description</b>: {description}
        </p>
      </If>
    </div>
  );
}
