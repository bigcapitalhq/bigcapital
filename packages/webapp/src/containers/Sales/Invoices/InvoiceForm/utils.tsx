// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import moment from 'moment';
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';
import { omit, first, sumBy } from 'lodash';
import {
  compose,
  transformToForm,
  repeatValue,
  defaultFastFieldShouldUpdate,
  formattedAmount,
  toSafeNumber,
} from '@/utils';
import { ERROR } from '@/constants/errors';
import { AppToaster } from '@/components';
import { useCurrentOrganization } from '@/hooks/state';
import {
  aggregateItemEntriesTaxRates,
  assignEntriesTaxAmount,
  getEntriesTotal,
} from '@/containers/Entries/utils';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
} from '@/containers/Entries/utils';
import { TaxType } from '@/interfaces/TaxRates';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import { convertBrandingTemplatesToOptions } from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';

export const MIN_LINES_NUMBER = 1;

// Default invoice entry object.
export const defaultInvoiceEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
  tax_rate_id: '',
  tax_rate: '',
  tax_amount: '',
};

// Default invoice object.
export const defaultInvoice = {
  customer_id: '',
  invoice_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment().format('YYYY-MM-DD'),
  delivered: '',
  invoice_no: '',
  inclusive_exclusive_tax: TaxType.Inclusive,
  // Holds the invoice number that entered manually only.
  invoice_no_manually: '',
  reference_no: '',
  invoice_message: '',
  terms_conditions: '',
  exchange_rate: '1',
  currency_code: '',
  branch_id: '',
  warehouse_id: '',
  project_id: '',
  pdf_template_id: '',
  entries: [...repeatValue(defaultInvoiceEntry, MIN_LINES_NUMBER)],
  attachments: [],
  payment_methods: {},
  discount: '',
  discount_type: 'amount',
  adjustment: '',
};

// Invoice entry request schema.
export const defaultReqInvoiceEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  tax_rate_id: '',
};

/**
 * Transform invoice to initial values in edit mode.
 */
export function transformToEditForm(invoice) {
  const initialEntries = [
    ...invoice.entries.map((invoice) => ({
      ...transformToForm(invoice, defaultInvoiceEntry),
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
    ...transformToForm(invoice, defaultInvoice),
    inclusive_exclusive_tax: invoice.is_inclusive_tax
      ? TaxType.Inclusive
      : TaxType.Exclusive,
    entries,
    attachments: transformAttachmentsToForm(invoice),
    payment_methods: transformPaymentMethodsToForm(invoice?.payment_methods),
  };
}

/**
 * Transformes the response errors types.
 */
export const transformErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === ERROR.SALE_INVOICE_NUMBER_IS_EXISTS)) {
    setErrors({
      invoice_no: intl.get('sale_invoice_number_is_exists'),
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
      invoice_no: intl.get('invoice.field.error.invoice_no_required'),
    });
  }
};

/**
 * Detarmines customer name field when should update.
 */
export const customerNameFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines invoice entries field when should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
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
const transformEntriesToRequest = (entries) => {
  return R.compose(
    R.map(R.compose(R.curry(transformToForm)(R.__, defaultReqInvoiceEntry))),
    filterNonZeroEntries,
  )(entries);
};

/**
 * Filters the givne non-zero entries.
 */
const filterNonZeroEntries = (entries) => {
  return entries.filter((item) => item.item_id && item.quantity);
};

/**
 * Transformes the form values to request body values.
 */
export function transformValueToRequest(values) {
  return {
    ...omit(values, [
      'invoice_no',
      'invoice_no_manually',
      'inclusive_exclusive_tax',
    ]),
    // The `invoice_no_manually` will be presented just if the auto-increment
    // is disable, always both attributes hold the same value in manual mode.
    ...(values.invoice_no_manually && {
      invoice_no: values.invoice_no,
    }),
    is_inclusive_tax: values.inclusive_exclusive_tax === TaxType.Inclusive,
    entries: transformEntriesToRequest(values.entries),
    delivered: false,
    attachments: transformAttachmentsToRequest(values),
    payment_methods: transformPaymentMethodsToRequest(values?.payment_methods),
  };
}

/**
 * Transformes the form payment methods to request.
 * @param {Record<string, { enable: boolean }>} paymentMethods
 * @returns {Array<{ payment_integration_id: string; enable: boolean }>}
 */
const transformPaymentMethodsToRequest = (
  paymentMethods: Record<string, { enable: boolean }>,
): Array<{ payment_integration_id: string; enable: boolean }> => {
  return Object.entries(paymentMethods).map(([paymentMethodId, method]) => ({
    payment_integration_id: paymentMethodId,
    enable: method.enable,
  }));
};

/**
 * Transformes payment methods from request to form.
 * @param {Array<{ payment_integration_id: number; enable: boolean }>} paymentMethods
 * @returns {Record<string, { enable: boolean }>}
 */
