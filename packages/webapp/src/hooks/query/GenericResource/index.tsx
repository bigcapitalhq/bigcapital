import { useRequestQuery } from '../../useQueryRequest';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';

interface ResourceData {
  items: unknown[];
}

type ResourceDataTransformer = (response: any) => ResourceData;

/**
 *
 * @param {string} type
 * @param {string} searchKeyword
 * @param {*} query
 * @returns
 */
export function useResourceData(
  type: string,
  query?: unknown,
  props?: unknown,
) {
  const url = getResourceUrlFromType(type);

  return useRequestQuery<{ items: unknown[] }>(
    ['UNIVERSAL_SEARCH', type, query],
    { method: 'get', url, params: query },
    {
      select: transformResourceData(type),
      defaultData: {
        items: [],
      },
      ...(props as Record<string, unknown>),
    },
  );
}

/**
 * Retrieve the resource url by the given resource type.
 * @param {string} type
 * @returns {string}
 */
function getResourceUrlFromType(type: string): string {
  const config: Record<string, string> = {
    [RESOURCES_TYPES.INVOICE]: '/sale-invoices',
    [RESOURCES_TYPES.ESTIMATE]: '/sale-estimates',
    [RESOURCES_TYPES.ITEM]: '/items',
    [RESOURCES_TYPES.RECEIPT]: '/sale-receipts',
    [RESOURCES_TYPES.BILL]: '/bills',
    [RESOURCES_TYPES.PAYMENT_RECEIVE]: '/payments-received',
    [RESOURCES_TYPES.PAYMENT_MADE]: '/bill-payments',
    [RESOURCES_TYPES.CUSTOMER]: '/customers',
    [RESOURCES_TYPES.VENDOR]: '/vendors',
    [RESOURCES_TYPES.MANUAL_JOURNAL]: '/manual-journals',
    [RESOURCES_TYPES.ACCOUNT]: '/accounts',
    [RESOURCES_TYPES.CREDIT_NOTE]: '/credit-notes',
    [RESOURCES_TYPES.VENDOR_CREDIT]: '/vendor-credits',
  };
  return config[type] || '';
}

/**
 * Transformes invoices to resource data.
 */
const transformInvoices: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

/**
 * Transformes items to resource data.
 */
const transformItems: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

/**
 * Transformes payment receives to resource data.
 */
const transformPaymentReceives: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

/**
 * Transformes customers to resoruce data.
 */
const transformCustomers: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

/**
 * Transformes customers to resoruce data.
 */
const transformVendors: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

const transformPaymentMades: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

const transformSaleReceipts: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

const transformBills: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

const transformManualJournals: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

const transformsEstimates: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

const transformAccounts: ResourceDataTransformer = (response) => ({
  items: response.data.accounts,
});

const transformCreditNotes: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

const transformVendorCredits: ResourceDataTransformer = (response) => ({
  items: response.data.data,
});

/**
 * Detarmines the transformer based on the given resource type.
 * @param {string} type - Resource type.
 */
const transformResourceData =
  (type: string): ((response: any) => { items: unknown[]; _type: string }) =>
  (response) => {
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
      ...pairs[type](response),
      _type: type,
    };
  };
