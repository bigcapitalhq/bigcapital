import React from 'react';
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
import { useIntl, FormattedMessage as T } from 'react-intl';
import { formatMessage } from 'services/intl';
import { isNumber } from 'lodash';
import { Icon, Money, If } from 'components';
import { isBlank, safeCallback } from 'utils';

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
      {formatMessage({ id: row.type })}
    </Tag>
  ) : (
    ''
  );
};

export const ItemCodeAccessor = (row) =>
  row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {formatMessage({ id: row.type })}
    </Tag>
  ) : (
    ''
  );

export const QuantityOnHandCell = ({ cell: { value } }) => {
  return isNumber(value) ? (
    <span className={'quantity_on_hand'}>{value}</span>
  ) : null;
};

export const CostPriceCell = ({ cell: { value } }) => {
  return !isBlank(value) ? <Money amount={value} currency={'USD'} /> : null;
};

export const SellPriceCell = ({ cell: { value } }) => {
  return !isBlank(value) ? <Money amount={value} currency={'USD'} /> : null;
};

export const ItemTypeAccessor = (row) => {
  return row.type ? (
    <Tag minimal={true} round={true} intent={Intent.NONE}>
      {formatMessage({ id: row.type })}
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
  },
}) {
  const { formatMessage } = useIntl();
 
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={<T id={'view_details'} />}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_item' })}
        onClick={safeCallback(onEditItem, original)}
      />
      <If condition={original.active}>
        <MenuItem
          text={formatMessage({ id: 'inactivate_item' })}
          icon={<Icon icon="pause-16" iconSize={16} />}
          onClick={safeCallback(onInactivateItem, original)}
        />
      </If>
      <If condition={!original.active}>
        <MenuItem
          text={formatMessage({ id: 'activate_item' })}
          icon={<Icon icon="play-16" iconSize={16} />}
          onClick={safeCallback(onActivateItem, original)}
        />
      </If>
      <If condition={original.type === 'inventory'}>
        <MenuItem
          text={formatMessage({ id: 'make_adjustment' })}
          icon={<Icon icon={'swap-vert'} iconSize={16} />}
          onClick={safeCallback(onMakeAdjustment, original)}
        />
      </If>
      <MenuItem
        text={formatMessage({ id: 'delete_item' })}
        icon={<Icon icon="trash-16" iconSize={16} />}
        onClick={safeCallback(onDeleteItem, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
};

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
