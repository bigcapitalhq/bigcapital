import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { omit, first, sumBy } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import intl from 'react-intl-universal';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import type { SaleInvoice, CreateSaleInvoiceBody } from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { ERROR } from '@/constants/errors';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import { convertBrandingTemplatesToOptions } from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import {
  aggregateItemEntriesTaxRates,
  assignEntriesTaxAmount,
  getEntriesTotal,
} from '@/containers/Entries/utils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { TaxType } from '@/interfaces/TaxRates';
import {
  compose,
  transformToForm,
  repeatValue,
  defaultFastFieldShouldUpdate,
  formattedAmount,
  toSafeNumber,
} from '@/utils';

export const MIN_LINES_NUMBER = 1;

export type InvoiceEntry = {
  index: number;
  itemId: string | number;
  rate: string | number;
  discount: string | number;
  quantity: string | number;
  description: string;
  amount: string | number;
  taxRateId: string | number;
  taxRate: string | number;
  taxAmount: string | number;
};

export type PaymentMethodFormValue = { enable: boolean };

export type InvoiceFormValues = {
  customerId: string | number;
  invoiceDate: string;
  dueDate: string;
  invoiceNo: string;
  invoiceNoManually: string;
  referenceNo: string;
  delivered: boolean | '';
  inclusiveExclusiveTax: TaxType;
  fromEstimateId?: string;
  invoiceMessage: string;
  termsConditions: string;
  exchangeRate: string;
  currencyCode: string;
  branchId: string | number;
  warehouseId: string | number;
  projectId: string | number;
  pdfTemplateId: string | number;
  entries: InvoiceEntry[];
  attachments: unknown[];
  paymentMethods: Record<string, PaymentMethodFormValue>;
  discount: string;
  discountType: 'amount' | 'percentage';
  adjustment: string;
};

export type AggregatedTaxRate = {
  taxRateId: string;
  taxRate: number | undefined;
  label: string;
  taxAmount: number;
  taxAmountFormatted: string;
};

// Default invoice entry object.
export const defaultInvoiceEntry: InvoiceEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
  taxRateId: '',
  taxRate: '',
  taxAmount: '',
};

// Default invoice object.
export const defaultInvoice: InvoiceFormValues = {
  customerId: '',
  invoiceDate: moment(new Date()).format('YYYY-MM-DD'),
  dueDate: moment().format('YYYY-MM-DD'),
  delivered: '',
  invoiceNo: '',
  inclusiveExclusiveTax: TaxType.Inclusive,
  // Holds the invoice number that entered manually only.
  invoiceNoManually: '',
  referenceNo: '',
  invoiceMessage: '',
  termsConditions: '',
  exchangeRate: '1',
  currencyCode: '',
  branchId: '',
  warehouseId: '',
  projectId: '',
  pdfTemplateId: '',
  entries: [...repeatValue(defaultInvoiceEntry, MIN_LINES_NUMBER)],
  attachments: [],
  paymentMethods: {},
  discount: '',
  discountType: 'amount',
  adjustment: '',
};

// Invoice entry request schema.
export const defaultReqInvoiceEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  taxRateId: '',
};

/**
 * Transform invoice to initial values in edit mode.
 *
 * Accepts a partial invoice shape: the provider seeds a new invoice from a
 * picked estimate (`customerId`, `currencyCode`, `entries`) which lacks most
 * SaleInvoice fields. The transform fills gaps from `defaultInvoice`.
 */
export function transformToEditForm(
  invoice: Partial<SaleInvoice> & { entries: SaleInvoice['entries'] },
): InvoiceFormValues {
  const initialEntries = [
    ...invoice.entries.map((entry) => ({
      ...transformToForm(entry, defaultInvoiceEntry),
    })),
    ...repeatValue(
      defaultInvoiceEntry,
      Math.max(MIN_LINES_NUMBER - invoice.entries.length, 0),
    ),
  ];
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultInvoiceEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  return {
    ...defaultInvoice,
    ...(transformToForm(invoice, defaultInvoice) as Partial<InvoiceFormValues>),
    inclusiveExclusiveTax: invoice.isInclusiveTax
      ? TaxType.Inclusive
      : TaxType.Exclusive,
    entries,
    attachments: transformAttachmentsToForm(invoice),
    paymentMethods: transformPaymentMethodsToForm(invoice?.paymentMethods),
  };
}

/**
 * Transformes the response errors types.
 */
