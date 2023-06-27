// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';
import { FMultiSelect } from '../Forms';

/**
 *
 * @param {*} query
 * @param {*} warehouse
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const warehouseItemPredicate = (query, warehouse, _index, exactMatch) => {
  const normalizedTitle = warehouse.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return (
      `${warehouse.code}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
    );
  }
};

/**
 *
 * @param {*} branch
 * @param {*} param1
 * @returns
 */
const warehouseItemRenderer = (
  warehouse,
  { handleClick, modifiers, query },
  { isSelected },
) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      icon={isSelected ? 'tick' : 'blank'}
      text={warehouse.name}
      label={warehouse.code}
      key={warehouse.id}
      onClick={handleClick}
    />
  );
};

const warehouseSelectProps = {
  itemPredicate: warehouseItemPredicate,
  itemRenderer: warehouseItemRenderer,
  valueAccessor: (item) => item.id,
  labelAccessor: (item) => item.code,
  tagRenderer: (item) => item.name,
};

/**
 * warehouses multi select.
 * @param {*} param0
 * @returns
 */
export function WarehouseMultiSelect({ warehouses, ...rest }) {
  return (
    <FMultiSelect
      items={warehouses}
      placeholder={intl.get('warehouses_multi_select.placeholder')}
      popoverProps={{ minimal: true, usePortal: false }}
      {...warehouseSelectProps}
      {...rest}
    />
  );
}
