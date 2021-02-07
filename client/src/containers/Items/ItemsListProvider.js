import React, { useEffect, createContext } from 'react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useItems } from 'hooks/query';
import { useDashboardPageTitle } from 'hooks/state';

const ItemsContext = createContext();

function ItemsListProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: itemsViews, isFetching: isViewsLoading } = useResourceViews(
    'items',
  );

  // Fetch the accounts resource fields.
  const { data: itemsFields, isFetching: isFieldsLoading } = useResourceFields(
    'items',
  );

  // Handle fetching the items table based on the given query.
  const {
    data: { items, pagination, filterMeta },
    isFetching: isItemsLoading,
  } = useItems(query);

  // Detarmines the datatable empty status.
  const isEmptyStatus = isEmpty(items) && !isItemsLoading && !filterMeta.view;

  // Format message intl.
  const { formatMessage } = useIntl();
  
  // Change page title dispatcher.
  const changePageTitle = useDashboardPageTitle();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'items_list' }));
  }, [changePageTitle, formatMessage]);

  const state = {
    itemsViews,
    itemsFields,
    items,
    pagination,

    isViewsLoading,
    isItemsLoading,
    isEmptyStatus: false,
  };

  return (
    <DashboardInsider
      loading={isFieldsLoading || isViewsLoading}
      name={'items-list'}
    >
      <ItemsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useItemsListContext = () => React.useContext(ItemsContext);

export { ItemsListProvider, useItemsListContext };
