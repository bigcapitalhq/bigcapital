import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { PaymentMadeTableRow } from './components';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  usePaymentMades,
  useResourceMeta,
  useSettingsBillPayments,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

interface PaymentMadesListProviderProps {
  query?: any;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

export interface PaymentMadesListContextValue {
  paymentMades: PaymentMadeTableRow[] | undefined;
  pagination: { total?: number; [key: string]: any } | undefined;
  filterMeta: any;
  paymentMadesViews: any;
  fields: IResourceField[];
  resourceMeta: any;
  billPaymentSettings: SettingsGroup | undefined;
  isResourceMetaLoading: boolean;
  isResourceMetaFetching: boolean;
  isPaymentsLoading: boolean;
  isPaymentsFetching: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;
}

const PaymentMadesListContext = createContext<PaymentMadesListContextValue>(
  {} as PaymentMadesListContextValue,
);

function PaymentMadesListProvider({
  query,
  tableStateChanged,
  ...props
}: PaymentMadesListProviderProps) {
  const { data: paymentMadesViews, isLoading: isViewsLoading } =
    useResourceViews('bill_payments');

  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('bill_payments');

  const {
    data: paymentMadesData,
    isLoading: isPaymentsLoading,
    isFetching: isPaymentsFetching,
  } = usePaymentMades(query);

  const listData = paymentMadesData as
    | {
        data?: PaymentMadeTableRow[];
        pagination?: { total?: number; [key: string]: any };
        filter_meta?: any;
      }
    | undefined;

  const { data: billPaymentSettings } = useSettingsBillPayments();

  const isEmptyStatus =
    isEmpty(listData?.data) && !isPaymentsLoading && !tableStateChanged;

  const provider: PaymentMadesListContextValue = {
    paymentMades: listData?.data,
    pagination: listData?.pagination,
    filterMeta: listData?.filter_meta,
    paymentMadesViews,

    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    resourceMeta,
    billPaymentSettings,
    isResourceMetaLoading,
    isResourceMetaFetching,

    isPaymentsLoading,
    isPaymentsFetching,
    isViewsLoading,
    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceMetaLoading}
      name={'payment-mades-list'}
    >
      <PaymentMadesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentMadesListContext = () =>
  React.useContext(PaymentMadesListContext);

export { PaymentMadesListProvider, usePaymentMadesListContext };
