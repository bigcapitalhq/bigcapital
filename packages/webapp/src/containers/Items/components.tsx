// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { isNumber } from 'lodash';
import {
  Menu,
  MenuDivider,
  MenuItem,
  Intent,
  Tag,
  Position,
  Button,
  Popover,
} from '@blueprintjs/core';
import { FormattedMessage as T, Icon, Money, If, Can } from '@/components';
import { isBlank, safeCallback } from '@/utils';
import {
  AbilitySubject,
  ItemAction,
  InventoryAdjustmentAction,
} from '@/constants/abilityOption';

/**
 * Publish accessor
 */
export const PublishAccessor = (r) => {
  return r.is_published ? (
    <Tag minimal={true}>
      <T id={'published'} />
    </Tag>
  ) : (
    <Tag minimal={true} intent={Intent.WARNING}>
      <T id={'draft'} />
    </Tag>
  );
};

export const TypeAccessor = (row) => {
  return row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {intl.get(row.type)}
    </Tag>
  ) : (
    ''
  );
};

export const ItemCodeAccessor = (row) =>
  row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {intl.get(row.type)}
    </Tag>
  ) : (
    ''
  );

export const QuantityOnHandCell = ({ cell: { value } }) => {
  return isNumber(value) ? (
    <span className={value < 0 ? 'quantity_on_hand' : null}>{value}</span>
  ) : null;
};

export const CostPriceCell = ({ cell: { value } }) => {
  return !isBlank(value) ? <Money amount={value} currency={'USD'} /> : null;
};

export const SellPriceCell = ({ cell: { value } }) => {
  return !isBlank(value) ? <Money amount={value} currency={'USD'} /> : null;
};

export const ItemTypeAccessor = (row) => {
  return row.type_formatted ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {row.type_formatted}
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
}) {
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
        <If condition={original.active}>
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

export const ItemsActionsTableCell = (props) => {
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
export const useItemsTableColumns = () => {
  return React.useMemo(
    () => [
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
        className: 'code',
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
        className: 'category',
        width: 150,
        clickable: true,
        textOverview: true,
      },
      {
        id: 'sell_price',
        Header: intl.get('sell_price'),
        accessor: 'sell_price_formatted',
        align: 'right',
        width: 150,
        clickable: true,
      },
      {
        id: 'cost_price',
        Header: intl.get('cost_price'),
        accessor: 'cost_price_formatted',
        align: 'right',
        width: 150,
        clickable: true,
      },
      {
        id: 'quantity_on_hand',
        Header: intl.get('quantity_on_hand'),
        accessor: 'quantity_on_hand',
        Cell: QuantityOnHandCell,
        align: 'right',
        width: 140,
        clickable: true,
      },
    ],
    [],
  );
};
