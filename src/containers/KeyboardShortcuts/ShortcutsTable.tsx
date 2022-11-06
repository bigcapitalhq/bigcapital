// @ts-nocheck
import React, { useMemo } from 'react';
import { DataTable } from '@/components';
import intl from 'react-intl-universal';
import { useKeywordShortcuts } from '@/hooks/dashboard';

/**
 *  keyboard shortcuts table.
 */
export default function ShortcutsTable() {
  const keywordShortcuts = useKeywordShortcuts();

  const columns = useMemo(
    () => [
      {
        Header: intl.get('shortcut_keys'),
        accessor: 'shortcut_key',
        disableSortBy: true,
        className: 'shortcut_key',
        width: 100,
      },
      {
        id: 'description',
        Header: intl.get('description'),
        accessor: 'description',
        disableSortBy: true,
        className: 'description',
        width: 250,
      },
    ],
    [],
  );
  return <DataTable columns={columns} data={keywordShortcuts} />;
}
