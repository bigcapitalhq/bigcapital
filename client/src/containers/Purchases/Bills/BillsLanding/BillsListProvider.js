import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useBills } from 'hooks/query';
import { isTableEmptyStatus }  from 'utils';

const BillsListContext = createContext();

/**
 * Accounts chart data provider.
 */
function BillsListProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: billsViews, isFetching: isViewsLoading } = useResourceViews(
    'bills',
  );

  // Fetch the accounts resource fields.
  const {
    data: billsFields,
    isFetching: isFieldsLoading,
  } = useResourceFields('bills');

  // Fetch accounts list according to the given custom view id.
  const {
    data: { bills, pagination, filterMeta },
    isLoading: isBillsLoading,
    isFetching: isBillsFetching,
  } = useBills(query, { keepPreviousData: true });

  // Detarmines the datatable empty status.
  const isEmptyStatus = isTableEmptyStatus({
    data: bills, pagination, filterMeta,
  }) && !isBillsFetching;

  // Provider payload.
  const provider = {
    bills,
    pagination,
    billsFields,
    billsViews,

    isBillsLoading,
    isBillsFetching,
    isFieldsLoading,
    isViewsLoading,
    isEmptyStatus
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'bills'}
    >
      <BillsListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useBillsListContext = () => React.useContext(BillsListContext);

export { BillsListProvider, useBillsListContext };
