import { MenuItem, Menu, Button, Position, Intent } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React from 'react';
import intl from 'react-intl-universal';
import { useItemEntriesTableContext } from './ItemEntriesTableProvider';
import type { Batch } from '@/hooks/query/batches/queries';
import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';
import type { Tooltip2Props } from '@blueprintjs/popover2';
import {
  Hint,
  Icon,
  FormattedMessage as T,
  PurchaseBatchAllocationsPopover,
  SaleBatchAllocationsPopover,
} from '@/components';
import {
  InputGroupCell,
  MoneyFieldCell,
  ItemsListCell,
  PercentFieldCell,
  NumericInputCell,
  CheckBoxFieldCell,
} from '@/components/DataTableCells';
import { TaxRatesSuggestInputCell } from '@/components/TaxRates/TaxRatesSuggestInputCell';
import { Align, CellType } from '@/constants';
import { formattedAmount } from '@/utils';

/**
 * Item header cell.
 */
export function ItemHeaderCell() {
  return (
    <>
      <T id={'product_and_service'} />
      <Hint
        content={<T id={'item_entries.products_services.hint'} />}
        tooltipProps={{
          // The `boundary: 'window'` value predates the popper v2 boundary
          // renames; the cast keeps the same runtime value.
          boundary: 'window' as unknown as Tooltip2Props['boundary'],
          position: Position.RIGHT,
        }}
      />
    </>
  );
}

interface ActionsCellRendererProps {
  row: { index: number };
  payload: { removeRow: (rowIndex: number) => void };
}

/**
 * Actions cell renderer component.
 */
export function ActionsCellRenderer({
  row: { index },
  payload: { removeRow },
}: ActionsCellRendererProps) {
  const onRemoveRole = () => {
    removeRow(index);
  };
  const exampleMenu = (
    <Menu>
      <MenuItem
        intent={Intent.DANGER}
        onClick={onRemoveRole}
        text={<T id={'item_entries.remove_row'} />}
      />
    </Menu>
  );

  // The `iconSize` prop is not exposed by the Blueprint v4 `Button` props but
  // it is kept on the element to preserve the current rendering behavior.
  const buttonProps = {
    icon: <Icon icon={'more-13'} iconSize={13} />,
    iconSize: 14,
    className: 'm12',
    minimal: true,
  } as React.ComponentProps<typeof Button>;

  return (
    <Popover2 content={exampleMenu} placement="left-start">
      <Button {...buttonProps} />
    </Popover2>
  );
}
ActionsCellRenderer.cellType = CellType.Button;

interface TotalCellProps {
  payload: { currencyCode?: string };
  value: string | number;
}

/**
 * Total accessor.
 */
export function TotalCell({
  payload: { currencyCode },
  value,
}: TotalCellProps) {
  return <span>{formattedAmount(value, currencyCode, { noZero: true })}</span>;
}

/**
 * Landed cost header cell.
 */
const LandedCostHeaderCell = () => {
  return (
    <>
      <T id={'landed'} />
      <Hint content={<T id={'item_entries.landed.hint'} />} />
    </>
  );
};

interface BatchEntryCellProps {
  row: {
    index: number;
    original: {
      itemId?: number | string;
      batchId?: number | null;
      batch?: Batch | null;
      batches?: ItemEntryBatchAllocation[];
      quantity?: number | string;
    };
  };
  payload: {
    items?: Array<{ id: number; type?: string; name?: string }>;
    batchMode?: 'purchase' | 'sale';
    updateRow: (rowIndex: number, patch: Record<string, unknown>) => void;
  };
}

/**
 * Batch entry cell used by purchase/sale transaction lines.
 */
export function BatchEntryCell({ row, payload }: BatchEntryCellProps) {
  const { index, original } = row;
  const item = payload.items?.find(
    (item) => Number(item.id) === Number(original.itemId),
  );

  if (!item || item.type !== 'inventory') {
    return null;
  }
  const allocations: ItemEntryBatchAllocation[] =
    (original.batches?.length ?? 0) > 0
      ? (original.batches as ItemEntryBatchAllocation[])
      : original.batchId
        ? [
            {
              batchId: original.batchId,
              quantity: Number(original.quantity) || 0,
              batch: original.batch,
            },
          ]
        : [];

  if (payload.batchMode === 'sale') {
    return (
      <SaleBatchAllocationsPopover
        itemId={Number(original.itemId)}
        entryQuantity={original.quantity ?? 0}
        allocations={allocations}
        onApply={(nextAllocations) => {
          payload.updateRow(index, { batches: nextAllocations });
        }}
      />
    );
  }
  return (
    <PurchaseBatchAllocationsPopover
      itemId={Number(original.itemId)}
      entryQuantity={original.quantity ?? 0}
      allocations={allocations}
      onApply={(nextAllocations) => {
        payload.updateRow(index, { batches: nextAllocations });
      }}
    />
  );
}

/**
 * Batch header cell.
 */
const BatchHeaderCell = () => {
  return <T id={'batch.label'} />;
};

/**
 * Retrieve editable items entries columns.
 */
export function useEditableItemsEntriesColumns() {
  const { landedCost, enableTaxRates, batchMode } =
    useItemEntriesTableContext();

  return React.useMemo(
    () => [
      {
        id: 'itemId',
        Header: ItemHeaderCell,
        accessor: 'itemId',
        Cell: ItemsListCell,
        disableSortBy: true,
        width: 130,
        className: 'item',
        fieldProps: { allowCreate: true },
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: InputGroupCell,
        disableSortBy: true,
        className: 'description',
        width: 120,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        Cell: NumericInputCell,
        disableSortBy: true,
        width: 70,
        align: Align.Right,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 70,
        align: Align.Right,
      },
      ...(batchMode
        ? [
            {
              Header: BatchHeaderCell,
              id: 'batch',
              accessor: (row: { batches?: unknown[] }) =>
                row.batches?.length ?? 0,
              Cell: BatchEntryCell,
              disableSortBy: true,
              disableResizing: true,
              width: 130,
            },
          ]
        : []),
      ...(enableTaxRates
        ? [
            {
              Header: 'Tax rate',
              accessor: 'taxRateId',
              Cell: TaxRatesSuggestInputCell,
              disableSortBy: true,
              width: 110,
            },
          ]
        : []),
      {
        Header: intl.get('discount'),
        accessor: 'discount',
        Cell: PercentFieldCell,
        disableSortBy: true,
        width: 60,
        align: Align.Right,
      },
      {
        Header: intl.get('total'),
        accessor: 'amount',
        Cell: TotalCell,
        disableSortBy: true,
        width: 100,
        align: Align.Right,
      },
      ...(landedCost
        ? [
            {
              Header: LandedCostHeaderCell,
              accessor: 'landedCost',
              Cell: CheckBoxFieldCell,
              width: 100,
              disabledAccessor: 'landedCostDisabled',
              disableSortBy: true,
              disableResizing: true,
              align: Align.Center,
            },
          ]
        : []),
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        disableSortBy: true,
        disableResizing: true,
        width: 45,
        align: Align.Center,
      },
    ],
    [batchMode, enableTaxRates, landedCost],
  );
}
