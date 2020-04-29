import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import DashboardConnect from 'connectors/Dashboard.connector';
import ItemForm from 'components/Items/ItemForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ItemsConnect from 'connectors/Items.connect';
import AccountsConnect from 'connectors/Accounts.connector';
import ItemCategoryConnect from 'connectors/ItemsCategory.connect';
import { compose } from 'utils';

const ItemFormContainer = ({
  changePageTitle,
  requestFetchAccounts,
  requestFetchItemCategories,
}) => {
  const { id } = useParams();

  useEffect(() => {
    id ?
      changePageTitle('Edit Item Details') :
      changePageTitle('New Item');
  }, [id, changePageTitle]);

  const fetchHook = useAsync(async () => {
    await Promise.all([
      requestFetchAccounts(),
      requestFetchItemCategories(),
    ]);
  });
  return (
    <DashboardInsider loading={fetchHook.loading} name={'item-form'}>
      <ItemForm />
    </DashboardInsider>
  );
};

export default compose(
  DashboardConnect,
  ItemsConnect,
  AccountsConnect,
  ItemCategoryConnect,
)(ItemFormContainer);
