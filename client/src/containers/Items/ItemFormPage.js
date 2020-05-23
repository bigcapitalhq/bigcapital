import React, { useEffect,useCallback } from 'react';
import { useParams,useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import ItemForm from 'containers/Items/ItemForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withDashboard from 'containers/Dashboard/withDashboard';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemCategoriesActions from 'containers/Items/withItemCategoriesActions';

import { compose } from 'utils';
import { FormattedMessage as T, useIntl } from 'react-intl';
import withItemsActions from './withItemsActions';


const ItemFormContainer = ({
  // #withDashboard
  changePageTitle,

  // #withAccountsActions
  requestFetchAccounts,

  // #withItemsActions
  requestFetchItems,

  // #withItemCategoriesActions
  requestFetchItemCategories,
}) => {
  const { id } = useParams();
  const {formatMessage} =useIntl()
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
},[])

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
  withDashboard,
  withAccountsActions,
  withItemCategoriesActions,
  withItemsActions
)(ItemFormContainer);
