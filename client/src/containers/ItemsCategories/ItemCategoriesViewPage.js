import React from 'react';
import ItemCategoriesDataTable from './ItemCategoriesTable';

import withAlertActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Items categories view page.
 */
function ItemsCategoriesViewPage({
  // #withAlertsActions
  openAlert,

  // #withDialogActions
  openDialog,
}) {
  // Handle selected rows change.
  const handleSelectedRowsChange = (selectedRows) => {};

  // Handle delete Item.
  const handleDeleteCategory = ({ id }) => {
    openAlert('item-category-delete', { itemCategoryId: id });
  };

  // Handle Edit item category.
  const handleEditCategory = (category) => {
    openDialog('item-category-form', { action: 'edit', id: category.id });
  };

  return (
    <ItemCategoriesDataTable
      tableProps={{
        payload: {
          onDeleteCategory: handleDeleteCategory,
          onEditCategory: handleEditCategory,
        },
      }}
    />
  );
}

export default compose(
  withDialogActions,
  withAlertActions,
)(ItemsCategoriesViewPage);
