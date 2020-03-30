import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardConnect from 'connectors/Dashboard.connector';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import CategoryList from 'components/Items/categoryList';
import ItemFormDialog from 'connectors/ItemFormDialog.connect';
import { compose } from 'utils';

const ItemCategoryList = ({ changePageTitle }) => {
  const { id } = useParams();

  useEffect(() => {
    id
      ? changePageTitle('Edit Category Details')
      : changePageTitle('Category List');
  }, []);
  return (
    <DashboardInsider isLoading={null} name={'item-category-list'}>
      <CategoryList />
    </DashboardInsider>
  );
};

export default compose(DashboardConnect, ItemFormDialog)(ItemCategoryList);