export const transformErrors = (
  errors: Array<{ type: string }>,
  { setErrors }: { setErrors: (errors: Record<string, unknown>) => void },
) => {
  if (errors.some((e) => e.type === ERROR.SALE_INVOICE_NUMBER_IS_EXISTS)) {
    setErrors({
      invoiceNo: intl.get('sale_invoice_number_is_exists'),
    });
  }
  if (
    errors.some(
      ({ type }) =>
        type === ERROR.SALE_ESTIMATE_IS_ALREADY_CONVERTED_TO_INVOICE,
    )
  ) {
    AppToaster.show({
      message: intl.get('sale_estimate_is_already_converted_to_invoice'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.some(
      ({ type }) => type === ERROR.INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT,
    )
  ) {
    AppToaster.show({
      message: intl.get('sale_invoice.total_smaller_than_paid_amount'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.some((error) => error.type === ERROR.SALE_INVOICE_NO_IS_REQUIRED)
  ) {
    setErrors({
      invoiceNo: intl.get('invoice.field.error.invoice_no_required'),
    });
  }
};

type FastFieldShouldUpdateProps = {
  shouldUpdateDeps?: { items?: unknown[] };
  items?: unknown;
  taxRates?: unknown;
  [key: string]: unknown;
};

/**
 * Detarmines customer name field when should update.
 */
export const customerNameFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.shouldUpdateDeps?.items !== oldProps.shouldUpdateDeps?.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines invoice entries field when should update.
 */
export const entriesFieldShouldUpdate = (
  newProps: FastFieldShouldUpdateProps,
  oldProps: FastFieldShouldUpdateProps,
): boolean => {
  return (
    newProps.items !== oldProps.items ||
    newProps.taxRates !== oldProps.taxRates ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

export const ITEMS_FILTER_ROLES_QUERY = JSON.stringify([
  {
    index: 1,
    fieldKey: 'sellable',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
  {
    index: 2,
    fieldKey: 'active',
    value: true,
    condition: '&&',
    comparator: 'equals',
  },
]);

/**
 * Transformes bill entries to submit request.
 */
const transformEntriesToRequest = (entries: InvoiceEntry[]) => {
  return filterNonZeroEntries(entries).map((entry) =>
    transformToForm(entry, defaultReqInvoiceEntry),
  );
};

/**
 * Filters the givne non-zero entries.
 */
const filterNonZeroEntries = (entries: InvoiceEntry[]) => {
  return entries.filter((item) => item.itemId && item.quantity);
};

/**
 * Transformes the form values to request body values.
 *
 * NOTE: `as unknown as CreateSaleInvoiceBody` is required because the SDK request
 * type reuses the response `ItemEntryDto`, which mandates server-computed fields
 * (taxCode, warehouseId, costAccountId, projectRefId, ...) that the client never
 * sends — the backend populates them. Form field values are also string-typed
 * (from inputs) while the DTO types them as numbers. Coercing every field would
 * change the runtime payload, so we assemble the body as-is and assert the type.
 */
export function transformValueToRequest(
  values: InvoiceFormValues,
): CreateSaleInvoiceBody {
  return {
    ...omit(values, [
      'invoiceNo',
      'invoiceNoManually',
      'inclusiveExclusiveTax',
    ]),
    // The `invoiceNoManually` will be presented just if the auto-increment
    // is disable, always both attributes hold the same value in manual mode.
    ...(values.invoiceNoManually && {
      invoiceNo: values.invoiceNo,
    }),
    isInclusiveTax: values.inclusiveExclusiveTax === TaxType.Inclusive,
    entries: transformEntriesToRequest(values.entries),
    delivered: false,
    attachments: transformAttachmentsToRequest(values),
    paymentMethods: transformPaymentMethodsToRequest(values?.paymentMethods),
  } as unknown as CreateSaleInvoiceBody;
}

/**
 * Transformes the form payment methods to request.
 * @param {Record<string, { enable: boolean }>} paymentMethods
 * @returns {Array<{ paymentIntegrationId: number; enable: boolean }>}
 */
const transformPaymentMethodsToRequest = (
  paymentMethods: Record<string, { enable: boolean }>,
): Array<{ paymentIntegrationId: number; enable: boolean }> => {
  return Object.entries(paymentMethods).map(([paymentMethodId, method]) => ({
    paymentIntegrationId: Number(paymentMethodId),
    enable: method.enable,
  }));
};

/**
 * Transformes payment methods from request to form.
 * @param {Array<{ paymentIntegrationId: number; enable: boolean }>} paymentMethods
 * @returns {Record<string, { enable: boolean }>}
 */
const transformPaymentMethodsToForm = (
  paymentMethods:
    | Array<{ paymentIntegrationId: number; enable: boolean }>
    | undefined,
): Record<string, { enable: boolean }> => {
  return (paymentMethods ?? []).reduce(
    (acc: Record<string, { enable: boolean }>, method) => {
      acc[method.paymentIntegrationId] = { enable: method.enable };
      return acc;
    },
    {},
  );
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext<InvoiceFormValues>();
  const { warehouses, isWarehousesSuccess, isNewMode } =
    useInvoiceFormContext();

  React.useEffect(() => {
    if (isWarehousesSuccess && isNewMode) {
      const primaryWarehouse =
        warehouses.find((b) => b.primary) || first(warehouses);

      if (primaryWarehouse) {
        setFieldValue('warehouseId', primaryWarehouse.id);
      }
    }
  }, [isWarehousesSuccess, setFieldValue, warehouses, isNewMode]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<InvoiceFormValues>();
  const { branches, isBranchesSuccess, isNewMode } = useInvoiceFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess && isNewMode) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches, isNewMode]);
};

/**
 * Retrieves the invoice subtotal.
 * @returns {number}
 */
export const useInvoiceSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext<InvoiceFormValues>();

  // Calculate the total due amount of invoice entries.
  return React.useMemo(() => getEntriesTotal(entries), [entries]);
};

/**
 * Retrieves the invoice subtotal formatted.
 * @returns {string}
 */
export const useInvoiceSubtotalFormatted = () => {
  const subtotal = useInvoiceSubtotal();
  const { values } = useFormikContext<InvoiceFormValues>();

  return formattedAmount(subtotal, values.currencyCode);
};

/**
 * Retrieves the invoice discount amount.
 * @returns {number}
 */
export const useInvoiceDiscountAmount = () => {
  const { values } = useFormikContext<InvoiceFormValues>();
  const subtotal = useInvoiceSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discountType === 'percentage'
    ? (subtotal * discount) / 100
    : discount;
};

/**
 * Retrieves the invoice discount amount formatted.
 * @returns {string}
 */
export const useInvoiceDiscountAmountFormatted = () => {
  const discountAmount = useInvoiceDiscountAmount();
  const {
    values: { currencyCode },
  } = useFormikContext<InvoiceFormValues>();

  return formattedAmount(discountAmount, currencyCode);
};

/**
 * Retrieves the invoice adjustment amount.
 * @returns {number}
 */
export const useInvoiceAdjustmentAmount = () => {
  const { values } = useFormikContext<InvoiceFormValues>();
  const adjustment = toSafeNumber(values.adjustment);

  return adjustment;
};

/**
 * Retrieves the invoice adjustment amount formatted.
 * @returns {string}
 */
export const useInvoiceAdjustmentAmountFormatted = () => {
  const adjustmentAmount = useInvoiceAdjustmentAmount();
  const {
    values: { currencyCode },
  } = useFormikContext<InvoiceFormValues>();

  return formattedAmount(adjustmentAmount, currencyCode);
};

/**
 * Detarmines whether the invoice has foreign customer.
 * @returns {boolean}
 */
export const useInvoiceIsForeignCustomer = () => {
  const { values } = useFormikContext<InvoiceFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignCustomer = React.useMemo(
    () => values.currencyCode !== baseCurrency,
    [values.currencyCode, baseCurrency],
  );
  return isForeignCustomer;
};

/**
 * Resets the form state to initial values
 */
export const resetFormState = ({
  initialValues,
  values,
  resetForm,
}: {
  initialValues: InvoiceFormValues;
  values: InvoiceFormValues;
  resetForm: (next?: { values: InvoiceFormValues }) => void;
}) => {
  resetForm({
    values: {
      // Reset the all values except the warehouse and brand id.
      ...initialValues,
      warehouseId: values.warehouseId,
    },
  });
};

/**
 * Re-calcualte the entries tax amount when editing.
 * @returns {string}
 */
export const composeEntriesOnEditInclusiveTax = (
  inclusiveExclusiveTax: string,
  entries: InvoiceEntry[],
): InvoiceEntry[] => {
  return assignEntriesTaxAmount(
    inclusiveExclusiveTax === 'inclusive',
    entries,
  ) as InvoiceEntry[];
};

/**
 * Retreives the invoice aggregated tax rates.
 * @returns {Array}
 */
export const useInvoiceAggregatedTaxRates = (): AggregatedTaxRate[] => {
  const { values } = useFormikContext<InvoiceFormValues>();
  const { taxRates } = useInvoiceFormContext();

  const aggregateTaxRates = React.useMemo(
    () => aggregateItemEntriesTaxRates(values.currencyCode, taxRates),
    [values.currencyCode, taxRates],
  );
  // Calculate the total tax amount of invoice entries.
  return React.useMemo(() => {
    return aggregateTaxRates(values.entries) as AggregatedTaxRate[];
  }, [aggregateTaxRates, values.entries]);
};

/**
 * Retreives the invoice total tax amount.
 * @returns {number}
 */
export const useInvoiceTotalTaxAmount = () => {
  const { values } = useFormikContext<InvoiceFormValues>();

  return React.useMemo(() => {
    const filteredEntries = values.entries.filter((entry) => entry.taxAmount);
    return sumBy(filteredEntries, 'taxAmount');
  }, [values.entries]);
};

/**
 * Retreives the invoice total.
 * @returns {number}
 */
export const useInvoiceTotal = () => {
  const subtotal = useInvoiceSubtotal();
  const totalTaxAmount = useInvoiceTotalTaxAmount();
  const isExclusiveTax = useIsInvoiceTaxExclusive();
  const discountAmount = useInvoiceDiscountAmount();
  const adjustmentAmount = useInvoiceAdjustmentAmount();

  return R.compose(
    R.when(R.always(isExclusiveTax), R.add(totalTaxAmount)),
    R.subtract(R.__, discountAmount),
    R.add(adjustmentAmount),
  )(subtotal);
};

/**
 * Retrieves the invoice total formatted.
 * @returns {string}
 */
export const useInvoiceTotalFormatted = () => {
  const total = useInvoiceTotal();
  const { values } = useFormikContext<InvoiceFormValues>();

  return formattedAmount(total, values.currencyCode);
};

/**
 * Retrieves the paid amount of the invoice.
 * @returns {number}
 */
export const useInvoicePaidAmount = () => {
  const { invoice } = useInvoiceFormContext();

  return toSafeNumber(invoice?.paymentAmount);
};

/**
 * Retrieves the paid amount of the invoice formatted.
 * @returns {string}
 */
export const useInvoicePaidAmountFormatted = () => {
  const paidAmount = useInvoicePaidAmount();
  const { values } = useFormikContext<InvoiceFormValues>();

  return formattedAmount(paidAmount, values.currencyCode);
};

/**
 * Retreives the invoice due amount.
 * @returns {number}
 */
export const useInvoiceDueAmount = () => {
  const total = useInvoiceTotal();
  const paidAmount = useInvoicePaidAmount();

  return Math.max(total - paidAmount, 0);
};

/**
 * Retrieves the invoice due amount formatted.
 * @returns {string}
 */
export const useInvoiceDueAmountFormatted = () => {
  const dueAmount = useInvoiceDueAmount();
  const { values } = useFormikContext<InvoiceFormValues>();

  return formattedAmount(dueAmount, values.currencyCode);
};

/**
 * Detrmines whether the tax is inclusive.
 * @returns {boolean}
 */
export const useIsInvoiceTaxInclusive = () => {
  const { values } = useFormikContext<InvoiceFormValues>();

  return values.inclusiveExclusiveTax === TaxType.Inclusive;
};

/**
 * Detrmines whether the tax is exclusive.
 * @returns {boolean}
 */
export const useIsInvoiceTaxExclusive = () => {
  const { values } = useFormikContext<InvoiceFormValues>();

  return values.inclusiveExclusiveTax === TaxType.Exclusive;
};

/**
 * Retrieves the invoice currency code.
 * @returns {string}
 */
export const useInvoiceCurrencyCode = () => {
  const { values } = useFormikContext<InvoiceFormValues>();

  return values.currencyCode;
};

export const useInvoiceFormBrandingTemplatesOptions = () => {
  const { brandingTemplates } = useInvoiceFormContext();

  return React.useMemo(
    () => convertBrandingTemplatesToOptions(brandingTemplates),
    [brandingTemplates],
  );
};
