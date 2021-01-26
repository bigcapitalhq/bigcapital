import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import ItemsAlerts from './ItemsAlerts';
import ItemCategoriesDataTable from 'containers/Items/ItemCategoriesTable';
import ItemsCategoryActionsBar from 'containers/Items/ItemsCategoryActionsBar';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Item categories list.
 */
const ItemCategoryList = ({
  // #withDashboardActions
  changePageTitle,

  // #withAlertsActions.
  openAlert,

  // #withItemCategoriesActions
  requestFetchItemCategories,
  setSelectedRowsCategories,

  // #withDialog
  openDialog,
}) => {
  const { id } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    id
      ? changePageTitle(formatMessage({ id: 'edit_category_details' }))
      : changePageTitle(formatMessage({ id: 'category_list' }));
  }, [id, changePageTitle, formatMessage]);

  const fetchCategories = useQuery(['items-categories-list'], () =>
    requestFetchItemCategories(),
  );

  const handleFilterChanged = useCallback(() => {}, []);

  // Handle selected rows change.
  const handleSelectedRowsChange = (selectedRows) => {
    const selectedRowsIds = selectedRows.map((r) => r.id);
    setSelectedRowsCategories(selectedRowsIds);
  };

  // Handle delete Item.
  const handleDeleteCategory = ({ id }) => {
    openAlert('item-category-delete', { itemCategoryId: id });
  };

  // Handle Edit item category.
  const handleEditCategory = (category) => {
    openDialog('item-category-form', { action: 'edit', id: category.id });
  };

  return (
    <DashboardInsider name={'item-category-list'}>
      <ItemsCategoryActionsBar onFilterChanged={handleFilterChanged} />
      <DashboardPageContent>
        <ItemCategoriesDataTable
          onDeleteCategory={handleDeleteCategory}
          onEditCategory={handleEditCategory}
          onSelectedRowsChange={handleSelectedRowsChange}
        />
      </DashboardPageContent>
      <ItemsAlerts />
    </DashboardInsider>
  );
};

export default compose(
  withItemCategoriesActions,
  withDashboardActions,
  withDialogActions,
  withAlertsActions,
)(ItemCategoryList);
