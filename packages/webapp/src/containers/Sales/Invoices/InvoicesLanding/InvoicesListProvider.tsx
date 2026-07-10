import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { InvoiceTableRow } from './components';
import { DashboardInsider } from '@/components/Dashboard';
import { useResourceViews, useResourceMeta, useInvoices } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import { IResourceField } from '@/components/AdvancedFilter/interfaces';

interface InvoicesListProviderProps {
  query?: any;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

export interface InvoicesListContextValue {
  invoices: InvoiceTableRow[] | undefined;
  pagination: { total?: number; [key: string]: any } | undefined;
  invoicesFields: IResourceField[];
  invoicesViews: any;
  isInvoicesLoading: boolean;
  isInvoicesFetching: boolean;
  isResourceFetching: boolean;
  isResourceLoading: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;
}

const InvoicesListContext = createContext<InvoicesListContextValue>(
  {} as InvoicesListContextValue,
);

/**
 * Invoices list data provider.
 */
function InvoicesListProvider({
  query,
  tableStateChanged,
  ...props
}: InvoicesListProviderProps) {
  const { data: invoicesViews, isLoading: isViewsLoading } =
    useResourceViews('sale_invoices');

  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('sale_invoices');

  const {
    data: invoicesData,
    isFetching: isInvoicesFetching,
    isLoading: isInvoicesLoading,
  } = useInvoices(query);

  const isEmptyStatus =
    isEmpty(invoicesData?.data) && !tableStateChanged && !isInvoicesLoading;

  const provider: InvoicesListContextValue = {
    invoices: invoicesData?.data,
    pagination: invoicesData?.pagination,

    invoicesFields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    invoicesViews,

    isInvoicesLoading,
    isInvoicesFetching,
    isResourceFetching,
    isResourceLoading,
    isViewsLoading,

    isEmptyStatus,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'sales-invoices-list'}
    >
      <InvoicesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useInvoicesListContext = () => React.useContext(InvoicesListContext);

export { InvoicesListProvider, useInvoicesListContext };
