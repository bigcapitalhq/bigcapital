import {
  Menu,
  Popover,
  Button,
  Position,
  MenuItem,
  MenuDivider,
  Intent,
} from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import type { ItemCategory } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Icon } from '@/components';
import { safeCallback } from '@/utils';

// `count` is returned by the server at runtime but not declared on the SDK type.
export type ItemCategoryTableRow = ItemCategory & { count?: number };

interface ActionMenuListPayload {
  onEditCategory: (category: ItemCategoryTableRow) => void;
  onDeleteCategory: (category: ItemCategoryTableRow) => void;
}

interface ActionMenuListProps {
  row: { original: ItemCategoryTableRow };
  payload: ActionMenuListPayload;
}

/**
 * Row actions menu list.
 */
export function ActionMenuList({
  row: { original },
  payload: { onEditCategory, onDeleteCategory },
}: ActionMenuListProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_category')}
        onClick={safeCallback(onEditCategory, original)}
      />
      <MenuDivider />
      <MenuItem
        text={intl.get('delete_category')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDeleteCategory, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Table actions cell.
 */
export function TableActionsCell(props: ActionMenuListProps) {
  return (
    <Popover
      content={<ActionMenuList {...props} />}
      position={Position.RIGHT_TOP}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

const column = createColumnHelper<BP_TableFeatures, ItemCategoryTableRow>();

export function useItemsCategoriesTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('name', {
          id: 'name',
          header: intl.get('category_name'),
          size: 220,
        }),
        column.accessor('count', {
          id: 'count',
          header: intl.get('count'),
          size: 180,
        }),
        column.accessor('description', {
          id: 'description',
          header: intl.get('description'),
          size: 220,
        }),
      ]),
    [],
  );
}
