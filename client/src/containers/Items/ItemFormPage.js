import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import ItemForm from 'containers/Items/ItemForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withDashboard from 'containers/Dashboard/withDashboard';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';

import { compose } from 'utils';


const ItemFormContainer = ({
  // #withDashboard
  changePageTitle,

  // #withAccountsActions
  requestFetchAccounts,

  // #withItemCategoriesActions
  requestFetchItemCategories,
}) => {
  const { id } = useParams();

  useEffect(() => {
    id ?
      changePageTitle('Edit Item Details') :
      changePageTitle('New Item');
  }, [id, changePageTitle]);

  const fetchAccounts = useQuery('accounts-list',
    (key) => requestFetchAccounts());

  const fetchCategories = useQuery('item-categories-list',
    (key) => requestFetchItemCategories());

  return (
    <DashboardInsider
      loading={fetchAccounts.isFetching || fetchCategories.isFetching}
      name={'item-form'}>
      <ItemForm />
    </DashboardInsider>
  );
};

export default compose(
  withDashboard,
  withAccountsActions,
  withItemCategoriesActions,
)(ItemFormContainer);
