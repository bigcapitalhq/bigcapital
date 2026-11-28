import {
  MenuItem,
  Menu,
  Button,
  Position,
  Intent,
  Popover,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useItemEntriesTableContext } from './ItemEntriesTableProvider';
import { ItemStockTooltip } from './ItemStockTooltip';
import type { Batch } from '@/ee/batches/hooks/query/queries';
import type { ItemEntryBatchAllocation } from '@/interfaces/ItemEntries';
import type { Item } from '@bigcapital/sdk-ts';
import { Hint, Icon, FormattedMessage as T } from '@/components';
import {
  InputGroupCell,
  MoneyFieldCell,
  ItemsListCell,
  PercentFieldCell,
  NumericInputCell,
  CheckBoxFieldCell,
  AccountsListFieldCell,
} from '@/components/DataTableCells';
import { TaxRatesSuggestInputCell } from '@/components/TaxRates/TaxRatesSuggestInputCell';
import { Align, CellType, ACCOUNT_ROOT_TYPE } from '@/constants';
import {
  PurchaseBatchAllocationsPopover,
  SaleBatchAllocationsPopover,
} from '@/ee/batches/components';
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
          rootBoundary: 'viewport',
          position: Position.RIGHT,
        }}
      />
    </>
  );
}

/**
 * Account header cell.
 */
export function AccountHeaderCell() {
  return (
    <>
      <T id={'account'} />
      <Hint
        content={<T id={'item_entries.account.hint'} />}
        tooltipProps={{
          rootBoundary: 'viewport',
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
    <Popover content={exampleMenu} placement="left-start">
      <Button {...buttonProps} />
    </Popover>
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
    batchMode?: 'purchase' | 'sale' | 'return';
    updateRow: (rowIndex: number, patch: Record<string, unknown>) => void;
  };
}

/**
 * Batch entry button used by purchase/sale transaction lines.
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

  if (payload.batchMode === 'sale' || payload.batchMode === 'return') {
    return (
      <SaleBatchAllocationsPopover
        isReturn={payload.batchMode === 'return'}
        itemId={Number(original.itemId)}
        entryQuantity={original.quantity ?? 0}
        allocations={allocations}
        onApply={(nextAllocations) => {
          payload.updateRow(index, {
            batches: nextAllocations,
            batchId: null,
            batch: null,
          });
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
        payload.updateRow(index, {
          batches: nextAllocations,
          batchId: null,
          batch: null,
        });
      }}
    />
  );
}

/**
 * Quantity cell with the batch allocation trigger inside the input's left
 * element.
 */
function BatchQuantityCell(props: any) {
  const { row, payload } = props;
  const item = payload.items?.find(
    (item: { id: number }) => Number(item.id) === Number(row.original.itemId),
  );

  return (
    <NumericInputCell
      {...props}
      leftElement={
        item?.type === 'inventory' ? (
          <BatchEntryCell row={row} payload={payload} />
        ) : undefined
      }
    />
  );
}
BatchQuantityCell.cellType = NumericInputCell.cellType;

/**
 * Quantity cell that shows the stock of the line's inventory item in a
 * tooltip while the quantity input is focused.
 */
function QuantityCell(props: any) {
  const { row, payload } = props;
  const [isFocused, setIsFocused] = React.useState(false);

  const item = payload.items?.find(
    (item: Item) => Number(item.id) === Number(row.original.itemId),
  );
  const InputCell = payload.batchMode ? BatchQuantityCell : NumericInputCell;

  return (
    <ItemStockTooltip item={item} isOpen={isFocused}>
      <InputCell
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </ItemStockTooltip>
  );
}
QuantityCell.cellType = NumericInputCell.cellType;

/**
 * Retrieve editable items entries columns.
 */
export function useEditableItemsEntriesColumns() {
  const { landedCost, enableTaxRates, batchMode, accountField } =
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
        Header: AccountHeaderCell,
        accessor: accountField || 'sellAccountId',
        Cell: AccountsListFieldCell,
        disableSortBy: true,
        className: 'account',
        width: 140,
        filterAccountsByRootTypes: [
          accountField === 'costAccountId'
            ? ACCOUNT_ROOT_TYPE.EXPENSE
            : ACCOUNT_ROOT_TYPE.INCOME,
        ],
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        Cell: QuantityCell,
        disableSortBy: true,
        width: batchMode ? 120 : 70,
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
    [accountField, batchMode, enableTaxRates, landedCost],
  );
}
