import { Intent } from '@blueprintjs/core';
import { useFormikContext, type FormikErrors } from 'formik';
import { first, chain } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import intl from 'react-intl-universal';
import { useBillFormContext } from './BillFormProvider';
import type { Bill, CreateBillBody } from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';
import {
  isLandedCostDisabled,
  getEntriesTotal,
} from '@/containers/Entries/utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
  assignEntriesTaxAmount,
  aggregateItemEntriesTaxRates,
} from '@/containers/Entries/utils';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';
import { TaxType } from '@/interfaces/TaxRates';
import {
  compose,
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  orderingLinesIndexes,
  formattedAmount,
  toSafeNumber,
} from '@/utils';

export const MIN_LINES_NUMBER = 1;

export type BillFormEntry = {
  index: number;
  itemId: string | number;
  rate: string | number;
  discount: string | number;
  quantity: string | number;
  description: string;
  amount: string | number;
  landedCost: boolean;
  landedCostDisabled?: boolean;
  taxRateId: string | number;
  taxRate: string | number;
  taxAmount: string | number;
};

export type BillFormValues = {
  vendorId: string | number;
  billNumber: string;
  billDate: string;
  dueDate: string;
  referenceNo: string;
  inclusiveExclusiveTax: TaxType;
  note: string;
  open: boolean | '';
  branchId: string | number;
  warehouseId: string | number;
  exchangeRate: string | number;
  currencyCode: string;
  entries: BillFormEntry[];
  attachments: unknown[];
  adjustment: string | number;
  discount: string | number;
  discountType: 'amount' | 'percentage';
};

// Default bill entry.
export const defaultBillEntry: BillFormEntry = {
  index: 0,
  itemId: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
  landedCost: false,
  taxRateId: '',
  taxRate: '',
  taxAmount: '',
};

// Default bill.
export const defaultBill: BillFormValues = {
  vendorId: '',
  billNumber: '',
  billDate: moment(new Date()).format('YYYY-MM-DD'),
  dueDate: moment(new Date()).format('YYYY-MM-DD'),
  referenceNo: '',
  inclusiveExclusiveTax: TaxType.Inclusive,
  note: '',
  open: '',
  branchId: '',
  warehouseId: '',
  exchangeRate: 1,
  currencyCode: '',
  entries: [...repeatValue(defaultBillEntry, MIN_LINES_NUMBER)],
  attachments: [],

  // Adjustment
  adjustment: '',

  // Discount
  discount: '',
  discountType: 'amount',
};

export const ERRORS = {
  // Bills
  BILL_NUMBER_EXISTS: 'BILL.NUMBER.EXISTS',
  ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED:
    'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
  BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT: 'BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT',
};

type BillErrorResponse = { type: string };

/**
 * Transformes the bill to initial values of edit form.
 */
