import React from 'react';
import intl from 'react-intl-universal';
import { useItemsCategoriesTableColumns, ActionMenuList } from './components';
import { useItemsCategoriesContext } from './ItemsCategoriesProvider';
import type { ItemCategoryTableRow } from './components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DataTable, TableSkeletonRows } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface ItemsCategoryTableProps
  extends WithAlertActionsProps,
    WithDialogActionsProps {
  tableProps?: Record<string, unknown>;
}

interface ActionMenuListPayload {
  onDeleteCategory: (category: ItemCategoryTableRow) => void;
  onEditCategory: (category: ItemCategoryTableRow) => void;
}

/**
 * Items categories table.
 */
function ItemsCategoryTable({
  // #ownProps
  tableProps,

  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,
}: ItemsCategoryTableProps) {
  // Items categories context.
  const { isCategoriesLoading, isCategoriesFetching, itemsCategories } =
    useItemsCategoriesContext();

  // Table columns.
  const columns = useItemsCategoriesTableColumns();

  // Handle delete Item.
  const handleDeleteCategory = ({ id }: ItemCategoryTableRow) => {
    openAlert('item-category-delete', { itemCategoryId: id });
  };

  // Handle Edit item category.
  const handleEditCategory = (category: ItemCategoryTableRow) => {
    openDialog('item-category-form', { action: 'edit', id: category.id });
  };

  const payload: ActionMenuListPayload = {
    onDeleteCategory: handleDeleteCategory,
    onEditCategory: handleEditCategory,
  };

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={itemsCategories || []}
      loading={isCategoriesLoading}
      headerLoading={isCategoriesLoading}
      progressBarLoading={isCategoriesFetching}
      expandable={false}
      sticky={true}
      selectionColumn={true}
      TableLoadingRenderer={TableSkeletonRows}
      noResults={intl.get('there_is_no_items_categories_in_table_yet')}
      payload={payload}
      ContextMenu={ActionMenuList}
      {...tableProps}
    />
  );
}

export const ItemCategoriesTable = compose(
  withDialogActions,
  withAlertActions,
)(ItemsCategoryTable);
