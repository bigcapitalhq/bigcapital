import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useBills } from 'hooks/query';

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
    data: { bills, pagination },
    isFetching: isBillsLoading,
  } = useBills(query);

  // Provider payload.
  const provider = {
    bills,
    pagination,
    billsFields,
    billsViews,

    isBillsLoading,
    isFieldsLoading,
    isViewsLoading,
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