export const transformToEditForm = (bill: Bill): BillFormValues => {
  const initialEntries: BillFormEntry[] = [
    ...bill.entries.map((entry) => ({
      ...transformToForm(entry, defaultBillEntry),
      landedCostDisabled: isLandedCostDisabled(entry.item),
    })),
    ...repeatValue(
      defaultBillEntry,
      Math.max(MIN_LINES_NUMBER - bill.entries.length, 0),
    ),
  ];
  const entries = compose(
    ensureEntriesHaveEmptyLine(defaultBillEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  const attachments = transformAttachmentsToForm(bill);

  return {
    ...defaultBill,
    ...(transformToForm(bill, defaultBill) as Partial<BillFormValues>),
    inclusiveExclusiveTax: bill.isInclusiveTax
      ? TaxType.Inclusive
      : TaxType.Exclusive,
    entries,
    attachments,
  };
};

/**
 * Transformes bill entries to submit request.
 */
export const transformEntriesToSubmit = (
  entries: BillFormEntry[],
): Record<string, unknown>[] => {
  const transformBillEntry = compose(
    R.omit(['amount']),
    R.curry(transformToForm)(R.__, defaultBillEntry),
  );
  return compose(orderingLinesIndexes, R.map(transformBillEntry))(entries);
};

/**
 * Filters the givne non-zero entries.
 */
export const filterNonZeroEntries = (
  entries: BillFormEntry[],
): BillFormEntry[] => {
  return entries.filter((item) => item.itemId && item.quantity);
};

/**
 * Transformes form values to request body.
 */
export const transformFormValuesToRequest = (
  values: BillFormValues,
): CreateBillBody => {
  const entries = filterNonZeroEntries(values.entries);
  const attachments = transformAttachmentsToRequest(values);

  return {
    ...values,
    isInclusiveTax: values.inclusiveExclusiveTax === TaxType.Inclusive,
    entries: transformEntriesToSubmit(entries),
    open: false,
    attachments,
  } as unknown as CreateBillBody;
};

/**
 * Handle delete errors.
 */
export const handleDeleteErrors = (errors: BillErrorResponse[]) => {
  if (
    errors.find((error) => error.type === 'BILL_HAS_ASSOCIATED_PAYMENT_ENTRIES')
  ) {
    AppToaster.show({
      message: intl.get('cannot_delete_bill_that_has_payment_transactions'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find((error) => error.type === 'BILL_HAS_ASSOCIATED_LANDED_COSTS')
  ) {
    AppToaster.show({
      message: intl.get(
        'cannot_delete_bill_that_has_associated_landed_cost_transactions',
      ),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find((error) => error.type === 'BILL_HAS_APPLIED_TO_VENDOR_CREDIT')
  ) {
    AppToaster.show({
      message: intl.get(
        'bills.error.you_couldn_t_delete_bill_has_reconciled_with_vendor_credit',
      ),
      intent: Intent.DANGER,
    });
  }
};

type FieldShouldUpdateProps = {
  items?: unknown[];
  shouldUpdateDeps?: { items?: unknown[] };
  [key: string]: unknown;
};

/**
 * Detarmines vendors fast field should update
 */
export const vendorsFieldShouldUpdate = (
  newProps: FieldShouldUpdateProps,
  oldProps: FieldShouldUpdateProps,
): boolean => {
  return (
    newProps.shouldUpdateDeps?.items !== oldProps.shouldUpdateDeps?.items ||
    (defaultFastFieldShouldUpdate(newProps, oldProps) as boolean)
  );
};

/**
 * Detarmines entries fast field should update.
 */
export const entriesFieldShouldUpdate = (
  newProps: FieldShouldUpdateProps,
  oldProps: FieldShouldUpdateProps,
): boolean => {
  return (
    newProps.items !== oldProps.items ||
    (defaultFastFieldShouldUpdate(newProps, oldProps) as boolean)
  );
};

// Transform response error to fields.
export const handleErrors = (
  errors: BillErrorResponse[],
  { setErrors }: { setErrors: (errors: FormikErrors<BillFormValues>) => void },
) => {
  if (errors.some((e) => e.type === ERRORS.BILL_NUMBER_EXISTS)) {
    setErrors({
      billNumber: intl.get('bill_number_exists'),
    });
  }
  if (
    errors.some(
      (e) => e.type === ERRORS.ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED,
    )
  ) {
    AppToaster.show({
      intent: Intent.DANGER,
      message: 'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
    });
  }
  if (
    errors.some((e) => e.type === ERRORS.BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT)
  ) {
    AppToaster.show({
      intent: Intent.DANGER,
      message: intl.get('bill.total_smaller_than_paid_amount'),
    });
  }
};

export const useSetPrimaryBranchToForm = () => {
  const { setFieldValue } = useFormikContext<BillFormValues>();
  const { branches, isBranchesSuccess, isNewMode } = useBillFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess && isNewMode) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branchId', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches, isNewMode]);
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext<BillFormValues>();
  const { warehouses, isWarehousesSuccess, isNewMode } = useBillFormContext();

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

/**
 * Detarmines whether the bill has foreign customer.
 * @returns {boolean}
 */
export const useBillIsForeignCustomer = (): boolean => {
  const { values } = useFormikContext<BillFormValues>();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const isForeignCustomer = React.useMemo(
    () => values.currencyCode !== baseCurrency,
    [values.currencyCode, baseCurrency],
  );
  return isForeignCustomer;
};

/**
 * Re-calculates the entries tax amount when editing.
 * @returns {string}
 */
export const composeEntriesOnEditInclusiveTax = (
  inclusiveExclusiveTax: string,
  entries: BillFormEntry[],
): BillFormEntry[] => {
  return assignEntriesTaxAmount(inclusiveExclusiveTax === 'inclusive')(
    entries,
  ) as BillFormEntry[];
};

/**
 * Retreives the bill aggregated tax rates.
 * @returns {Array}
 */
export const useBillAggregatedTaxRates = () => {
  const { values } = useFormikContext<BillFormValues>();
  const { taxRates } = useBillFormContext();

  const aggregateTaxRates = React.useMemo(
    () => aggregateItemEntriesTaxRates(values.currencyCode, taxRates),
    [values.currencyCode, taxRates],
  );
  // Calculate the total tax amount of bill entries.
  return React.useMemo(() => {
    return aggregateTaxRates(values.entries);
  }, [aggregateTaxRates, values.entries]);
};

/**
 * Retrieves the bill subtotal.
 * @returns {number}
 */
export const useBillSubtotal = (): number => {
  const {
    values: { entries },
  } = useFormikContext<BillFormValues>();

  // Calculate the total due amount of bill entries.
  return React.useMemo(() => getEntriesTotal(entries), [entries]);
};

/**
 * Retrieves the bill subtotal formatted.
 * @returns {string}
 */
export const useBillSubtotalFormatted = (): string => {
  const subtotal = useBillSubtotal();
  const { values } = useFormikContext<BillFormValues>();

  return formattedAmount(subtotal, values.currencyCode);
};

/**
 * Retrieves the bill discount amount.
 * @returns {number}
 */
export const useBillDiscountAmount = (): number => {
  const { values } = useFormikContext<BillFormValues>();
  const subtotal = useBillSubtotal();
  const discount = toSafeNumber(values.discount);

  return values?.discountType === 'percentage'
    ? (subtotal * discount) / 100
    : discount;
};

/**
 * Retrieves the bill discount amount formatted.
 * @returns {string}
 */
export const useBillDiscountAmountFormatted = (): string => {
  const discountAmount = useBillDiscountAmount();
  const { values } = useFormikContext<BillFormValues>();

  return formattedAmount(discountAmount, values.currencyCode);
};

/**
 * Retrieves the bill adjustment amount.
 * @returns {number}
 */
export const useBillAdjustmentAmount = (): number => {
  const { values } = useFormikContext<BillFormValues>();

  return toSafeNumber(values.adjustment);
};

/**
 * Retrieves the bill adjustment amount formatted.
 * @returns {string}
 */
export const useBillAdjustmentAmountFormatted = (): string => {
  const adjustmentAmount = useBillAdjustmentAmount();
  const { values } = useFormikContext<BillFormValues>();

  return formattedAmount(adjustmentAmount, values.currencyCode);
};

/**
 * Retrieves the bill total tax amount.
 * @returns {number}
 */
export const useBillTotalTaxAmount = (): number => {
  const { values } = useFormikContext<BillFormValues>();

  return React.useMemo(() => {
    return chain(values.entries)
      .filter((entry) => Boolean(entry.taxAmount))
      .sumBy('taxAmount')
      .value();
  }, [values.entries]);
};

/**
 * Detarmines whether the tax is exclusive.
 * @returns {boolean}
 */
export const useIsBillTaxExclusive = (): boolean => {
  const { values } = useFormikContext<BillFormValues>();

  return values.inclusiveExclusiveTax === TaxType.Exclusive;
};

/**
 * Retrieves the bill total.
 * @returns {number}
 */
export const useBillTotal = (): number => {
  const subtotal = useBillSubtotal();
  const totalTaxAmount = useBillTotalTaxAmount();
  const isExclusiveTax = useIsBillTaxExclusive();
  const discountAmount = useBillDiscountAmount();
  const adjustmentAmount = useBillAdjustmentAmount();

  let total = subtotal + adjustmentAmount - discountAmount;
  if (isExclusiveTax) {
    total += totalTaxAmount;
  }
  return total;
};

/**
 * Retrieves the bill total formatted.
 * @returns {string}
 */
export const useBillTotalFormatted = (): string => {
  const total = useBillTotal();
  const { values } = useFormikContext<BillFormValues>();

  return formattedAmount(total, values.currencyCode);
};

/**
 * Retrieves the bill paid amount.
 * @returns {number}
 */
export const useBillPaidAmount = (): number => {
  const { values } = useFormikContext<BillFormValues>();

  return toSafeNumber(0);
};

/**
 * Retrieves the bill paid amount formatted.
 * @returns {string}
 */
export const useBillPaidAmountFormatted = (): string => {
  const paidAmount = useBillPaidAmount();
  const { values } = useFormikContext<BillFormValues>();

  return formattedAmount(paidAmount, values.currencyCode);
};

/**
 * Retrieves the bill due amount.
 * @returns {number}
 */
export const useBillDueAmount = (): number => {
  const total = useBillTotal();
  const paidAmount = useBillPaidAmount();

  return total - paidAmount;
};

/**
 * Retrieves the bill due amount formatted.
 * @returns {string}
 */
export const useBillDueAmountFormatted = (): string => {
  const dueAmount = useBillDueAmount();
  const { values } = useFormikContext<BillFormValues>();

  return formattedAmount(dueAmount, values.currencyCode);
};
