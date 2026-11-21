import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useEditableItemsEntriesColumns } from './components';
import {
  ItemEntriesTableProvider,
  useItemEntriesTableContext,
} from './ItemEntriesTableProvider';
import {
  useFetchItemRow,
  useComposeRowsOnEditTableCell,
  useComposeRowsOnRemoveTableRow,
  useComposeRowsOnNewRow,
  useComposeRowsOnUpdateTableRow,
} from './utils';
import type { ItemEntry } from '@/interfaces/ItemEntries';
import type { Item, TaxRate } from '@bigcapital/sdk-ts';
import { DataTableEditable } from '@/components';
import { Features } from '@/constants';
import { CLASSES } from '@/constants/classes';
import { useAccounts } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { useUncontrolled } from '@/hooks/useUncontrolled';

interface ItemsEntriesTableProps {
  initialValue?: ItemEntry[];
  value?: ItemEntry[];
  onChange?: (entries: ItemEntry[]) => void;
  taxRates?: TaxRate[];
  minLinesNumber?: number;
  enableTaxRates?: boolean;
  items?: Item[];
  itemType?: string;
  errors?: unknown;
  linesNumber?: number;
  currencyCode?: string;
  isInclusiveTax?: boolean;
  landedCost?: boolean;
  defaultEntry?: ItemEntry;
  accountField?: 'sellAccountId' | 'costAccountId';
  batchMode?: 'purchase' | 'sale' | 'return';
}

/**
 * Items entries table.
 */
export function ItemsEntriesTable(props: ItemsEntriesTableProps) {
  const { value, initialValue, onChange } = props;

  const { featureCan } = useFeatureCan();
  const isSalesTaxFeatureCan = featureCan(Features.SalesTax);

  const [localValue, handleChange] = useUncontrolled<ItemEntry[]>({
    value,
    initialValue,
    finalValue: [],
    onChange,
  });

  return (
    <ItemEntriesTableProvider
      value={{
        ...props,
        batchMode: featureCan(Features.BatchTracking)
          ? props.batchMode
          : undefined,
        enableTaxRates: props.enableTaxRates !== false && isSalesTaxFeatureCan,
        localValue,
        handleChange,
      }}
    >
      <ItemEntriesTableRoot />
    </ItemEntriesTableProvider>
  );
}

/**
 * Items entries table logic.
 * @returns {JSX.Element}
 */
function ItemEntriesTableRoot() {
  const {
    localValue,
    handleChange,
    items,
    errors,
    currencyCode,
    landedCost,
    taxRates,
    itemType,
    batchMode,
    accountField = 'sellAccountId',
  } = useItemEntriesTableContext();

  // Fetches the accounts list.
  const { data: accounts } = useAccounts();

  // Editiable items entries columns.
  const columns = useEditableItemsEntriesColumns();

  const composeRowsOnEditCell = useComposeRowsOnEditTableCell();
  const composeRowsOnDeleteRow = useComposeRowsOnRemoveTableRow();
  const composeRowsOnNewRow = useComposeRowsOnNewRow();
  const composeRowsOnUpdateRow = useComposeRowsOnUpdateTableRow();

  // Handle the fetch item row details.
  const { setItemRow, cellsLoading, isItemFetching } = useFetchItemRow({
    landedCost,
    itemType,
    notifyNewRow: (newRow, rowIndex) => {
      // Update the rate, description and quantity data of the row.
      const newRows = composeRowsOnNewRow(rowIndex, newRow, localValue);
      handleChange(newRows);
    },
  });
  // Handles the editor data update.
  const handleUpdateData = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      if (columnId === 'itemId') {
        const item = items?.find((item) => item.id === value);
        setItemRow(item ? { rowIndex, columnId, itemId: item.id } : null);
        if (item) {
          handleChange(
            composeRowsOnUpdateRow(rowIndex, {
              itemId: item.id,
              [accountField]: item[accountField] ?? '',
            }),
          );
          return;
        }
      }
      handleChange(composeRowsOnEditCell(rowIndex, columnId, value));
    },
    [
      accountField,
      composeRowsOnEditCell,
      composeRowsOnUpdateRow,
      handleChange,
      items,
      setItemRow,
    ],
  );

  // Handle table rows removing by index.
  const handleRemoveRow = (rowIndex: number) => {
    const newRows = composeRowsOnDeleteRow(rowIndex);
    handleChange(newRows);
  };

  // Handle updating a full row at once (used by the batch cell).
  const handleUpdateRow = useCallback(
    (rowIndex: number, patch: Partial<ItemEntry>) => {
      const newRows = composeRowsOnUpdateRow(rowIndex, patch);
      handleChange(newRows);
    },
    [composeRowsOnUpdateRow, handleChange],
  );

  return (
    <DataTableEditable
      className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
      columns={columns}
      data={localValue}
      sticky={true}
      progressBarLoading={isItemFetching}
      cellsLoading={isItemFetching}
      cellsLoadingCoords={cellsLoading ?? undefined}
      payload={{
        items,
        accounts: accounts ?? [],
        taxRates,
        errors: errors || [],
        updateData: handleUpdateData,
        updateRow: handleUpdateRow,
        removeRow: handleRemoveRow,
        autoFocus: ['itemId', 0],
        currencyCode,
        batchMode,
      }}
    />
  );
}

ItemsEntriesTable.defaultProps = {
  defaultEntry: {
    index: 0,
    itemId: '',
    description: '',
    quantity: '',
    rate: '',
    discount: '',
    sellAccountId: '',
    costAccountId: '',
    batchId: null,
    batch: null,
    batches: [],
  },
  initialEntries: [],
  taxRates: [],
  items: [],
  linesNumber: 1,
  minLinesNumber: 1,
  enableTaxRates: true,
  accountField: 'sellAccountId',
};
