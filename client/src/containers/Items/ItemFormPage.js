import React, {useCallback } from 'react';
import { useParams,useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import ItemForm from 'containers/Items/ItemForm';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';
import withItemsActions from './withItemsActions';

import { compose } from 'utils';


const ItemFormContainer = ({
  // #withDashboardActions
  changePageTitle,

  // #withAccountsActions
  requestFetchAccounts,

  // #withItemsActions
  requestFetchItems,

  // #withItemCategoriesActions
  requestFetchItemCategories,
}) => {
  const { id } = useParams();
  const history = useHistory();

  const fetchAccounts = useQuery('accounts-list',
    (key) => requestFetchAccounts());

  const fetchCategories = useQuery('item-categories-list',
    (key) => requestFetchItemCategories());

 const fetchItemDetail = useQuery(
  id && ['item-detail-list', id],
  (key) => requestFetchItems());

const handleFormSubmit =useCallback((payload)=>{

  payload.redirect && history.push('/items/new');

},[history]) 

const handleCancel =useCallback(()=>{

  history.push('/items/new');
},[history])

  return (
    <DashboardInsider
      loading={fetchItemDetail.isFetching || fetchAccounts.isFetching || fetchCategories.isFetching }
      name={'item-form'}>
      <ItemForm 
      itemId={id} 
      onFormSubmit={handleFormSubmit}
      onCancelForm={handleCancel}
      />
    </DashboardInsider>
  );
};

export default compose(
  withDashboardActions,
  withAccountsActions,
  withItemCategoriesActions,
  withItemsActions
)(ItemFormContainer);
