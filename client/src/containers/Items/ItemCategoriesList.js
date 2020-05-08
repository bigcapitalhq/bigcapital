import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useAsync from 'hooks/async';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ItemCategoriesDataTable from 'containers/Items/ItemCategoriesTable';
import ItemsCategoryActionsBar from 'containers/Items/ItemsCategoryActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboard';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';
import withItemCategories from 'containers/Items/withItemCategories';
import { compose } from 'utils';


const ItemCategoryList = ({
  changePageTitle,
  requestFetchItemCategories,
}) => {
  const { id } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    id
      ? changePageTitle('Edit Category Details')
      : changePageTitle('Category List');
  }, []);

  const fetchCategories = useAsync(() => {
    return Promise.all([
      requestFetchItemCategories(),
    ]);
  });

  const handleFilterChanged = useCallback(() => { 
    
  }, []);

  return (
    <DashboardInsider name={'item-category-list'}>
      <ItemsCategoryActionsBar
        onFilterChanged={handleFilterChanged}
        selectedRows={selectedRows} />

      <ItemCategoriesDataTable />
    </DashboardInsider>
  );
};

export default compose(
  withDashboardActions,
  withItemCategoriesActions,
  withItemCategories,
)(ItemCategoryList);
