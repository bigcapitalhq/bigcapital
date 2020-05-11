import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ItemCategoriesDataTable from 'containers/Items/ItemCategoriesTable';
import ItemsCategoryActionsBar from 'containers/Items/ItemsCategoryActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboard';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';
import { compose } from 'utils';
import { FormattedMessage as T, useIntl } from 'react-intl';


const ItemCategoryList = ({
  // #withDashboardActions
  changePageTitle,

  // #withItemCategoriesActions
  requestFetchItemCategories,
}) => {
  const { id } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);
  const {formatMessage} =useIntl()
  useEffect(() => {
    id
      ? changePageTitle(formatMessage({id:'edit_category_details'}))
      : changePageTitle(formatMessage({id:'category_list'}));
  }, []);

  const fetchCategories = useQuery('items-categories-table',
    () => { requestFetchItemCategories(); });

  const handleFilterChanged = useCallback(() => { 
    
  }, []);

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback((itemCategories) => {
    setSelectedRows(itemCategories);
  }, [setSelectedRows]);

  return (
    <DashboardInsider name={'item-category-list'}>
      <ItemsCategoryActionsBar
        onFilterChanged={handleFilterChanged}
        selectedRows={selectedRows} />

      <ItemCategoriesDataTable
        onSelectedRowsChange={handleSelectedRowsChange} />
    </DashboardInsider>
  );
};

export default compose(
  withDashboardActions,
  withItemCategoriesActions,
)(ItemCategoryList);
