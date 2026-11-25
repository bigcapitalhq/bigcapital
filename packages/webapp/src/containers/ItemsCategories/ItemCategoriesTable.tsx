import { BP_Table as BlueprintTable } from '@bigcapitalhq/blueprintjs-react-table';
import '@bigcapitalhq/blueprintjs-react-table/styles.css';
import * as FF from 'fp-ts/function';
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
import {
  DashboardContentTable,
  MaterialProgressBar,
  EmptyStatus,
} from '@/components';
import {
  getDashboardTableProps,
  getRowId,
  TABLE_LOADING_OPTIONS,
  useTableRowSelection,
} from '@/components/Datatable/blueprintTable';
import { isSmallTableSize } from '@/constants/tables';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

const EMPTY_ROWS: ItemCategoryTableRow[] = [];

interface ItemsCategoryTableProps
  extends WithAlertActionsProps,
    WithDialogActionsProps,
    WithItemCategoriesActionsProps,
    Pick<WithItemCategoriesProps, 'itemsCategoriesSelectedRows'> {}

interface ActionMenuListPayload {
  onDeleteCategory: (category: ItemCategoryTableRow) => void;
  onEditCategory: (category: ItemCategoryTableRow) => void;
}

/**
 * Items categories table.
 */
function ItemsCategoryTable({
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

  const { rowSelection, onRowSelectionChange } = useTableRowSelection(
    itemsCategoriesSelectedRows,
    setItemsCategoriesSelectedRows,
  );

  const payload: ActionMenuListPayload = {
    onDeleteCategory: handleDeleteCategory,
    onEditCategory: handleEditCategory,
  };

  return (
    <DashboardContentTable>
      {isCategoriesFetching && !isCategoriesLoading && <MaterialProgressBar />}
      <BlueprintTable
        columns={columns}
        data={itemsCategories ?? EMPTY_ROWS}
        getRowId={getRowId}
        enableRowHeader={false}
        {...getDashboardTableProps(
          isSmallTableSize(itemsCategoriesSettings?.tableSize),
        )}
        enableSorting
        getCellProps={({ row, column }) => ({
          'data-testId': column.id === 'name' ? 'category-row' : undefined,
          'data-category-id': row.original.id,
        })}
        showRowSelectionCheckboxes
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        enableGhostCells
        loadingOptions={isCategoriesLoading ? TABLE_LOADING_OPTIONS : undefined}
        enableBodyContextMenu={!isCategoriesFetching}
        bodyContextMenuRenderer={(context) => {
          const row = context.getTargetRow();
          return row && <ActionMenuList row={row} payload={payload} />;
        }}
      />
      {!isCategoriesLoading && !itemsCategories?.length && (
        <EmptyStatus
          title={intl.get('there_is_no_items_categories_in_table_yet')}
        />
      )}
    </DashboardContentTable>
  );
}

export const ItemCategoriesTable = FF.pipe(
  ItemsCategoryTable,
  withItemCategories(({ itemsCategoriesSelectedRows }) => ({
    itemsCategoriesSelectedRows,
  })),
  withItemCategoriesActions,
  withAlertActions,
  withDialogActions,
);
