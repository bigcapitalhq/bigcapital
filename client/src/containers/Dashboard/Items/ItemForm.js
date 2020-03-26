import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import DashboardConnect from 'connectors/Dashboard.connector';
import ItemForm from 'components/Items/ItemForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ItemsConnect from 'connectors/Items.connect';
import { compose } from 'utils';
const ItemFormContainer = ({
  changePageTitle,
  fetchAccount,
  submitItem,
  editItem,
  fetchItems,
  fetchItem,
  deleteItem,
  accounts
}) => {
  const { id } = useParams();
  useEffect(() => {
    id ? changePageTitle('Edit Item Details') : changePageTitle('New Item');
  }, []);

  const fetchHook = useAsync(async () => {
    await Promise.all([fetchAccount()]);
  });
  return (
    <DashboardInsider isLoading={fetchHook.loading} name={'expense-form'}>
      <ItemForm
        {...{
          submitItem,
          editItem,
          fetchItem,
          fetchItems,
          deleteItem,
          accounts
        }}
      />
    </DashboardInsider>
  );
};

export default compose(
  DashboardConnect,
  ItemsConnect
  // AccountsConnect
)(ItemFormContainer);
