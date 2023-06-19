// @ts-nocheck
import { useRequestQuery } from '../../useQueryRequest';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';

/**
 *
 * @param {string} type
 * @param {string} searchKeyword
 * @param {*} query
 * @returns
 */
export function useResourceData(type, query, props) {
  const url = getResourceUrlFromType(type);

  return useRequestQuery(
    ['UNIVERSAL_SEARCH', type, query],
    { method: 'get', url, params: query },
    {
      select: transformResourceData(type),
      defaultData: {
        items: [],
      },
      ...props,
    },
  );
}

/**
 * Retrieve the resource url by the given resource type.
 * @param {string} type
 * @returns {string}
 */
function getResourceUrlFromType(type) {
  const config = {
    [RESOURCES_TYPES.INVOICE]: '/sales/invoices',
    [RESOURCES_TYPES.ESTIMATE]: '/sales/estimates',
    [RESOURCES_TYPES.ITEM]: '/items',
    [RESOURCES_TYPES.RECEIPT]: '/sales/receipts',
    [RESOURCES_TYPES.BILL]: '/purchases/bills',
    [RESOURCES_TYPES.PAYMENT_RECEIVE]: '/sales/payment_receives',
    [RESOURCES_TYPES.PAYMENT_MADE]: '/purchases/bill_payments',
    [RESOURCES_TYPES.CUSTOMER]: '/customers',
    [RESOURCES_TYPES.VENDOR]: '/vendors',
    [RESOURCES_TYPES.MANUAL_JOURNAL]: '/manual-journals',
    [RESOURCES_TYPES.ACCOUNT]: '/accounts',
    [RESOURCES_TYPES.CREDIT_NOTE]: '/sales/credit_notes',
    [RESOURCES_TYPES.VENDOR_CREDIT]: '/purchases/vendor-credit',
  };
  return config[type] || '';
}

/**
 * Transforms invoices to resource data.
 */
const transformInvoices = (response) => ({
  items: response.data.sales_invoices,
});

/**
 * Transforms items to resource data.
 */
const transformItems = (response) => ({
  items: response.data.items,
});

/**
 * Transforms payment receives to resource data.
 */
const transformPaymentReceives = (response) => ({
  items: response.data.payment_receives,
});

/**
 * Transforms customers to resource data.
 */
const transformCustomers = (response) => ({
  items: response.data.customers,
});

/**
 * Transforms customers to resource data.
 */
const transformVendors = (response) => ({
  items: response.data.vendors,
});

const transformPaymentsMade = (response) => ({
  items: response.data.bill_payments,
});

const transformSaleReceipts = (response) => ({
  items: response.data.data,
});

const transformBills = (response) => ({
  items: response.data.bills,
});

const transformManualJournals = (response) => ({
  items: response.data.manual_journals,
});

const transformsEstimates = (response) => ({
  items: response.data.sales_estimates,
});

const transformAccounts = (response) => ({
  items: response.data.accounts,
});

const transformCreditNotes = (response) => ({
  items: response.data.credit_notes,
});

const transformVendorCredits = (response) => ({
  items: response.data.vendor_credits,
});

/**
 * Determines the transformer based on the given resource type.
 * @param {string} type - Resource type.
 */
const transformResourceData = (type) => (response) => {
  const pairs = {
    [RESOURCES_TYPES.ESTIMATE]: transformsEstimates,
    [RESOURCES_TYPES.INVOICE]: transformInvoices,
    [RESOURCES_TYPES.RECEIPT]: transformSaleReceipts,
    [RESOURCES_TYPES.ITEM]: transformItems,
    [RESOURCES_TYPES.PAYMENT_RECEIVE]: transformPaymentReceives,
    [RESOURCES_TYPES.PAYMENT_MADE]: transformPaymentsMade,
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
