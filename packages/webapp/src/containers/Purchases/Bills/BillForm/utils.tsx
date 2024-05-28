// @ts-nocheck
import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import { first, chain } from 'lodash';
import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { AppToaster } from '@/components';
import {
  defaultFastFieldShouldUpdate,
  transformToForm,
  repeatValue,
  orderingLinesIndexes,
  formattedAmount,
} from '@/utils';
import {
  updateItemsEntriesTotal,
  ensureEntriesHaveEmptyLine,
  assignEntriesTaxAmount,
  aggregateItemEntriesTaxRates,
} from '@/containers/Entries/utils';
import { useCurrentOrganization } from '@/hooks/state';
import {
  isLandedCostDisabled,
  getEntriesTotal,
} from '@/containers/Entries/utils';
import { useBillFormContext } from './BillFormProvider';
import { TaxType } from '@/interfaces/TaxRates';
import {
  transformAttachmentsToForm,
  transformAttachmentsToRequest,
} from '@/containers/Attachments/utils';

export const MIN_LINES_NUMBER = 1;

// Default bill entry.
export const defaultBillEntry = {
  index: 0,
  item_id: '',
  rate: '',
  discount: '',
  quantity: '',
  description: '',
  amount: '',
  landed_cost: false,
  tax_rate_id: '',
  tax_rate: '',
  tax_amount: '',
};

// Default bill.
export const defaultBill = {
  vendor_id: '',
  bill_number: '',
  bill_date: moment(new Date()).format('YYYY-MM-DD'),
  due_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  inclusive_exclusive_tax: TaxType.Inclusive,
  note: '',
  open: '',
  branch_id: '',
  warehouse_id: '',
  exchange_rate: 1,
  currency_code: '',
  entries: [...repeatValue(defaultBillEntry, MIN_LINES_NUMBER)],
  attachments: [],
};

export const ERRORS = {
  // Bills
  BILL_NUMBER_EXISTS: 'BILL.NUMBER.EXISTS',
  ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED:
    'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
  BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT: 'BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT',
};
/**
 * Transformes the bill to initial values of edit form.
 */
export const transformToEditForm = (bill) => {
  const initialEntries = [
    ...bill.entries.map((entry) => ({
      ...transformToForm(entry, defaultBillEntry),
      landed_cost_disabled: isLandedCostDisabled(entry.item),
    })),
    ...repeatValue(
      defaultBillEntry,
      Math.max(MIN_LINES_NUMBER - bill.entries.length, 0),
    ),
  ];
  const entries = R.compose(
    ensureEntriesHaveEmptyLine(defaultBillEntry),
    updateItemsEntriesTotal,
  )(initialEntries);

  const attachments = transformAttachmentsToForm(bill);

  return {
    ...transformToForm(bill, defaultBill),
    inclusive_exclusive_tax: bill.is_inclusive_tax
      ? TaxType.Inclusive
      : TaxType.Exclusive,
    entries,
    attachments,
  };
};

/**
 * Transformes bill entries to submit request.
 */
export const transformEntriesToSubmit = (entries) => {
  const transformBillEntry = R.compose(
    R.omit(['amount']),
    R.curry(transformToForm)(R.__, defaultBillEntry),
  );
  return R.compose(orderingLinesIndexes, R.map(transformBillEntry))(entries);
};

/**
 * Filters the givne non-zero entries.
 */
export const filterNonZeroEntries = (entries) => {
  return entries.filter((item) => item.item_id && item.quantity);
};

/**
 * Transformes form values to request body.
 */
export const transformFormValuesToRequest = (values) => {
  const entries = filterNonZeroEntries(values.entries);
  const attachments = transformAttachmentsToRequest(values);

  return {
    ...values,
    entries: transformEntriesToSubmit(entries),
    open: false,
    attachments,
  };
};

/**
 * Handle delete errors.
 */
