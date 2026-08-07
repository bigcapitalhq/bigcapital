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
import clsx from 'classnames';
import { isNumber } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { Item } from '@bigcapital/sdk-ts';
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

export const QuantityOnHandCell = ({ cell: { value } }: CellProps) => {
  const num = value as number;
  return isNumber(value) ? (
    <span className={num < 0 ? 'quantity_on_hand' : undefined}>{value}</span>
  ) : null;
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

/**
 * Retrieve all items table columns.
 */
export const useItemsTableColumns = (): DataTableColumn<ItemTableRow>[] => {
  return React.useMemo(
    () =>
      [
        {
          id: 'name',
          Header: intl.get('item_name'),
          accessor: 'name',
          className: 'name',
          width: 180,
          clickable: true,
          textOverview: true,
        },
        {
          id: 'code',
          Header: intl.get('item_code'),
          accessor: 'code',
          className: clsx(Classes.TEXT_MUTED),
          width: 120,
          clickable: true,
        },
        {
          id: 'type',
          Header: intl.get('item_type'),
          accessor: ItemTypeAccessor,
          className: 'item_type',
          width: 120,
          clickable: true,
        },
        {
          id: 'category',
          Header: intl.get('category'),
          accessor: 'category.name',
          className: clsx(Classes.TEXT_MUTED),
          width: 150,
          clickable: true,
          textOverview: true,
        },
        {
          id: 'sell_price',
          Header: intl.get('sell_price'),
          accessor: 'sellPriceFormatted',
          align: 'right',
          width: 150,
          clickable: true,
          money: true,
        },
        {
          id: 'cost_price',
          Header: intl.get('cost_price'),
          accessor: 'costPriceFormatted',
          align: 'right',
          width: 150,
          clickable: true,
          money: true,
        },
        {
          id: 'quantity_on_hand',
          Header: intl.get('quantity_on_hand'),
          accessor: 'quantityOnHand',
          Cell: QuantityOnHandCell,
          align: 'right',
          width: 140,
          clickable: true,
          money: true,
        },
      ] as DataTableColumn<ItemTableRow>[],
    [],
  );
};
