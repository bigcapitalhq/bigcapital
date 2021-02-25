import React, { useMemo } from 'react';
import { DataTable } from 'components';
import { FormattedMessage as T, useIntl } from 'react-intl';
import keyboardShortcuts from 'common/keyboardShortcutsOptions';

/**
 *  keyboard shortcuts table.
 */
function ShortcutsTable() {
  const { formatMessage } = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'shortcut_keys' }),
        accessor: 'shortcut_key',
        disableSortBy: true,
        className: 'shortcut_key',
        width: 100,
      },
      {
        id: 'description',
        Header: formatMessage({ id: 'description' }),
        accessor: 'description',
        disableSortBy: true,
        className: 'description',
        width: 250,
      },
    ],
    [formatMessage],
  );

  return <DataTable columns={columns} data={keyboardShortcuts} />;
}

export default ShortcutsTable;
