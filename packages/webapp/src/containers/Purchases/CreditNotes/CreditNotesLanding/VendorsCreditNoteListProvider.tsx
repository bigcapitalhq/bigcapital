import { isEmpty } from 'lodash';
import React from 'react';
import type { VendorCreditTableRow } from './components';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceMeta,
  useVendorCredits,
  useRefreshVendorCredits,
  useSettingsVendorCredits,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';
import type { SettingsGroup } from '@bigcapital/sdk-ts';

interface VendorsCreditNoteListProviderProps {
  query?: any;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

export interface VendorsCreditNoteListContextValue {
  vendorCredits: VendorCreditTableRow[] | undefined;
  pagination: { total?: number; [key: string]: any } | undefined;
  VendorCreditsViews: any;
  refresh: () => void;
  resourceMeta: any;
  fields: IResourceField[];
  vendorCreditSettings: SettingsGroup | undefined;
  isResourceLoading: boolean;
  isResourceFetching: boolean;
  isVendorCreditsFetching: boolean;
  isVendorCreditsLoading: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;
}

const VendorsCreditNoteListContext =
  React.createContext<VendorsCreditNoteListContextValue>(
    {} as VendorsCreditNoteListContextValue,
  );

function VendorsCreditNoteListProvider({
  query,
  tableStateChanged,
  ...props
}: VendorsCreditNoteListProviderProps) {
  const { refresh } = useRefreshVendorCredits();

  const { data: VendorCreditsViews, isLoading: isViewsLoading } =
    useResourceViews('vendor_credits');

  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('vendor_credits');

  const {
    data: vendorCreditsData,
    isLoading: isVendorCreditsLoading,
    isFetching: isVendorCreditsFetching,
  } = useVendorCredits(query);

  const listData = vendorCreditsData as
    | {
        data?: VendorCreditTableRow[];
        pagination?: { total?: number; [key: string]: any };
      }
    | undefined;

  const { data: vendorCreditSettings } = useSettingsVendorCredits();

  const isEmptyStatus =
    isEmpty(listData?.data) && !isVendorCreditsLoading && !tableStateChanged;

  const provider: VendorsCreditNoteListContextValue = {
    vendorCredits: listData?.data,
    pagination: listData?.pagination,
    VendorCreditsViews,
    refresh,

    resourceMeta,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    vendorCreditSettings,
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
