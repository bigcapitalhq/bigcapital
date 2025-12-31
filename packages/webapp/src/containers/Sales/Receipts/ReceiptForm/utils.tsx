// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import * as R from 'ramda';
import { omit, first } from 'lodash';
import { useFormikContext } from 'formik';
import {
  defaultFastFieldShouldUpdate,
  repeatValue,
  transformToForm,
  formattedAmount,
  toSafeNumber,
} from '@/utils';
import { useReceiptFormContext } from './ReceiptFormProvider';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
  aggregateItemEntriesTaxRates,
  assignEntriesTaxAmount,
  assignEntriesTaxRate,
} from '@/containers/Entries/utils';
import { TaxType } from '@/interfaces/TaxRates';
import { compose } from '@/utils';
import { sumBy } from 'lodash';
import { useCurrentOrganization } from '@/hooks/state';
import { getEntriesTotal } from '@/containers/Entries/utils';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import { convertBrandingTemplatesToOptions } from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';

export const MIN_LINES_NUMBER = 1;

export const defaultReceiptEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
  tax_rate_ids: [],
  tax_rate: '',
  tax_amount: '',
  tax_breakdown: [],
};

const defaultReceiptEntryReq = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  tax_rate_ids: [],
};

export const defaultReceipt = {
  customer_id: '',
  deposit_account_id: '',
  receipt_number: '',
  // Holds the receipt number that entered manually only.
  receipt_number_manually: '',
  receipt_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  receipt_message: '',
  terms_conditions: '',
  closed: '',
  branch_id: '',
  warehouse_id: '',
  exchange_rate: 1,
  currency_code: '',
  entries: [...repeatValue(defaultReceiptEntry, MIN_LINES_NUMBER)],
  attachments: [],
  pdf_template_id: '',
  discount: '',
  discount_type: 'amount',
  adjustment: '',
  inclusive_exclusive_tax: 'exclusive',
};

const ERRORS = {
  SALE_RECEIPT_NUMBER_NOT_UNIQUE: 'SALE_RECEIPT_NUMBER_NOT_UNIQUE',
  SALE_RECEIPT_NO_IS_REQUIRED: 'SALE_RECEIPT_NO_IS_REQUIRED',
};

/**
 * Transform to form in edit mode.
 * @param receipt - The receipt data from the API
 * @param taxRates - Optional tax rates for calculating tax breakdown
 */
export const transformToEditForm = (receipt, taxRates = []) => {
  const isInclusiveTax = receipt.is_inclusive_tax;

  const initialEntries = [
    ...receipt.entries.map((entry) => ({
      ...transformToForm(entry, defaultReceiptEntry),
    })),
    ...repeatValue(
      defaultReceiptEntry,
      Math.max(MIN_LINES_NUMBER - receipt.entries.length, 0),
    ),
  ];
  // Compose entries with tax calculation when tax rates are available
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultReceiptEntry),
    // Calculate tax breakdown for the summary
    assignEntriesTaxAmount(isInclusiveTax),
    assignEntriesTaxRate(taxRates),
    updateItemsEntriesTotal,
  )(initialEntries);

  const attachments = transformAttachmentsToForm(receipt);

  return {
    ...transformToForm(receipt, defaultReceipt),
    inclusive_exclusive_tax: isInclusiveTax
      ? TaxType.Inclusive
      : TaxType.Exclusive,
    entries,
    attachments,
  };
};

/**
 * Detarmines entries fast field should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    newProps.taxRates !== oldProps.taxRates ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines accounts fast field should update.
 */
export const accountsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines customers fast field should update.
 */
export const customersFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Transform response error to fields.
 */
export const handleErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === ERRORS.SALE_RECEIPT_NUMBER_NOT_UNIQUE)) {
    setErrors({
      receipt_number: intl.get('sale_receipt_number_not_unique'),
    });
  }
  if (errors.some((e) => e.type === ERRORS.SALE_RECEIPT_NO_IS_REQUIRED)) {
    setErrors({
      receipt_number: intl.get('receipt.field.error.receipt_number_required'),
    });
  }
};

/**
 * Transformes the form values to request body.
 * @param {*} values
 * @returns
 */
export const transformFormValuesToRequest = (values) => {
  const entries = values.entries.filter(
    (item) => item.item_id && item.quantity,
  );
  const attachments = transformAttachmentsToRequest(values);

  return {
    ...omit(values, ['receipt_number_manually', 'receipt_number', 'inclusive_exclusive_tax']),
    ...(values.receipt_number_manually && {
      receipt_number: values.receipt_number,
    }),
    is_inclusive_tax: values.inclusive_exclusive_tax === 'inclusive',
    entries: entries.map((entry) => ({
      ...transformToForm(entry, defaultReceiptEntryReq),
    })),
    closed: false,
    attachments,
  };
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useReceiptFormContext();

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
  const { branches, isBranchesSuccess } = useReceiptFormContext();

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
 * Retrieves the receipt subtotal.
 * @returns {number}
 */
export const useReceiptSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext();

  // Retrieves the invoice entries total.
  const subtotal = React.useMemo(() => getEntriesTotal(entries), [entries]);

  return subtotal;
};

/**
 * Retrieves the formatted subtotal.
 * @returns {string}
 */
export const useReceiptSubtotalFormatted = () => {
  const subtotal = useReceiptSubtotal();
  const { values } = useFormikContext();

  return formattedAmount(subtotal, values.currency_code, { money: true });
};

