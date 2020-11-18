import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import DashboardCard from 'components/Dashboard/DashboardCard';
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
  requestFetchItem,

  // #withItemCategoriesActions
  requestFetchItemCategories,
}) => {
  const { id } = useParams();
  const history = useHistory();

  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  const fetchCategories = useQuery('item-categories-list', (key) =>
    requestFetchItemCategories(),
  );

  const fetchItemDetail = useQuery(
    ['item', id],
    (key, _id) => requestFetchItem(_id),
    { enabled: id && id },
  );
  const handleFormSubmit = useCallback(
    (payload) => {
      payload.redirect && history.push('/items');
    },
    [history],
  );

  const handleCancel = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <DashboardInsider
      loading={
        fetchItemDetail.isFetching ||
        fetchAccounts.isFetching ||
        fetchCategories.isFetching
      }
      name={'item-form'}
    >
      <DashboardCard page>
        <ItemForm
          onFormSubmit={handleFormSubmit}
          itemId={id}
          onCancelForm={handleCancel}
        />
      </DashboardCard>
    </DashboardInsider>
  );
};

export default compose(
  withDashboardActions,
  withAccountsActions,
  withItemCategoriesActions,
  withItemsActions,
)(ItemFormContainer);
