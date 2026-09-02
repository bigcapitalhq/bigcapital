import {
  fetchSaleInvoices,
  fetchSaleEstimates,
  fetchItems,
  fetchSaleReceipts,
  fetchBills,
  fetchPaymentsReceived,
  fetchBillPayments,
  fetchCustomers,
  fetchVendors,
  fetchManualJournals,
  fetchAccounts,
  fetchCreditNotes,
  fetchVendorCredits,
} from '@bigcapital/sdk-ts';
import { useQuery } from '@tanstack/react-query';
import { defaultTo } from 'lodash';
import { useRef } from 'react';
import { useApiFetcher } from '../../useRequest';
import type { ApiFetcher } from '@bigcapital/sdk-ts';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';

interface ResourceData {
  items: unknown[];
}

type ResourceFetcher = (
  fetcher: ApiFetcher,
  query?: { search_keyword?: string },
) => Promise<unknown>;

type ResourceDataTransformer = (data: any) => ResourceData;

/**
 * Fetches the given resource list (for universal search) through the typed
 * SDK fetch functions, keyed by resource type.
 *
 * @param {string} type - Resource type.
 * @param {object} query - Query params, e.g. `{ search_keyword }`.
 * @param {*} props - Additional react-query options.
 * @returns
 */
export function useResourceData(
  type: string,
  query?: unknown,
  props?: unknown,
) {
  const fetcher = useApiFetcher();
  const fetchResource = getResourceFetcherFromType(type);
  const { defaultData: defaultDataProp, ...restProps } = (props ?? {}) as {
    defaultData?: ResourceData;
  } & Record<string, unknown>;

  const states = useQuery({
    queryKey: ['UNIVERSAL_SEARCH', type, query],
    queryFn: () => {
      if (!fetchResource) {
        throw new Error(`Unknown resource type: ${type}`);
      }
      return fetchResource(fetcher, query as { search_keyword?: string });
    },
    select: transformResourceData(type),
    placeholderData: defaultDataProp ?? { items: [] },
    ...(restProps as object),
  } as any);
  const defaultData = useRef(defaultDataProp ?? { items: [] });

  return {
    ...states,
    data: defaultTo(states.data, defaultData.current) as ResourceData,
  };
}

/**
 * Retrieve the resource fetcher by the given resource type.
 * @param {string} type - Resource type.
 * @returns {ResourceFetcher}
 */
function getResourceFetcherFromType(type: string): ResourceFetcher | undefined {
  const config: Record<string, ResourceFetcher> = {
    [RESOURCES_TYPES.INVOICE]: fetchSaleInvoices as ResourceFetcher,
    [RESOURCES_TYPES.ESTIMATE]: fetchSaleEstimates as ResourceFetcher,
    [RESOURCES_TYPES.ITEM]: fetchItems as ResourceFetcher,
    [RESOURCES_TYPES.RECEIPT]: fetchSaleReceipts as ResourceFetcher,
    [RESOURCES_TYPES.BILL]: fetchBills as ResourceFetcher,
    [RESOURCES_TYPES.PAYMENT_RECEIVE]: fetchPaymentsReceived as ResourceFetcher,
    [RESOURCES_TYPES.PAYMENT_MADE]: fetchBillPayments as ResourceFetcher,
    [RESOURCES_TYPES.CUSTOMER]: fetchCustomers as ResourceFetcher,
    [RESOURCES_TYPES.VENDOR]: fetchVendors as ResourceFetcher,
    [RESOURCES_TYPES.MANUAL_JOURNAL]: fetchManualJournals as ResourceFetcher,
    [RESOURCES_TYPES.ACCOUNT]: fetchAccounts as ResourceFetcher,
    [RESOURCES_TYPES.CREDIT_NOTE]: fetchCreditNotes as ResourceFetcher,
    [RESOURCES_TYPES.VENDOR_CREDIT]: fetchVendorCredits as ResourceFetcher,
  };
  return config[type];
}

/**
 * Transformes invoices to resource data.
 */
const transformInvoices: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

/**
 * Transformes items to resource data.
 */
const transformItems: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

/**
 * Transformes payment receives to resource data.
 */
const transformPaymentReceives: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

/**
 * Transformes customers to resoruce data.
 */
const transformCustomers: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

/**
 * Transformes customers to resoruce data.
 */
const transformVendors: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

const transformPaymentMades: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

const transformSaleReceipts: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

const transformBills: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

const transformManualJournals: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

const transformsEstimates: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

const transformAccounts: ResourceDataTransformer = (data) => ({
  items: Array.isArray(data) ? data : (data?.accounts ?? []),
});

const transformCreditNotes: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

const transformVendorCredits: ResourceDataTransformer = (data) => ({
  items: data?.data ?? [],
});

/**
 * Detarmines the transformer based on the given resource type.
 * @param {string} type - Resource type.
 */
const transformResourceData =
  (type: string): ((data: any) => { items: unknown[]; _type: string }) =>
  (data) => {
    const pairs: Record<string, ResourceDataTransformer> = {
      [RESOURCES_TYPES.ESTIMATE]: transformsEstimates,
      [RESOURCES_TYPES.INVOICE]: transformInvoices,
      [RESOURCES_TYPES.RECEIPT]: transformSaleReceipts,
      [RESOURCES_TYPES.ITEM]: transformItems,
      [RESOURCES_TYPES.PAYMENT_RECEIVE]: transformPaymentReceives,
      [RESOURCES_TYPES.PAYMENT_MADE]: transformPaymentMades,
      [RESOURCES_TYPES.CUSTOMER]: transformCustomers,
      [RESOURCES_TYPES.VENDOR]: transformVendors,
      [RESOURCES_TYPES.BILL]: transformBills,
      [RESOURCES_TYPES.MANUAL_JOURNAL]: transformManualJournals,
      [RESOURCES_TYPES.ACCOUNT]: transformAccounts,
      [RESOURCES_TYPES.CREDIT_NOTE]: transformCreditNotes,
      [RESOURCES_TYPES.VENDOR_CREDIT]: transformVendorCredits,
    };
    return {
      ...pairs[type](data),
      _type: type,
    };
  };