/**
 * Retrieves the receipt discount amount.
 * @returns {number}
 */
export const useReceiptDiscountAmount = () => {
  const { values } = useFormikContext();
  const subtotal = useReceiptSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discount_type === 'percentage'
    ? (subtotal * discount) / 100
    : discount;
};

/**
 * Retrieves the formatted discount amount.
 * @returns {string}
 */
export const useReceiptDiscountAmountFormatted = () => {
  const { values } = useFormikContext();
  const discount = useReceiptDiscountAmount();

  return formattedAmount(discount, values.currency_code);
};

/**
 * Retrieves the receipt adjustment amount.
 * @returns {number}
 */
export const useReceiptAdjustmentAmount = () => {
  const { values } = useFormikContext();
  const adjustment = toSafeNumber(values.adjustment);

  return adjustment;
};

/**
 * Retrieves the formatted adjustment amount.
 * @returns {string}
 */
export const useReceiptAdjustmentFormatted = () => {
  const { values } = useFormikContext();
  const adjustment = useReceiptAdjustmentAmount();

  return formattedAmount(adjustment, values.currency_code);
};

/**
 * Retrieves the receipt total tax amount.
 * @returns {number}
 */
export const useReceiptTotalTaxAmount = () => {
  const { values } = useFormikContext();

  return React.useMemo(() => {
    const filteredEntries = values.entries.filter((entry) => entry.tax_amount);
    return sumBy(filteredEntries, 'tax_amount');
  }, [values.entries]);
};

/**
 * Determines whether the receipt is exclusive tax.
 * @returns {boolean}
 */
export const useIsReceiptTaxExclusive = () => {
  const { values } = useFormikContext();
  return values.inclusive_exclusive_tax === 'exclusive';
};

/**
 * Retrieves the receipt total.
 * @returns {number}
 */
export const useReceiptTotal = () => {
  const subtotal = useReceiptSubtotal();
  const adjustmentAmount = useReceiptAdjustmentAmount();
  const discountAmount = useReceiptDiscountAmount();
  const totalTaxAmount = useReceiptTotalTaxAmount();
  const isExclusiveTax = useIsReceiptTaxExclusive();

  return R.compose(
    R.when(R.always(isExclusiveTax), R.add(totalTaxAmount)),
    R.add(R.__, adjustmentAmount),
    R.subtract(R.__, discountAmount),
  )(subtotal);
};

/**
 * Retrieves the formatted receipt total.
 * @returns {string}
 */
export const useReceiptTotalFormatted = () => {
  const total = useReceiptTotal();
  const { values } = useFormikContext();

  return formattedAmount(total, values.currency_code);
};

/**
 * Retrieves the receipt paid amount.
 * @returns {number}
 */
export const useReceiptPaidAmount = () => {
  return toSafeNumber(0);
};

/**
 * Retrieves the formatted receipt paid amount.
 * @returns {string}
 */
export const useReceiptPaidAmountFormatted = () => {
  const paidAmount = useReceiptPaidAmount();
  const { values } = useFormikContext();

  return formattedAmount(paidAmount, values.currency_code);
};

/**
 * Retrieves the receipt due amount.
 * @returns {number}
 */
export const useReceiptDueAmount = () => {
  const total = useReceiptTotal();
  const paidAmount = useReceiptPaidAmount();

  return total - paidAmount;
};

/**
 * Retrieves the formatted receipt due amount.
 * @returns {string}
 */
export const useReceiptDueAmountFormatted = () => {
  const dueAmount = useReceiptDueAmount();
  const { values } = useFormikContext();

  return formattedAmount(dueAmount, values.currency_code);
};

/**
 * Detarmines whether the receipt has foreign customer.
 * @returns {boolean}
 */
export const useReceiptIsForeignCustomer = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignCustomer = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignCustomer;
};

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

export const useReceiptFormBrandingTemplatesOptions = () => {
  const { brandingTemplates } = useReceiptFormContext();

  return React.useMemo(
    () => convertBrandingTemplatesToOptions(brandingTemplates),
    [brandingTemplates],
  );
};

/**
 * Retrieves the aggregated tax rates of the receipt entries.
 * @returns {Array}
 */
export const useReceiptAggregatedTaxRates = () => {
  const { values } = useFormikContext();
  const { taxRates } = useReceiptFormContext();

  const aggregateTaxRates = React.useMemo(
    () => aggregateItemEntriesTaxRates(values.currency_code, taxRates),
    [values.currency_code, taxRates],
  );
  // Calculate the total tax amount of receipt entries.
  return React.useMemo(() => {
    return aggregateTaxRates(values.entries);
  }, [aggregateTaxRates, values.entries]);
};

/**
 * Re-calcualte the entries tax amount when editing.
 * Supports multiple taxes with compound tax calculation.
 * @param {string} inclusiveExclusiveTax - 'inclusive' or 'exclusive'
 * @param {Array} entries - The entries to recalculate
 * @param {Array} taxRates - Available tax rates for lookup
 * @returns {Array} - Entries with recalculated tax amounts
 */
export const composeEntriesOnEditInclusiveTax = (
  inclusiveExclusiveTax: string,
  entries,
  taxRates = [],
) => {
  return compose(
    assignEntriesTaxAmount(inclusiveExclusiveTax === 'inclusive'),
    assignEntriesTaxRate(taxRates),
  )(entries);
};
