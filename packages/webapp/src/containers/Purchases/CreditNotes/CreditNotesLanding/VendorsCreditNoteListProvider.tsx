// @ts-nocheck
import React from 'react';
import { isEmpty } from 'lodash';

import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceMeta,
  useVendorCredits,
  useRefreshVendorCredits,
} from '@/hooks/query';

import { getFieldsFromResourceMeta } from '@/utils';

const VendorsCreditNoteListContext = React.createContext();

/**
 * Vendors Credit note data provider.
 */
function VendorsCreditNoteListProvider({ query, tableStateChanged, ...props }) {
  // Vendor Credits refresh action.
  const { refresh } = useRefreshVendorCredits();

  // Fetch accounts resource views and fields.
  const { data: VendorCreditsViews, isLoading: isViewsLoading } =
    useResourceViews('vendor_credits');

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('vendor_credits');

  // Fetch vendor credits list.
  const {
    data: { vendorCredits, pagination, filterMeta },
    isLoading: isVendorCreditsLoading,
    isFetching: isVendorCreditsFetching,
  } = useVendorCredits(query, { keepPreviousData: true });

  // Determines the datatable empty status.
  const isEmptyStatus =
    isEmpty(vendorCredits) && !isVendorCreditsLoading && !tableStateChanged;

  // Provider payload.
  const provider = {
    vendorCredits,
    pagination,
    VendorCreditsViews,
    refresh,

    resourceMeta,
    fields: getFieldsFromResourceMeta(resourceMeta.fields),
    isResourceLoading,
    isResourceFetching,

    isVendorCreditsFetching,
    isVendorCreditsLoading,
    isViewsLoading,
    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'vendor-credits'}
    >
      <VendorsCreditNoteListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useVendorsCreditNoteListContext = () =>
  React.useContext(VendorsCreditNoteListContext);

export { VendorsCreditNoteListProvider, useVendorsCreditNoteListContext };
