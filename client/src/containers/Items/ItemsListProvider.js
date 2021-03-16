import React, { useEffect, createContext } from 'react';
import { useIntl } from 'react-intl';

import { transformTableQueryToParams, isTableEmptyStatus } from 'utils';

import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useItems } from 'hooks/query';
import { useDashboardPageTitle } from 'hooks/state';

const ItemsContext = createContext();

/**
 * Items list provider.
 */
function ItemsListProvider({
  query,
  ...props
}) {
  // Fetch accounts resource views and fields.
  const { data: itemsViews, isLoading: isViewsLoading } = useResourceViews(
    'items',
  );

  // Fetch the accounts resource fields.
  const { data: itemsFields, isLoading: isFieldsLoading } = useResourceFields(
    'items',
  );

  // Handle fetching the items table based on the given query.
  const {
    data: { items, pagination, filterMeta },
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems({
    ...transformTableQueryToParams(query)
  }, { keepPreviousData: true });

  // Detarmines the datatable empty status.
  const isEmptyStatus = isTableEmptyStatus({
    data: items, pagination, filterMeta,
  }) && !isItemsFetching;

  // Format message intl.
  const { formatMessage } = useIntl();
  
  // Change page title dispatcher.
  const changePageTitle = useDashboardPageTitle();

  // Changeas the page title once the page mount.
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
    isItemsFetching: isItemsFetching,
    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isFieldsLoading}
      name={'items-list'}
    >
      <ItemsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useItemsListContext = () => React.useContext(ItemsContext);

export { ItemsListProvider, useItemsListContext };