export const handleDeleteErrors = (errors) => {
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

/**
 * Detarmines vendors fast field should update
 */
export const vendorsFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.shouldUpdateDeps.items !== oldProps.shouldUpdateDeps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

/**
 * Detarmines entries fast field should update.
 */
export const entriesFieldShouldUpdate = (newProps, oldProps) => {
  return (
    newProps.items !== oldProps.items ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};

// Transform response error to fields.
export const handleErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === ERRORS.BILL_NUMBER_EXISTS)) {
    setErrors({
      bill_number: intl.get('bill_number_exists'),
    });
  }
  if (
    errors.some(
      (e) => e.type === ERRORS.ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED,
    )
  ) {
    setErrors(
      AppToaster.show({
        intent: Intent.DANGER,
        message: 'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
      }),
    );
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
  const { setFieldValue } = useFormikContext();
  const { branches, isBranchesSuccess } = useBillFormContext();

  React.useEffect(() => {
    if (isBranchesSuccess) {
      const primaryBranch = branches.find((b) => b.primary) || first(branches);

      if (primaryBranch) {
        setFieldValue('branch_id', primaryBranch.id);
      }
    }
  }, [isBranchesSuccess, setFieldValue, branches]);
};

export const useSetPrimaryWarehouseToForm = () => {
  const { setFieldValue } = useFormikContext();
  const { warehouses, isWarehousesSuccess } = useBillFormContext();

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

/**
 * Retreives the bill totals.
 */
export const useBillTotals = () => {
  const {
    values: { currency_code: currencyCode },
  } = useFormikContext();

  // Retrieves the bill subtotal.
  const subtotal = useBillSubtotal();
  const total = useBillTotal();

  // Retrieves the formatted total money.
  const formattedTotal = React.useMemo(
    () => formattedAmount(total, currencyCode),
    [total, currencyCode],
  );
  // Retrieves the formatted subtotal.
  const formattedSubtotal = React.useMemo(
    () => formattedAmount(subtotal, currencyCode, { money: false }),
    [subtotal, currencyCode],
  );
  // Retrieves the payment total.
  const paymentTotal = React.useMemo(() => 0, []);

  // Retireves the formatted payment total.
  const formattedPaymentTotal = React.useMemo(
    () => formattedAmount(paymentTotal, currencyCode),
    [paymentTotal, currencyCode],
  );
  // Retrieves the formatted due total.
  const dueTotal = React.useMemo(
    () => total - paymentTotal,
    [total, paymentTotal],
  );
  // Retrieves the formatted due total.
  const formattedDueTotal = React.useMemo(
    () => formattedAmount(dueTotal, currencyCode),
    [dueTotal, currencyCode],
  );

  return {
    total,
    paymentTotal,
    dueTotal,
    formattedTotal,
    formattedSubtotal,
    formattedPaymentTotal,
    formattedDueTotal,
  };
};

/**
 * Detarmines whether the bill has foreign customer.
 * @returns {boolean}
 */
export const useBillIsForeignCustomer = () => {
  const { values } = useFormikContext();
  const currentOrganization = useCurrentOrganization();

  const isForeignCustomer = React.useMemo(
    () => values.currency_code !== currentOrganization.base_currency,
    [values.currency_code, currentOrganization.base_currency],
  );
  return isForeignCustomer;
};

/**
 * Re-calculates the entries tax amount when editing.
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
 * Retreives the bill aggregated tax rates.
 * @returns {Array}
 */
export const useBillAggregatedTaxRates = () => {
  const { values } = useFormikContext();
  const { taxRates } = useBillFormContext();

  const aggregateTaxRates = React.useMemo(
    () => aggregateItemEntriesTaxRates(values.currency_code, taxRates),
    [values.currency_code, taxRates],
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
export const useBillSubtotal = () => {
  const {
    values: { entries },
  } = useFormikContext();

  // Calculate the total due amount of bill entries.
  return React.useMemo(() => getEntriesTotal(entries), [entries]);
};

/**
 * Retreives the bill total tax amount.
 * @returns {number}
 */
export const useBillTotalTaxAmount = () => {
  const { values } = useFormikContext();

  return React.useMemo(() => {
    return chain(values.entries)
      .filter((entry) => entry.tax_amount)
      .sumBy('tax_amount')
      .value();
  }, [values.entries]);
};

/**
 * Detarmines whether the tax is exclusive.
 * @returns {boolean}
 */
export const useIsBillTaxExclusive = () => {
  const { values } = useFormikContext();

  return values.inclusive_exclusive_tax === TaxType.Exclusive;
};

/**
 * Retreives the bill total.
 * @returns {number}
 */
export const useBillTotal = () => {
  const subtotal = useBillSubtotal();
  const totalTaxAmount = useBillTotalTaxAmount();
  const isExclusiveTax = useIsBillTaxExclusive();

  return R.compose(R.when(R.always(isExclusiveTax), R.add(totalTaxAmount)))(
    subtotal,
  );
};
