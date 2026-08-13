import React from 'react';
import intl from 'react-intl-universal';
import { useItemsCategoriesTableColumns, ActionMenuList } from './components';
import { useItemsCategoriesContext } from './ItemsCategoriesProvider';
import { withItemCategories } from './withItemCategories';
import { withItemCategoriesActions } from './withItemCategoriesActions';
import type { ItemCategoryTableRow } from './components';
import type { WithItemCategoriesProps } from './withItemCategories';
import type { WithItemCategoriesActionsProps } from './withItemCategoriesActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DataTable, TableSkeletonRows } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface ItemsCategoryTableProps
  extends WithAlertActionsProps,
    WithDialogActionsProps,
    WithItemCategoriesActionsProps,
    Pick<WithItemCategoriesProps, 'itemsCategoriesSelectedRows'> {
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

  // #withItemCategoriesActions
  setItemsCategoriesSelectedRows,

  // #withItemCategories
  itemsCategoriesSelectedRows,

  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,
}: ItemsCategoryTableProps) {
  // Items categories context.
  const {
    isCategoriesLoading,
    isCategoriesFetching,
    itemsCategories,
    itemsCategoriesSettings,
  } = useItemsCategoriesContext();
  const tableSize = itemsCategoriesSettings?.tableSize as string | undefined;

  // Table columns.
  const columns = useItemsCategoriesTableColumns();

  // Handle selected rows change.
  const handleSelectedRowsChange = React.useCallback(
    (selectedFlatRows: Array<{ original: ItemCategoryTableRow }>) => {
      const selectedIds = selectedFlatRows?.map((row) => row.original.id) ?? [];
      setItemsCategoriesSelectedRows(selectedIds);
    },
    [setItemsCategoriesSelectedRows],
  );

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
      onSelectedRowsChange={handleSelectedRowsChange}
      selectedRowsIds={itemsCategoriesSelectedRows}
      autoResetSelectedRows={false}
      TableLoadingRenderer={TableSkeletonRows}
      noResults={intl.get('there_is_no_items_categories_in_table_yet')}
      rowTestId={'category-row'}
      payload={payload}
      ContextMenu={ActionMenuList}
      size={tableSize}
      {...tableProps}
    />
  );
}

export const ItemCategoriesTable = compose(
  withDialogActions,
  withAlertActions,
  withItemCategoriesActions,
  withItemCategories(({ itemsCategoriesSelectedRows }) => ({
    itemsCategoriesSelectedRows,
  })),
)(ItemsCategoryTable);
