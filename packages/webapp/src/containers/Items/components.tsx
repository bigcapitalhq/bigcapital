import {
  Menu,
  MenuDivider,
  MenuItem,
  Intent,
  Tag,
  Position,
  Button,
  Popover,
  Classes,
} from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { Item } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { FormattedMessage as T, Icon, Money, If, Can } from '@/components';
import {
  AbilitySubject,
  ItemAction,
  InventoryAdjustmentAction,
} from '@/constants/abilityOption';
import { isBlank, safeCallback } from '@/utils';

export type ItemTableRow = Item & {
  // Runtime-only fields not declared on the SDK type.
  isPublished?: boolean;
  active?: boolean;
  quantityOnHand?: number;
  category?: { id?: number; name?: string };
};

interface CellProps {
  cell: { value: unknown };
  row?: { original: ItemTableRow };
}

interface ActionsMenuPayload {
  onEditItem: (item: ItemTableRow) => void;
  onInactivateItem: (item: ItemTableRow) => void;
  onActivateItem: (item: ItemTableRow) => void;
  onMakeAdjustment: (item: ItemTableRow) => void;
  onDeleteItem: (item: ItemTableRow) => void;
  onDuplicate: (item: ItemTableRow) => void;
  onViewDetails: (item: ItemTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: ItemTableRow };
  payload: ActionsMenuPayload;
}

/**
 * Publish accessor
 */
export const PublishAccessor = (r: ItemTableRow) => {
  return r.isPublished ? (
    <Tag minimal={true}>
      <T id={'published'} />
    </Tag>
  ) : (
    <Tag minimal={true} intent={Intent.WARNING}>
      <T id={'draft'} />
    </Tag>
  );
};

export const TypeAccessor = (row: ItemTableRow) => {
  return row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {intl.get(row.type)}
    </Tag>
  ) : (
    ''
  );
};

export const ItemCodeAccessor = (row: ItemTableRow) =>
  row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {intl.get(row.type)}
    </Tag>
  ) : (
    ''
  );

export const QuantityOnHandCell = ({ item }: { item: ItemTableRow }) => {
  const value = item.quantityOnHand;
  if (isBlank(value)) {
    return null;
  }
  const quantityOnHand = Number(value);

  if (Number.isNaN(quantityOnHand)) {
    return null;
  }
  const reorderPoint =
    item.reorderPoint === null || item.reorderPoint === undefined
      ? null
      : Number(item.reorderPoint);
  const isLowStock =
    reorderPoint !== null &&
    !Number.isNaN(reorderPoint) &&
    quantityOnHand <= reorderPoint;

  return (
    <span
      className={clsx({
        quantity_on_hand: quantityOnHand < 0,
        'low-stock': isLowStock,
      })}
      title={isLowStock ? intl.get('reorder_point_reached') : undefined}
    >
      {value}
    </span>
  );
};

export const CostPriceCell = ({ cell: { value } }: CellProps) => {
  return !isBlank(value) ? (
    <Money amount={value as number} currency={'USD'} />
  ) : null;
};

export const SellPriceCell = ({ cell: { value } }: CellProps) => {
  return !isBlank(value) ? (
    <Money amount={value as number} currency={'USD'} />
  ) : null;
};

export const ItemTypeAccessor = (row: ItemTableRow) => {
  return row.typeFormatted ? (
    <Tag round minimal intent={Intent.NONE}>
      {row.typeFormatted}
    </Tag>
  ) : null;
};

export function ItemsActionMenuList({
  row: { original },
  payload: {
    onEditItem,
    onInactivateItem,
    onActivateItem,
    onMakeAdjustment,
    onDeleteItem,
    onDuplicate,
    onViewDetails,
  },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={<T id={'view_details'} />}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={ItemAction.Edit} a={AbilitySubject.Item}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_item')}
          onClick={safeCallback(onEditItem, original)}
        />
      </Can>
      <Can I={ItemAction.Create} a={AbilitySubject.Item}>
        <MenuItem
          icon={<Icon icon="content-copy" iconSize={16} />}
          text={intl.get('duplicate')}
          onClick={safeCallback(onDuplicate, original)}
        />
      </Can>
      <Can I={ItemAction.Edit} a={AbilitySubject.Item}>
        <If condition={!!original.active}>
          <MenuItem
            text={intl.get('inactivate_item')}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={safeCallback(onInactivateItem, original)}
          />
        </If>

        <If condition={!original.active}>
          <MenuItem
            text={intl.get('activate_item')}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={safeCallback(onActivateItem, original)}
          />
        </If>
      </Can>
      <Can
        I={InventoryAdjustmentAction.Edit}
        a={AbilitySubject.InventoryAdjustment}
      >
        <If condition={original.type === 'inventory'}>
          <MenuItem
            text={intl.get('make_adjustment')}
            icon={<Icon icon={'swap-vert'} iconSize={16} />}
            onClick={safeCallback(onMakeAdjustment, original)}
          />
        </If>
      </Can>
      <Can I={ItemAction.Delete} a={AbilitySubject.Item}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_item')}
          icon={<Icon icon="trash-16" iconSize={16} />}
          onClick={safeCallback(onDeleteItem, original)}
          intent={Intent.DANGER}
        />
      </Can>
    </Menu>
  );
}

export const ItemsActionsTableCell = (props: ActionsMenuProps) => {
  return (
    <Popover
      position={Position.RIGHT_BOTTOM}
      content={<ItemsActionMenuList {...props} />}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
};

const column = createColumnHelper<BP_TableFeatures, ItemTableRow>();

export function useItemsTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('name', {
          id: 'name',
          header: intl.get('item_name'),
          size: 180,
        }),
        column.accessor('code', {
          id: 'code',
          header: intl.get('item_code'),
          size: 120,
          meta: { bodyCellClassName: Classes.TEXT_MUTED },
        }),
        column.accessor('typeFormatted', {
          id: 'type',
          header: intl.get('item_type'),
          size: 120,
          cell: ({ row }) => ItemTypeAccessor(row.original),
        }),
        column.accessor((row) => row.category?.name, {
          id: 'category',
          header: intl.get('category'),
          size: 150,
          meta: { bodyCellClassName: Classes.TEXT_MUTED },
        }),
        column.accessor('sellPriceFormatted', {
          id: 'sell_price',
          header: intl.get('sell_price'),
          size: 150,
          meta: { bodyCellClassName: 'numeric-cell' },
        }),
        column.accessor('costPriceFormatted', {
          id: 'cost_price',
          header: intl.get('cost_price'),
          size: 150,
          meta: { bodyCellClassName: 'numeric-cell' },
        }),
        column.accessor('quantityOnHand', {
          id: 'quantity_on_hand',
          header: intl.get('quantity_on_hand'),
          size: 140,
          cell: ({ row }) => <QuantityOnHandCell item={row.original} />,
          meta: { bodyCellClassName: 'numeric-cell' },
        }),
      ]),
    [],
  );
}