const transformPaymentMethodsToForm = (
  paymentMethods: Array<{ payment_integration_id: number; enable: boolean }>,
): Record<string, { enable: boolean }> => {
  return paymentMethods?.reduce((acc, method) => {
    acc[method.payment_integration_id] = { enable: method.enable };
    return acc;
  }, {});
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useInvoiceFormContext();

  React.useEffect(() => {
    if (isWarehousesSuccess) {
      const primaryWarehouse =
        warehouses.find((b) => b.primary) || first(warehouses);

      if (primaryWarehouse) {
        setFieldValue('warehouse_id', primaryWarehouse.id);
      }
    }
  }, [isWarehousesSuccess, setFieldValue, warehouses]);
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useInvoiceFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

/**
 * Retrieves the invoice subtotal.
 * @returns {number}
 */
export const useInvoiceSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext();

  // Calculate the total due amount of invoice entries.
  return React.useMemo(() => getEntriesTotal(entries), [entries]);
};

/**
 * Retrieves the invoice subtotal formatted.
 * @returns {string}
 */
export const useInvoiceSubtotalFormatted = () => {
  const subtotal = useInvoiceSubtotal();
  const { values } = useFormikContext();

  return formattedAmount(subtotal, values.currency_code);
};

/**
 * Retrieves the invoice discount amount.
 * @returns {number}
 */
export const useInvoiceDiscountAmount = () => {
  const { values } = useFormikContext();
  const subtotal = useInvoiceSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discount_type === 'percentage'
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
    values: { currency_code },
  } = useFormikContext();

  return formattedAmount(discountAmount, currency_code);
};

/**
 * Retrieves the invoice adjustment amount.
 * @returns {number}
 */
export const useInvoiceAdjustmentAmount = () => {
  const { values } = useFormikContext();
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
    values: { currency_code },
  } = useFormikContext();

  return formattedAmount(adjustmentAmount, currency_code);
};

/**
 * Detarmines whether the invoice has foreign customer.
 * @returns {boolean}
 */
export const useInvoiceIsForeignCustomer = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignCustomer = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignCustomer;
};

/**
 * Resets the form state to initial values
 */
export const resetFormState = ({ initialValues, values, resetForm }) => {
  resetForm({
    values: {
      // Reset the all values except the warehouse and brand id.
      ...initialValues,
      warehouse_id: values.warehouse_id,
      brand_id: values.brand_id,
    },
  });
};

/**
 * Re-calcualte the entries tax amount when editing.
 * @returns {string}
 */
export const composeEntriesOnEditInclusiveTax = (
  inclusiveExclusiveTax: string,
  entries,
) => {
  return R.compose(
    assignEntriesTaxAmount(inclusiveExclusiveTax === 'inclusive'),
  )(entries);
};

/**
 * Retreives the invoice aggregated tax rates.
 * @returns {Array}
 */
export const useInvoiceAggregatedTaxRates = () => {
  const { values } = useFormikContext();
  const { taxRates } = useInvoiceFormContext();

  const aggregateTaxRates = React.useMemo(
    () => aggregateItemEntriesTaxRates(values.currency_code, taxRates),
    [values.currency_code, taxRates],
  );
  // Calculate the total tax amount of invoice entries.
  return React.useMemo(() => {
    return aggregateTaxRates(values.entries);
  }, [aggregateTaxRates, values.entries]);
};

/**
 * Retreives the invoice total tax amount.
 * @returns {number}
 */
export const useInvoiceTotalTaxAmount = () => {
  const { values } = useFormikContext();

  return React.useMemo(() => {
    const filteredEntries = values.entries.filter((entry) => entry.tax_amount);
    return sumBy(filteredEntries, 'tax_amount');
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
  const { values } = useFormikContext();

  return formattedAmount(total, values.currency_code);
};

/**
 * Retrieves the paid amount of the invoice.
 * @returns {number}
 */
export const useInvoicePaidAmount = () => {
  const { invoice } = useInvoiceFormContext();

  return toSafeNumber(invoice?.payment_amount);
};

/**
 * Retrieves the paid amount of the invoice formatted.
 * @returns {string}
 */
export const useInvoicePaidAmountFormatted = () => {
  const paidAmount = useInvoicePaidAmount();
  const { values } = useFormikContext();

  return formattedAmount(paidAmount, values.currency_code);
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
  const { values } = useFormikContext();

  return formattedAmount(dueAmount, values.currency_code);
};

/**
 * Detrmines whether the tax is inclusive.
 * @returns {boolean}
 */
export const useIsInvoiceTaxInclusive = () => {
  const { values } = useFormikContext();

  return values.inclusive_exclusive_tax === TaxType.Inclusive;
};

/**
 * Detrmines whether the tax is exclusive.
 * @returns {boolean}
 */
export const useIsInvoiceTaxExclusive = () => {
  const { values } = useFormikContext();

  return values.inclusive_exclusive_tax === TaxType.Exclusive;
};

/**
 * Retrieves the invoice currency code.
 * @returns {string}
 */
export const useInvoiceCurrencyCode = () => {
  const { values } = useFormikContext();

  return values.currency_code;
};

export const useInvoiceFormBrandingTemplatesOptions = () => {
  const { brandingTemplates } = useInvoiceFormContext();

  return React.useMemo(
    () => convertBrandingTemplatesToOptions(brandingTemplates),
    [brandingTemplates],
  );
};
