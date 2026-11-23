import { TableLoadingOption } from '@bigcapitalhq/blueprintjs-react-table';
import { functionalUpdate } from '@tanstack/react-table';
import { useMemo } from 'react';
import type { BP_RowSelectionState } from '@bigcapitalhq/blueprintjs-react-table';
import type { Updater } from '@tanstack/react-table';

export const TABLE_LOADING_OPTIONS = [
  TableLoadingOption.CELLS,
  TableLoadingOption.COLUMN_HEADERS,
  TableLoadingOption.ROW_HEADERS,
];

export const getRowId = (record: { id: number }) => String(record.id);

export function useTableRowSelection(
  selectedIds: readonly number[],
  setSelectedIds: (ids: number[]) => void,
) {
  const rowSelection = useMemo<BP_RowSelectionState>(
    () => Object.fromEntries(selectedIds.map((id) => [id, true])),
    [selectedIds],
  );

  const onRowSelectionChange = (update: Updater<BP_RowSelectionState>) => {
    const selection = functionalUpdate(update, rowSelection);
    setSelectedIds(
      Object.keys(selection)
        .filter((id) => selection[id])
        .map(Number),
    );
  };

  return { rowSelection, onRowSelectionChange };
}
