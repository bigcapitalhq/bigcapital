import { MenuItem } from '@blueprintjs/core';
import { ItemPredicate } from '@blueprintjs/select';
import React from 'react';
import intl from 'react-intl-universal';
import { FMultiSelect } from '../Forms';
import type { Warehouse } from '@bigcapital/sdk-ts';
import type {
  FormikItemRenderer,
  SelectOptionProps,
} from '@blueprintjs-formik/select';

export interface WarehouseSelectModel
  extends Partial<Warehouse>,
    SelectOptionProps {}

type FMultiSelectProps = React.ComponentProps<typeof FMultiSelect>;

interface WarehouseMultiSelectProps extends Omit<FMultiSelectProps, 'items'> {
  warehouses?: WarehouseSelectModel[];
}

const warehouseItemPredicate: ItemPredicate<WarehouseSelectModel> = (
  query,
  warehouse,
  _index,
  exactMatch,
) => {
  const normalizedTitle = (warehouse.name ?? '').toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  }
  return `${warehouse.code}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
};

const warehouseItemRenderer: FormikItemRenderer<WarehouseSelectModel> = (
  warehouse,
  { handleClick, modifiers },
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

export function WarehouseMultiSelect({
  warehouses = [],
  ...rest
}: WarehouseMultiSelectProps): React.ReactElement {
  return (
    <FMultiSelect<WarehouseSelectModel>
      items={warehouses}
      placeholder={intl.get('warehouses_multi_select.placeholder')}
      popoverProps={{ minimal: true, usePortal: false }}
      itemPredicate={warehouseItemPredicate}
      itemRenderer={warehouseItemRenderer}
      valueAccessor={'id'}
      labelAccessor={'code'}
      tagAccessor={'name'}
      {...rest}
    />
  );
}
